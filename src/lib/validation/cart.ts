import { z } from "zod";

export const cartItemSchema = z.object({ productId: z.string().min(1), quantity: z.coerce.number().int().min(1).max(99).default(1) });
export const quantitySchema = z.object({ quantity: z.coerce.number().int().min(1).max(99) });
