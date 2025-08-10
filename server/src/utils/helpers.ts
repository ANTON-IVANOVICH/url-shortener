import crypto from 'crypto';

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

export const isUrlExpired = (expiresAt: Date | null): boolean => {
  return expiresAt ? new Date() > new Date(expiresAt) : false;
};
