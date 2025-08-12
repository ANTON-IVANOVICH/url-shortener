import crypto from 'crypto';
import { ApiError } from '../errors/ApiError';

export const generateShortCode = (length = 6): string => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function validateExpiration(expiresAt?: string) {
  if (!expiresAt) return;
  const date = new Date(expiresAt);
  if (isNaN(date.getTime())) throw new ApiError(400, 'Invalid expiration date format');
  if (new Date() > date) throw new ApiError(400, 'Expiration date must be in the future');
}
