import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { removeCartItem, updateCartItem } from "@/lib/services/cart-service";
import { quantitySchema } from "@/lib/validation/cart";

export const PATCH = handler(async (request: NextRequest, context: any) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  const data = await parseJson(request, quantitySchema);
  return NextResponse.json(await updateCartItem(user.id, context.params.productId, data.quantity));
});

export const DELETE = handler(async (request: NextRequest, context: any) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  return NextResponse.json(await removeCartItem(user.id, context.params.productId));
});
