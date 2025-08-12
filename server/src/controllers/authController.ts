import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { COOKIE_OPTIONS } from '../config/auth';

export async function register(req: Request, res: Response) {
  const { accessToken, refreshToken } = await authService.registerUser(
    req.body.email,
    req.body.password,
  );
  res
    .cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(201)
    .json({ accessToken });
}

export async function login(req: Request, res: Response) {
  const { accessToken, refreshToken } = await authService.loginUser(
    req.body.email,
    req.body.password,
  );
  res
    .cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ accessToken });
}

export async function refresh(req: Request, res: Response) {
  const oldToken = req.cookies['refresh_token'];
  if (!oldToken) return res.status(401).json({ error: 'No refresh token' });
  const { accessToken, refreshToken } = await authService.refreshTokens(oldToken);
  res
    .cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ accessToken });
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.user!.userId);
  res.clearCookie('refresh_token', COOKIE_OPTIONS).json({ message: 'Logged out' });
}
