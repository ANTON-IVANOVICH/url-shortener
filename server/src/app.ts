import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import requestIp from 'request-ip';
import urlRoutes from './routes/urlRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import { requireAuth } from './middlewares/authMiddleware';

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  );

  app.use(requestIp.mw({ attributeName: 'ip' }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

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
