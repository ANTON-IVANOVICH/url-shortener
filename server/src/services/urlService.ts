import { ApiError } from '../errors/ApiError';
import { UrlRepository } from '../repositories/UrlRepository';
import { ClickRepository } from '../repositories/ClickRepository';
import { generateShortCode, isValidUrl, validateExpiration } from '../utils/helpers';

const urlRepo = new UrlRepository();
const clickRepo = new ClickRepository();

export async function createShortUrl(
  data: { originalUrl: string; alias?: string; expiresAt?: string },
  ip: string,
  ownerId: string,
) {
  if (!data.originalUrl || !isValidUrl(data.originalUrl)) {
    throw new ApiError(400, 'Invalid or missing originalUrl');
  }
  validateExpiration(data.expiresAt);

  const shortUrl = data.alias || (await generateUniqueCode());
  const created = await urlRepo.create({
    originalUrl: data.originalUrl,
    shortUrl,
    alias: data.alias ?? null,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    ownerId,
  });
  return { shortUrl: created.shortUrl };
}

async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generateShortCode(6);
    if (!(await urlRepo.findByShortUrl(code))) {
      return code;
    }
  }
  throw new ApiError(500, 'Failed to generate unique short URL');
}

export async function resolveShortUrl(shortUrl: string, ip: string): Promise<string> {
  const url = await urlRepo.findByShortUrl(shortUrl);
  if (!url) throw new ApiError(404, 'URL not found');
  if (url.expiresAt && new Date() > url.expiresAt) throw new ApiError(410, 'URL has expired');

  await Promise.all([urlRepo.incrementClickCount(url.id), clickRepo.record(url.id, ip)]);

  return url.originalUrl;
}

export async function getUrlInfo(shortUrl: string) {
  const url = await urlRepo.findByShortUrl(shortUrl, { includeClicks: 5 });
  if (!url) throw new ApiError(404, 'URL not found');

  return {
    originalUrl: url.originalUrl,
    createdAt: url.createdAt,
    clickCount: url.clickCount,
    expiresAt: url.expiresAt,
    lastClicks: url.clicks.map((c) => ({ clickedAt: c.clickedAt })),
  };
}

export async function deleteShortUrl(shortUrl: string) {
  const url = await urlRepo.findByShortUrl(shortUrl);
  if (!url) throw new ApiError(404, 'URL not found');
  await urlRepo.deleteById(url.id);
}

export async function getAnalytics(shortUrl: string) {
  const url = await urlRepo.findByShortUrl(shortUrl, { includeClicks: 5 });
  if (!url) throw new ApiError(404, 'URL not found');

  return {
    totalClicks: url.clickCount,
    lastClicks: url.clicks.map((c) => ({ ipAddress: c.ipAddress, clickedAt: c.clickedAt })),
  };
}
