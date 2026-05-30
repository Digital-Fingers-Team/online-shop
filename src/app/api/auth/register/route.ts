import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { createTokenPair, hashPassword, setAuthCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { User } from "@/lib/models/User";
import { rateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validation/auth";

export const POST = handler(async (request: NextRequest) => {
  rateLimit(request, "register");
  const data = await parseJson(request, registerSchema);
  await connectToDatabase();
  if (await User.exists({ email: data.email })) throw new AppError(409, "Email is already registered", "EMAIL_EXISTS");
  const user = await User.create({
    name: data.name,
    email: data.email,
    role: data.role,
    passwordHash: await hashPassword(data.password),
    sellerProfile: data.role === "seller" ? { storeName: data.storeName ?? `${data.name}'s Store` } : undefined
  });
  const tokens = await createTokenPair(user);
  const response = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  setAuthCookies(response, tokens);
  return response;
});
