import { Click } from '@prisma/client';

export interface IClickRepository {
  record(urlId: string, ipAddress: string): Promise<Click>;
  findLastByUrlId(urlId: string, limit: number): Promise<Click[]>;
}
