import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import urlRoutes from './routes/urlRoutes';
import requestIp from 'request-ip';

config();

const createApp = () => {
  const app = express();

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });
  app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    }),
  );
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', true);
  }
  app.use(bodyParser.json());
  // if (process.env.NODE_ENV === 'test') {
  //   app.use((req, res, next) => {
  //     req.ip = '192.168.0.1';
  //     next();
  //   });
  // } else {
  //   app.use(requestIp.mw());
  // }
  app.use(requestIp.mw({ attributeName: 'ip' }));

  app.use('/api', urlRoutes);

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
};

export default createApp;
