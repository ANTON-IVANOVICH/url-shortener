import prisma from '../db';
import { Click } from '@prisma/client';
import { IClickRepository } from './interfaces/IClick';

export class ClickRepository implements IClickRepository {
  record(urlId: string, ipAddress: string): Promise<Click> {
    return prisma.click.create({ data: { urlId, ipAddress } });
  }

  findLastByUrlId(urlId: string, limit = 5): Promise<Click[]> {
    return prisma.click.findMany({
      where: { urlId },
      orderBy: { clickedAt: 'desc' },
      take: limit,
    });
  }
}
