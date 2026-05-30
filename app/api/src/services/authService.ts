import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';

function publicUser(user: { id: string; email: string; name: string; role: 'ADMIN' | 'CUSTOMER'; createdAt: Date }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
}

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new AppError('Email is already registered', 409, 'EMAIL_IN_USE');
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash } });
    await prisma.cart.create({ data: { userId: user.id } });
    return { user: publicUser(user), token: signToken({ userId: user.id, role: user.role }) };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    const matches = await bcrypt.compare(input.password, user.passwordHash);
    if (!matches) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    return { user: publicUser(user), token: signToken({ userId: user.id, role: user.role }) };
  }
};
