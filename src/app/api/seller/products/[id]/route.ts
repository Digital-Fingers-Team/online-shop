import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { deleteProduct, updateProduct } from "@/lib/services/product-service";
import { productSchema } from "@/lib/validation/product";

export const PATCH = handler(async (request: NextRequest, context: any) => {
  const user = await requireRequestUser(request, ["seller", "admin"]);
  const data = await parseJson(request, productSchema.partial());
  return NextResponse.json(await updateProduct(user.id, context.params.id, data));
});

export const DELETE = handler(async (request: NextRequest, context: any) => {
  const user = await requireRequestUser(request, ["seller", "admin"]);
  return NextResponse.json(await deleteProduct(user.id, context.params.id));
});
