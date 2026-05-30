import { z } from 'zod';
import { objectId } from './commonValidators.js';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2)
});

export const checkoutSchema = z.object({ body: z.object({ shippingAddress: shippingAddressSchema }) });
export const updateOrderStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']) })
});
