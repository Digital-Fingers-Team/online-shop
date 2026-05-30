import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(["customer", "seller"]).default("customer"),
  storeName: z.string().min(2).max(120).optional()
});

export const loginSchema = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(8).max(128) });
