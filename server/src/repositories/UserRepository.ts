import prisma from '../db';
import { IUserRepository } from './interfaces/IUser';

export class UserRepository implements IUserRepository {
  async create(email: string, passwordHash: string) {
    return prisma.user.create({ data: { email, password: passwordHash } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async saveRefreshToken(userId: string, token: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  async findByRefreshToken(token: string) {
    return prisma.user.findFirst({ where: { refreshToken: token } });
  }

  async clearRefreshToken(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
