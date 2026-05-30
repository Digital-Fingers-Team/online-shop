import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, requireRequestUser } from "@/lib/auth";
import { handler } from "@/lib/api";
import { User } from "@/lib/models/User";

export const POST = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request);
  await User.findByIdAndUpdate(user.id, { $unset: { refreshTokenHash: 1 } });
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
});
