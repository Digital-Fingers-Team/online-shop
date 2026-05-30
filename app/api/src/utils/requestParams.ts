import { AppError } from './AppError.js';

export function requireParam(params: Record<string, string | undefined>, key: string) {
  const value = params[key];
  if (!value) throw new AppError(`Missing route parameter: ${key}`, 400, 'MISSING_ROUTE_PARAM');
  return value;
}
