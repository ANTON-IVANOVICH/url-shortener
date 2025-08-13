import prisma from '../db';
import { Url, Click } from '@prisma/client';
import { IUrlRepository } from './interfaces/IUrl';

export class UrlRepository implements IUrlRepository {
  create(data: {
    originalUrl: string;
    shortUrl: string;
    alias?: string | null;
    expiresAt?: Date | null;
    ownerId: string;
  }): Promise<Url> {
    return prisma.url.create({ data });
  }

  findByShortUrl(
    shortUrl: string,
    opts?: { includeClicks: number },
  ): Promise<(Url & { clicks: Click[] }) | null> {
    return prisma.url.findUnique({
      where: { shortUrl },
      include: opts
        ? { clicks: { orderBy: { clickedAt: 'desc' }, take: opts.includeClicks } }
        : { clicks: false },
    });
  }

  async incrementClickCount(id: string) {
    await prisma.url.update({ where: { id }, data: { clickCount: { increment: 1 } } });
  }

  deleteById(id: string): Promise<Url> {
    return prisma.url.delete({ where: { id } });
  }
}
