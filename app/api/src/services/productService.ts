import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { slugify } from '../utils/slugify.js';

export const productInclude = { category: true } satisfies Prisma.ProductInclude;

export const productService = {
  async list(query: { page: number; limit: number; search?: string; categoryId?: string; minPrice?: number; maxPrice?: number; inStock?: boolean }) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(query.search ? { OR: [{ name: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }] } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.inStock ? { inventory: { gt: 0 } } : {}),
      ...((query.minPrice !== undefined || query.maxPrice !== undefined) ? { price: { gte: query.minPrice, lte: query.maxPrice } } : {})
    };
    const [items, total] = await Promise.all([
      prisma.product.findMany({ where, include: productInclude, orderBy: { createdAt: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit }),
      prisma.product.count({ where })
    ]);
    return { items, meta: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) } };
  },

  async get(id: string) {
    const product = await prisma.product.findFirst({ where: { id, isActive: true }, include: productInclude });
    if (!product) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    return product;
  },

  async create(input: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data: { ...input, slug: slugify(input.name) }, include: productInclude });
  },

  async update(id: string, input: Prisma.ProductUncheckedUpdateInput) {
    return prisma.product.update({ where: { id }, data: { ...input, ...(typeof input.name === 'string' ? { slug: slugify(input.name) } : {}) }, include: productInclude });
  },

  async remove(id: string) {
    return prisma.product.update({ where: { id }, data: { isActive: false } });
  }
};
