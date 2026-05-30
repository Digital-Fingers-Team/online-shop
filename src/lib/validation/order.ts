import { z } from "zod";

export const checkoutSchema = z.object({
  address: z.string().min(10).max(500)
});

export const orderStatusSchema = z.object({ status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]) });
