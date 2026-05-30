import { Role } from '@prisma/client';
import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validators/commonValidators.js';
import { createProductSchema, productListSchema, updateProductSchema } from '../validators/productValidators.js';

export const productRoutes = Router();
productRoutes.get('/', validate(productListSchema), productController.list);
productRoutes.get('/:id', validate(idParamSchema), productController.get);
productRoutes.post('/', authenticate, authorize(Role.ADMIN), validate(createProductSchema), productController.create);
productRoutes.patch('/:id', authenticate, authorize(Role.ADMIN), validate(updateProductSchema), productController.update);
productRoutes.delete('/:id', authenticate, authorize(Role.ADMIN), validate(idParamSchema), productController.remove);
