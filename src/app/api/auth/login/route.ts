import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { comparePassword, createTokenPair, setAuthCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { User } from "@/lib/models/User";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation/auth";

export const POST = handler(async (request: NextRequest) => {
  rateLimit(request, "login");
  const data = await parseJson(request, loginSchema);
  await connectToDatabase();
  const user = await User.findOne({ email: data.email }).select("+passwordHash +refreshTokenHash");
  if (!user || !(await comparePassword(data.password, user.passwordHash))) throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  if (user.isSuspended) throw new AppError(403, "Account is suspended", "ACCOUNT_SUSPENDED");
  const tokens = await createTokenPair(user);
  const response = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  setAuthCookies(response, tokens);
  return response;
});
