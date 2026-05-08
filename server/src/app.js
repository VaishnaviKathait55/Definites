import cors from 'cors';
import express from 'express';
import accessRequestRoutes from './routes/accessRequestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

function buildAllowedOrigins() {
  const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = new Set(configuredOrigins);

  for (const origin of configuredOrigins) {
    try {
      const url = new URL(origin);

      if (url.hostname === 'localhost') {
        allowedOrigins.add(`${url.protocol}//127.0.0.1${url.port ? `:${url.port}` : ''}`);
      }

      if (url.hostname === '127.0.0.1') {
        allowedOrigins.add(`${url.protocol}//localhost${url.port ? `:${url.port}` : ''}`);
      }
    } catch {

    }
  }

  return Array.from(allowedOrigins);
}

export function createApp() {
  const app = express();
  const allowedOrigins = buildAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS.`));
      },
      credentials: false,
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: process.env.APP_NAME || 'Definites Legal Practice Management',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/access-requests', accessRequestRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/auth', authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
