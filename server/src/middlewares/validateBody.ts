import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError, ZodIssue } from 'zod';
import { ApiError } from '../errors/ApiError';

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = (result.error as ZodError).issues.map((issue: ZodIssue) => issue.message);
      throw new ApiError(400, 'Validation failed', messages);
    }
    req.body = result.data;
    next();
  };
}
