import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return next(new AppError('Authentication required', 401, 'UNAUTHENTICATED'));

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return next(new AppError('User no longer exists', 401, 'UNAUTHENTICATED'));
    req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401, 'UNAUTHENTICATED'));
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401, 'UNAUTHENTICATED'));
    if (!roles.includes(req.user.role)) return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    return next();
  };
}
