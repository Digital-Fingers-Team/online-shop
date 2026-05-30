import { z } from 'zod';
import { objectId } from './commonValidators.js';

export const categoryInput = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional()
});

export const createCategorySchema = z.object({ body: categoryInput });
export const updateCategorySchema = z.object({ body: categoryInput.partial(), params: z.object({ id: objectId }) });
