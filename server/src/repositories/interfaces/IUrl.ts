import { Url, Click } from '@prisma/client';

export interface IUrlRepository {
  create(data: { originalUrl: string; shortUrl: string; alias?: string | null; expiresAt?: Date | null }): Promise<Url>;
  findByShortUrl(shortUrl: string): Promise<(Url & { clicks: Click[] }) | null>;
  deleteById(id: string): Promise<Url>;
}
