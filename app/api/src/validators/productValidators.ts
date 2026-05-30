import { z } from 'zod';
import { objectId, paginationQuery } from './commonValidators.js';

export const productListSchema = z.object({
  query: paginationQuery.extend({
    search: z.string().optional(),
    categoryId: objectId.optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    inStock: z.coerce.boolean().optional()
  })
});

export const productInput = z.object({
  name: z.string().min(2).max(160),
  description: z.string().min(10).max(4000),
  price: z.number().positive(),
  images: z.array(z.string().url()).default([]),
  inventory: z.number().int().min(0),
  categoryId: objectId,
  isActive: z.boolean().default(true)
});

export const createProductSchema = z.object({ body: productInput });
export const updateProductSchema = z.object({ body: productInput.partial(), params: z.object({ id: objectId }) });
