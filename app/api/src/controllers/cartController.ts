import { asyncHandler } from '../middleware/asyncHandler.js';
import { cartService } from '../services/cartService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const cartController = {
  get: asyncHandler(async (req, res) => sendSuccess(res, await cartService.get(req.user!.id))),
  add: asyncHandler(async (req, res) => sendSuccess(res, await cartService.addItem(req.user!.id, req.body.productId, req.body.quantity), 'Cart updated')),
  update: asyncHandler(async (req, res) => sendSuccess(res, await cartService.updateItem(req.user!.id, req.params.productId, req.body.quantity), 'Cart updated')),
  clear: asyncHandler(async (req, res) => sendSuccess(res, await cartService.clear(req.user!.id), 'Cart cleared'))
};
