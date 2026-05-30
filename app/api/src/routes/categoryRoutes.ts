import { Role } from '@prisma/client';
import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validators/commonValidators.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidators.js';

export const categoryRoutes = Router();
categoryRoutes.get('/', categoryController.list);
categoryRoutes.post('/', authenticate, authorize(Role.ADMIN), validate(createCategorySchema), categoryController.create);
categoryRoutes.patch('/:id', authenticate, authorize(Role.ADMIN), validate(updateCategorySchema), categoryController.update);
categoryRoutes.delete('/:id', authenticate, authorize(Role.ADMIN), validate(idParamSchema), categoryController.remove);
