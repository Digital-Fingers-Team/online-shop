import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

const includeCart = { items: { include: { product: { include: { category: true } } }, orderBy: { createdAt: 'asc' as const } } };

async function getOrCreateCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId }, include: includeCart });
  if (cart) return cart;
  return prisma.cart.create({ data: { userId }, include: includeCart });
}

export const cartService = {
  async get(userId: string) {
    return getOrCreateCart(userId);
  },

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
    if (!product) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    if (product.inventory < quantity) throw new AppError('Insufficient inventory', 409, 'INSUFFICIENT_INVENTORY');
    const cart = await getOrCreateCart(userId);
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } }
    });
    return this.get(userId);
  },

  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await getOrCreateCart(userId);
    if (quantity === 0) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
      return this.get(userId);
    }
    const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
    if (!product) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    if (product.inventory < quantity) throw new AppError('Insufficient inventory', 409, 'INSUFFICIENT_INVENTORY');
    await prisma.cartItem.update({ where: { cartId_productId: { cartId: cart.id, productId } }, data: { quantity } });
    return this.get(userId);
  },

  async clear(userId: string) {
    const cart = await getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.get(userId);
  }
};
