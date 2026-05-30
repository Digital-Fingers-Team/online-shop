import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { listCustomerOrders, placeOrder } from "@/lib/services/order-service";
import { checkoutSchema } from "@/lib/validation/order";

export const GET = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  return NextResponse.json(await listCustomerOrders(user.id));
});

export const POST = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["customer", "admin"]);
  const data = await parseJson(request, checkoutSchema);
  return NextResponse.json(await placeOrder(user.id, data.address), { status: 201 });
});
