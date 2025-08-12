import { User } from '@prisma/client';

export interface IUserRepository {
  create(email: string, passwordHash: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  saveRefreshToken(userId: string, token: string): Promise<void>;
  findByRefreshToken(token: string): Promise<User | null>;
  clearRefreshToken(userId: string): Promise<void>;
}
