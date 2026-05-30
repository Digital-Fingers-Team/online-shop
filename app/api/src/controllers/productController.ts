import { asyncHandler } from '../middleware/asyncHandler.js';
import { productService } from '../services/productService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { requireParam } from '../utils/requestParams.js';

export const productController = {
  list: asyncHandler(async (req, res) => sendSuccess(res, await productService.list(req.query as never))),
  get: asyncHandler(async (req, res) => sendSuccess(res, await productService.get(requireParam(req.params, 'id')))),
  create: asyncHandler(async (req, res) => sendSuccess(res, await productService.create(req.body), 'Product created', 201)),
  update: asyncHandler(async (req, res) => sendSuccess(res, await productService.update(requireParam(req.params, 'id'), req.body), 'Product updated')),
  remove: asyncHandler(async (req, res) => sendSuccess(res, await productService.remove(requireParam(req.params, 'id')), 'Product archived'))
};
