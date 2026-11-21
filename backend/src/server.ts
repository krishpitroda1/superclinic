import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import clinicRoutes from './routes/clinic.routes';
import pharmacyRoutes from './routes/pharmacy.routes';
import webhookRoutes from './routes/webhook.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route Mounts
app.use('/api/v1/clinic', clinicRoutes);
app.use('/api/v1/pharmacy', pharmacyRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[UNHANDLED_ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[SERVER] SuperClinic & Pharmacy POS API running on port ${PORT}`);
  });
}

export default app;

