import { z } from 'zod';
import { objectId } from './commonValidators.js';

export const addCartItemSchema = z.object({
  body: z.object({ productId: objectId, quantity: z.number().int().min(1).max(99) })
});

export const updateCartItemSchema = z.object({
  params: z.object({ productId: objectId }),
  body: z.object({ quantity: z.number().int().min(0).max(99) })
});
