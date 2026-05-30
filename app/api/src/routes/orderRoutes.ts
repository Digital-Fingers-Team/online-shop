import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validators/commonValidators.js';
import { checkoutSchema } from '../validators/orderValidators.js';

export const orderRoutes = Router();
orderRoutes.use(authenticate);
orderRoutes.post('/checkout', validate(checkoutSchema), orderController.checkout);
orderRoutes.get('/', orderController.listMine);
orderRoutes.get('/:id', validate(idParamSchema), orderController.getMine);
