import { Request, Response } from 'express';
import * as urlService from '../services/urlService';

export const shortenUrl = async (req: Request, res: Response) => {
  const ownerId = req.user!.userId;
  const result = await urlService.createShortUrl(req.body, req.ip!, ownerId);
  res.status(201).json({ shortUrl: result.shortUrl });
};

export const redirectUrl = async (req: Request, res: Response) => {
  const originalUrl = await urlService.resolveShortUrl(req.params.shortUrl, req.ip!);
  res.redirect(302, originalUrl);
};

export const getUrlInfo = async (req: Request, res: Response) => {
  const info = await urlService.getUrlInfo(req.params.shortUrl);
  res.json(info);
};

export const deleteUrl = async (req: Request, res: Response) => {
  await urlService.deleteShortUrl(req.params.shortUrl);
  res.status(204).end();
};

export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await urlService.getAnalytics(req.params.shortUrl);
  res.json(analytics);
};
