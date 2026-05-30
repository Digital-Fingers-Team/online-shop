import { NextRequest, NextResponse } from "next/server";
import { handler } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { adminRemoveProduct } from "@/lib/services/admin-service";

export const DELETE = handler(async (request: NextRequest, context: any) => {
  await requireRequestUser(request, ["admin"]);
  return NextResponse.json(await adminRemoveProduct(context.params.id));
});
