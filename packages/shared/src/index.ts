import { z } from "zod";

export const roles = ["customer", "seller", "admin"] as const;
export const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const emailSchema = z.string().email().toLowerCase().trim();
export const passwordSchema = z.string().min(8).max(128).regex(/[A-Z]/, "Password must include an uppercase letter").regex(/[a-z]/, "Password must include a lowercase letter").regex(/[0-9]/, "Password must include a number");

export const addressSchema = z.object({
  line1: z.string().max(160).optional(),
  line2: z.string().max(160).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(30).optional(),
  country: z.string().max(80).default("US").optional()
});

export const registerSchema = z.object({
  name: z.string().min(2).max(120).trim(),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(roles).default("customer"),
  sellerProfile: z.object({ storeName: z.string().min(2).max(120), bio: z.string().max(500).optional() }).optional()
});

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1) });

export const productInputSchema = z.object({
  title: z.string().min(3).max(180).trim(),
  description: z.string().min(20).max(5000),
  price: z.coerce.number().min(0),
  category: z.string().min(2).max(80).trim(),
  images: z.array(z.string().url()).min(1).max(8),
  stock: z.coerce.number().int().min(0),
  isActive: z.boolean().optional()
});

export const productQuerySchema = z.object({
  q: z.string().max(120).optional(),
  category: z.string().max(80).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12)
});

export const cartItemSchema = z.object({ productId: z.string().min(1), quantity: z.coerce.number().int().min(1).max(99).default(1) });
export const checkoutSchema = z.object({ address: z.string().min(10).max(500) });
export const statusSchema = z.object({ status: z.enum(orderStatuses) });
export const profileSchema = z.object({ name: z.string().min(2).max(120).optional(), address: addressSchema.optional(), sellerProfile: z.object({ storeName: z.string().min(2).max(120).optional(), bio: z.string().max(500).optional() }).optional() });
