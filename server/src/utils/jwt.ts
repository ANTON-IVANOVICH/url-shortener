import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  REFRESH_TOKEN_EXPIRATION,
} from '../config/auth';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET_ACCESS, { expiresIn: ACCESS_TOKEN_EXPIRATION });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET_REFRESH, { expiresIn: REFRESH_TOKEN_EXPIRATION });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET_ACCESS) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET_REFRESH) as JwtPayload;
}
