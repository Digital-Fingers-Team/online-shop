import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { User } from "@/lib/models/User";
import type { Role } from "@/lib/types";

export type SessionUser = { id: string; name: string; email: string; role: Role; isSuspended: boolean };
type TokenPayload = { sub: string; role: Role; type: "access" | "refresh" };

export const ACCESS_COOKIE = "market_access";
export const REFRESH_COOKIE = "market_refresh";

function signToken(payload: TokenPayload, secret: string, expiresIn: string) {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function verifyToken(token: string, type: "access" | "refresh") {
  const secret = type === "access" ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;
  const decoded = jwt.verify(token, secret) as TokenPayload;
  if (decoded.type !== type) throw new AppError(401, "Invalid token type", "INVALID_TOKEN");
  return decoded;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createTokenPair(user: { _id: unknown; role: Role }) {
  const id = String(user._id);
  const accessToken = signToken({ sub: id, role: user.role, type: "access" }, env.JWT_ACCESS_SECRET, env.ACCESS_TOKEN_TTL);
  const refreshToken = signToken({ sub: id, role: user.role, type: "refresh" }, env.JWT_REFRESH_SECRET, env.REFRESH_TOKEN_TTL);
  const refreshTokenHash = await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS);
  await User.findByIdAndUpdate(id, { refreshTokenHash });
  return { accessToken, refreshToken };
}

export function setAuthCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 15 });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = verifyToken(token, "access");
    await connectToDatabase();
    const user = await User.findById(payload.sub).lean();
    if (!user) return null;
    return { id: String(user._id), name: user.name, email: user.email, role: user.role as Role, isSuspended: user.isSuspended };
  } catch {
    return null;
  }
}

export async function requireUser(roles?: Role[]) {
  const user = await getCurrentUser();
  if (!user) throw new AppError(401, "Authentication required", "UNAUTHENTICATED");
  if (user.isSuspended) throw new AppError(403, "Account is suspended", "ACCOUNT_SUSPENDED");
  if (roles?.length && !roles.includes(user.role)) throw new AppError(403, "Insufficient permissions", "FORBIDDEN");
  return user;
}

export async function requireRequestUser(request: NextRequest, roles?: Role[]) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) throw new AppError(401, "Authentication required", "UNAUTHENTICATED");
  const payload = verifyToken(token, "access");
  if (roles?.length && !roles.includes(payload.role)) throw new AppError(403, "Insufficient permissions", "FORBIDDEN");
  await connectToDatabase();
  const user = await User.findById(payload.sub).lean();
  if (!user || user.isSuspended) throw new AppError(403, "Account unavailable", "ACCOUNT_UNAVAILABLE");
  return { id: String(user._id), name: user.name, email: user.email, role: user.role as Role };
}
