import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/http-error.js";
import { serializeUser } from "../utils/serialize.js";
import { signAccessToken, signRefreshToken } from "../middleware/auth.js";
import type { Response } from "express";

const cookieName = "refreshToken";

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(cookieName, token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax", path: "/api/auth/refresh", domain: isProduction ? env.COOKIE_DOMAIN : undefined });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(cookieName, { path: "/api/auth/refresh", domain: isProduction ? env.COOKIE_DOMAIN : undefined });
}

export async function register(input: any) {
  if (input.role === "admin") throw new HttpError(403, "Admin accounts must be provisioned internally", "ADMIN_SELF_REGISTER_DISABLED");
  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const user = await User.create({ name: input.name, email: input.email, passwordHash, role: input.role, sellerProfile: input.sellerProfile });
  const authUser = { id: String(user._id), email: user.email, role: user.role as any };
  const accessToken = signAccessToken(authUser);
  const refreshToken = signRefreshToken(authUser);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS);
  await user.save();
  return { user: serializeUser(user), accessToken, refreshToken };
}

export async function login(input: any) {
  const user = await User.findOne({ email: input.email }).select("+passwordHash +refreshTokenHash");
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new HttpError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  if (user.isSuspended) throw new HttpError(403, "Account suspended", "ACCOUNT_SUSPENDED");
  const authUser = { id: String(user._id), email: user.email, role: user.role as any };
  const accessToken = signAccessToken(authUser);
  const refreshToken = signRefreshToken(authUser);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS);
  await user.save();
  return { user: serializeUser(user), accessToken, refreshToken };
}

export async function refresh(token?: string) {
  if (!token) throw new HttpError(401, "Refresh token required", "REFRESH_REQUIRED");
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
  const user = await User.findById(payload.id).select("+refreshTokenHash");
  if (!user?.refreshTokenHash || user.isSuspended || !(await bcrypt.compare(token, user.refreshTokenHash))) throw new HttpError(401, "Refresh token invalid", "REFRESH_INVALID");
  const authUser = { id: String(user._id), email: user.email, role: user.role as any };
  return { user: serializeUser(user), accessToken: signAccessToken(authUser) };
}

export async function logout(userId?: string) {
  if (userId) await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
}
