import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { getWishlist, toggleWishlist } from "@/lib/services/wishlist-service";

const schema = z.object({ productId: z.string().min(1) });

export const GET = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  return NextResponse.json(await getWishlist(user.id));
});

export const POST = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  const data = await parseJson(request, schema);
  return NextResponse.json(await toggleWishlist(user.id, data.productId));
});
