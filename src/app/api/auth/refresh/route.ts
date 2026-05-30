import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, createTokenPair, setAuthCookies, verifyToken } from "@/lib/auth";
import { handler } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { User } from "@/lib/models/User";

export const POST = handler(async (request: NextRequest) => {
  const token = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!token) throw new AppError(401, "Refresh token required", "REFRESH_REQUIRED");
  const payload = verifyToken(token, "refresh");
  await connectToDatabase();
  const user = await User.findById(payload.sub).select("+refreshTokenHash");
  if (!user?.refreshTokenHash || !(await bcrypt.compare(token, user.refreshTokenHash))) throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH");
  const tokens = await createTokenPair(user);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ACCESS_COOKIE);
  setAuthCookies(response, tokens);
  return response;
});
