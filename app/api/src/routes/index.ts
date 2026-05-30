import { Router } from 'express';
import { adminRoutes } from './adminRoutes.js';
import { authRoutes } from './authRoutes.js';
import { cartRoutes } from './cartRoutes.js';
import { categoryRoutes } from './categoryRoutes.js';
import { orderRoutes } from './orderRoutes.js';
import { productRoutes } from './productRoutes.js';

export const apiRoutes = Router();
apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/products', productRoutes);
apiRoutes.use('/categories', categoryRoutes);
apiRoutes.use('/cart', cartRoutes);
apiRoutes.use('/orders', orderRoutes);
apiRoutes.use('/admin', adminRoutes);
