import { asyncHandler } from '../middleware/asyncHandler.js';
import { categoryService } from '../services/categoryService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { requireParam } from '../utils/requestParams.js';

export const categoryController = {
  list: asyncHandler(async (_req, res) => sendSuccess(res, await categoryService.list())),
  create: asyncHandler(async (req, res) => sendSuccess(res, await categoryService.create(req.body), 'Category created', 201)),
  update: asyncHandler(async (req, res) => sendSuccess(res, await categoryService.update(requireParam(req.params, 'id'), req.body), 'Category updated')),
  remove: asyncHandler(async (req, res) => sendSuccess(res, await categoryService.remove(requireParam(req.params, 'id')), 'Category deleted'))
};
