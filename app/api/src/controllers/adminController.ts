import { asyncHandler } from '../middleware/asyncHandler.js';
import { userService } from '../services/userService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const adminController = {
  users: asyncHandler(async (_req, res) => sendSuccess(res, await userService.list()))
};
