import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * 1. Meta WhatsApp Cloud API Webhook Challenge Verification (GET)
 */
router.get('/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[WHATSAPP_WEBHOOK] Verified webhook endpoint');
    return res.status(200).send(challenge);
  }

  res.status(403).json({ error: 'Verification token mismatch' });
});

/**
 * 2. Incoming WhatsApp Message & Status Callback Listener (POST)
 * Receives delivery receipts (sent, delivered, read, failed) from Meta or Twilio.
 */
router.post('/whatsapp', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Fast-ack webhook immediately to prevent 504 timeouts from provider
    res.status(200).json({ status: 'received' });

    // Handle Meta WhatsApp Cloud API event structure
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          const statuses = value.statuses || [];

          for (const statusObj of statuses) {
            const providerMsgId = statusObj.id;
            const status = statusObj.status; // 'sent', 'delivered', 'read', 'failed'
            const timestamp = statusObj.timestamp 
              ? new Date(parseInt(statusObj.timestamp, 10) * 1000).toISOString() 
              : new Date().toISOString();

            const updatePayload: any = { status };
            if (status === 'sent') updatePayload.sent_at = timestamp;
            if (status === 'delivered') updatePayload.delivered_at = timestamp;
            if (status === 'read') updatePayload.read_at = timestamp;
            if (status === 'failed') {
              updatePayload.error_message = JSON.stringify(statusObj.errors || 'Delivery failed');
            }

            await supabase
              .from('whatsapp_broadcast_logs')
              .update(updatePayload)
              .eq('provider_message_id', providerMsgId);
          }
        }
      }
    }

    // Handle Twilio Webhook event structure (application/x-www-form-urlencoded)
    if (req.body.MessageSid && req.body.MessageStatus) {
      const providerMsgId = req.body.MessageSid;
      const status = req.body.MessageStatus; // 'queued', 'sent', 'delivered', 'undelivered', 'failed'
      
      const updatePayload: any = { status: status === 'undelivered' ? 'failed' : status };
      if (status === 'delivered') updatePayload.delivered_at = new Date().toISOString();
      if (status === 'failed' || status === 'undelivered') {
        updatePayload.error_message = req.body.ErrorMessage || 'Twilio delivery failed';
      }

      await supabase
        .from('whatsapp_broadcast_logs')
        .update(updatePayload)
        .eq('provider_message_id', providerMsgId);
    }
  } catch (err: any) {
    console.error('[WEBHOOK_ERROR] Failed to process WhatsApp status:', err);
  }
});

export default router;

