import express from 'express';
import accessRequestRoutes from './routes/accessRequestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://definites.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://definitesconsultants.com',
  ];

  // ✅ CORS — must be before all routes
  app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin'); // important for caching/CDN
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
  // app.use((req, res, next) => {
  //   const origin = req.headers.origin;

  //   if (!origin || allowedOrigins.includes(origin)) {
  //     res.setHeader('Access-Control-Allow-Origin', origin || '*');
  //   }

  //   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.setHeader('Access-Control-Allow-Credentials', 'true');

  //   // Handle preflight immediately
  //   if (req.method === 'OPTIONS') {
  //     return res.sendStatus(204);
  //   }

  //   next();
  // });

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: process.env.APP_NAME || 'Definites Legal Practice Management',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/request-access', accessRequestRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/auth', authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}