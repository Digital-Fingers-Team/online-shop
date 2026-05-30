import { Role } from '@prisma/client';
import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { orderController } from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { updateOrderStatusSchema } from '../validators/orderValidators.js';

export const adminRoutes = Router();
adminRoutes.use(authenticate, authorize(Role.ADMIN));
adminRoutes.get('/users', adminController.users);
adminRoutes.get('/orders', orderController.listAll);
adminRoutes.patch('/orders/:id/status', validate(updateOrderStatusSchema), orderController.updateStatus);
