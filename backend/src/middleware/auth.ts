import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { AuthenticatedUser, UserRole, TenantType } from '../types';

// Supabase client instance (initialized with Service Role key for backend auth verification & audit inserts)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Extend Express Request interface to include tenant & user context
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * 1. Base Authentication Middleware
 * Validates Supabase JWT, resolves user profile, tenant_id, and tenant_type.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or malformed Authorization header.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      res.status(401).json({ error: 'Invalid or expired session token.' });
      return;
    }

    // Retrieve user profile + tenant metadata
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        role,
        tenant_id,
        tenants (
          id,
          type,
          is_active
        )
      `)
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      res.status(403).json({ error: 'User profile not found or inactive.' });
      return;
    }

    const tenant = profile.tenants as any;

    if (profile.role !== 'super_admin') {
      if (!tenant || !tenant.is_active) {
        res.status(403).json({ error: 'Tenant subscription is inactive or suspended.' });
        return;
      }
    }

    req.user = {
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
      tenant_id: profile.tenant_id,
      tenant_type: tenant?.type as TenantType
    };

    next();
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server authentication error', details: err.message });
  }
}

/**
 * 2. Strict Tenant Type Isolation Middleware
 * Prevents Pharmacy users from accessing Clinic routes and Clinic users from accessing Pharmacy routes.
 */
export function requireTenantType(expectedType: TenantType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    // SuperAdmin bypasses tenant type restrictions
    if (req.user.role === 'super_admin') {
      return next();
    }

    if (req.user.tenant_type !== expectedType) {
      res.status(403).json({
        error: `Cross-product isolation violation: Tenant is '${req.user.tenant_type}', but this endpoint requires '${expectedType}'.`
      });
      return;
    }

    next();
  };
}

/**
 * 3. Role-Based Access Control (RBAC) Guard Middleware
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    // SuperAdmin can access any RBAC guarded route
    if (req.user.role === 'super_admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Role '${req.user.role}' lacks permission for this action.`
      });
      return;
    }

    next();
  };
}

/**
 * 4. EMR Read Access Audit Logger Middleware (HIPAA/GDPR Compliance)
 * Database triggers capture CREATE, UPDATE, DELETE.
 * This middleware captures all READ and EXPORT events on patient EMR and prescriptions.
 */
export function emrAuditLogger(resourceType: 'PATIENT_EMR' | 'PRESCRIPTION' | 'BILLING') {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute after response completes or during read request
    const resourceId = req.params.id || req.params.patientId || req.params.prescriptionId;

    if (req.method === 'GET' && resourceId && req.user) {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      // Non-blocking async audit insert
      supabase.from('audit_logs').insert({
        tenant_id: req.user.tenant_id,
        user_id: req.user.id,
        user_email: req.user.email,
        user_role: req.user.role,
        action: req.path.includes('/export-pdf') ? 'EXPORT_PDF' : 'READ',
        resource_type: resourceType,
        resource_id: resourceId,
        ip_address: clientIp,
        user_agent: userAgent
      }).then(({ error }) => {
        if (error) console.error('[AUDIT_ERROR] Failed to record EMR read audit:', error);
      });
    }

    next();
  };
}

