import { prisma } from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';

export const categoryService = {
  list() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  },
  create(input: { name: string; description?: string }) {
    return prisma.category.create({ data: { ...input, slug: slugify(input.name) } });
  },
  update(id: string, input: { name?: string; description?: string }) {
    return prisma.category.update({ where: { id }, data: { ...input, ...(input.name ? { slug: slugify(input.name) } : {}) } });
  },
  remove(id: string) {
    return prisma.category.delete({ where: { id } });
  }
};
