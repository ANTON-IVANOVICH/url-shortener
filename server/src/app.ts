import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import requestIp from 'request-ip';
import urlRoutes from './routes/urlRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import { requireAuth } from './middlewares/authMiddleware';
import { asyncHandler } from './middlewares/asyncHandler';
import { redirectUrl } from './controllers/urlController';

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
      credentials: true,
    }),
  );

  app.use(requestIp.mw({ attributeName: 'ip' }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/:shortUrl', asyncHandler(redirectUrl));

  app.use('/api/auth', authRoutes);

  app.use('/api/urls', requireAuth, urlRoutes);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
};

export default createApp;
