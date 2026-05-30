import type { Response } from 'express';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: { code: string; details?: unknown };
};

export function sendSuccess<T>(res: Response, data: T, message?: string, status = 200) {
  return res.status(status).json({ success: true, data, message } satisfies ApiResponse<T>);
}
