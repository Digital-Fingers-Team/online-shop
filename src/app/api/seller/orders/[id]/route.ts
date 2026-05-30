import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { updateSellerOrderStatus } from "@/lib/services/order-service";
import { orderStatusSchema } from "@/lib/validation/order";

export const PATCH = handler(async (request: NextRequest, context: any) => {
  const user = await requireRequestUser(request, ["seller", "admin"]);
  const data = await parseJson(request, orderStatusSchema);
  return NextResponse.json(await updateSellerOrderStatus(user.id, context.params.id, data.status));
});
