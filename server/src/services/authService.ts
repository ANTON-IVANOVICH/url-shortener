import bcrypt from 'bcrypt';
import { ApiError } from '../errors/ApiError';
import { JwtPayload, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { UserRepository } from '../repositories/UserRepository';

const userRepo = new UserRepository();

export async function registerUser(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await userRepo.create(email, hashed);
  return issueTokens(user.id, user.email);
}

export async function loginUser(email: string, password: string) {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, 'Invalid credentials');
  return issueTokens(user.id, user.email);
}

async function issueTokens(userId: string, email: string) {
  const payload: JwtPayload = { userId, email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await userRepo.saveRefreshToken(userId, refreshToken);
  return { accessToken, refreshToken };
}

export async function refreshTokens(oldToken: string) {
  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(oldToken);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const user = await userRepo.findByRefreshToken(oldToken);
  if (!user) throw new ApiError(401, 'Refresh token not recognized');
  return issueTokens(user.id, user.email);
}

export async function logout(userId: string) {
  await userRepo.clearRefreshToken(userId);
}
