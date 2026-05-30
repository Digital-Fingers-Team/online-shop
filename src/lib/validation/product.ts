import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(20).max(5000),
  price: z.coerce.number().min(0),
  category: z.string().min(2).max(80),
  images: z.preprocess((value) => (typeof value === "string" ? [value] : value), z.array(z.string().url()).min(1).max(8)),
  stock: z.coerce.number().int().min(0).max(100000),
  isActive: z.boolean().optional()
});

export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  seller: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(12)
});
