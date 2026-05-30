import { asyncHandler } from '../middleware/asyncHandler.js';
import { orderService } from '../services/orderService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { requireParam } from '../utils/requestParams.js';

export const orderController = {
  checkout: asyncHandler(async (req, res) => sendSuccess(res, await orderService.checkout(req.user!.id, req.body.shippingAddress), 'Order created', 201)),
  listMine: asyncHandler(async (req, res) => sendSuccess(res, await orderService.listForUser(req.user!.id))),
  getMine: asyncHandler(async (req, res) => sendSuccess(res, await orderService.getForUser(req.user!.id, requireParam(req.params, 'id')))),
  listAll: asyncHandler(async (_req, res) => sendSuccess(res, await orderService.listAll())),
  updateStatus: asyncHandler(async (req, res) => sendSuccess(res, await orderService.updateStatus(requireParam(req.params, 'id'), req.body.status), 'Order status updated'))
};
