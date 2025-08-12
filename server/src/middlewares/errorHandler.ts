import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Duplicate field value.', details: err.meta });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
