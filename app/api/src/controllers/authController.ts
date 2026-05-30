import { asyncHandler } from '../middleware/asyncHandler.js';
import { authService } from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const authController = {
  register: asyncHandler(async (req, res) => sendSuccess(res, await authService.register(req.body), 'Registered successfully', 201)),
  login: asyncHandler(async (req, res) => sendSuccess(res, await authService.login(req.body), 'Logged in successfully')),
  me: asyncHandler(async (req, res) => sendSuccess(res, req.user, 'Authenticated user'))
};
