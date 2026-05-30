import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { addCartItem, getCart } from "@/lib/services/cart-service";
import { cartItemSchema } from "@/lib/validation/cart";

export const GET = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  return NextResponse.json(await getCart(user.id));
});

export const POST = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  const data = await parseJson(request, cartItemSchema);
  return NextResponse.json(await addCartItem(user.id, data.productId, data.quantity), { status: 201 });
});
