export const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS || 'change_me_access';
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || 'change_me_refresh';
export const ACCESS_TOKEN_EXPIRATION = '15m';
export const REFRESH_TOKEN_EXPIRATION = '7d';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/auth',
};
