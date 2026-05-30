import { prisma } from '../config/prisma.js';

export const userService = {
  list() {
    return prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: 'desc' } });
  }
};
