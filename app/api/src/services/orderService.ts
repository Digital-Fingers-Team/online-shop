import type { OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

const includeOrder = { items: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } };

export const orderService = {
  async checkout(userId: string, shippingAddress: Prisma.InputJsonValue) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
      if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400, 'EMPTY_CART');

      for (const item of cart.items) {
        if (!item.product.isActive || item.product.inventory < item.quantity) {
          throw new AppError(`Insufficient inventory for ${item.product.name}`, 409, 'INSUFFICIENT_INVENTORY');
        }
      }

      const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PAID',
          total,
          shippingAddress,
          items: { create: cart.items.map((item) => ({ productId: item.productId, name: item.product.name, price: item.product.price, quantity: item.quantity })) }
        },
        include: includeOrder
      });

      await Promise.all(cart.items.map((item) => tx.product.update({ where: { id: item.productId }, data: { inventory: { decrement: item.quantity } } })));
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  },

  listForUser(userId: string) {
    return prisma.order.findMany({ where: { userId }, include: includeOrder, orderBy: { createdAt: 'desc' } });
  },

  async getForUser(userId: string, id: string) {
    const order = await prisma.order.findFirst({ where: { id, userId }, include: includeOrder });
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    return order;
  },

  listAll() {
    return prisma.order.findMany({ include: includeOrder, orderBy: { createdAt: 'desc' } });
  },

  updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status }, include: includeOrder });
  }
};
