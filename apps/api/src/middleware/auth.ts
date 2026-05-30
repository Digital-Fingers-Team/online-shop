import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@marketplace/types";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/http-error.js";

export interface AuthUser { id: string; role: UserRole; email: string }
declare global { namespace Express { interface Request { user?: AuthUser } } }

export function signAccessToken(user: AuthUser) {
  return jwt.sign(user, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] });
}

export function signRefreshToken(user: AuthUser) {
  return jwt.sign({ id: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_TTL as jwt.SignOptions["expiresIn"] });
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) throw new HttpError(401, "Authentication required", "AUTH_REQUIRED");
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser;
    const user = await User.findById(payload.id).select("email role isSuspended");
    if (!user || user.isSuspended) throw new HttpError(401, "Account is not allowed", "AUTH_FORBIDDEN");
    req.user = { id: String(user._id), email: user.email, role: user.role as UserRole };
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "Invalid or expired token", "TOKEN_INVALID"));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, "Authentication required", "AUTH_REQUIRED"));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, "Insufficient permissions", "FORBIDDEN"));
    next();
  };
}
