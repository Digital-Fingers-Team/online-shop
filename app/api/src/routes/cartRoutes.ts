import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { addCartItemSchema, updateCartItemSchema } from '../validators/cartValidators.js';

export const cartRoutes = Router();
cartRoutes.use(authenticate);
cartRoutes.get('/', cartController.get);
cartRoutes.post('/items', validate(addCartItemSchema), cartController.add);
cartRoutes.patch('/items/:productId', validate(updateCartItemSchema), cartController.update);
cartRoutes.delete('/', cartController.clear);
