import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { createProduct, listSellerProducts } from "@/lib/services/product-service";
import { productSchema } from "@/lib/validation/product";

export const GET = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["seller", "admin"]);
  return NextResponse.json(await listSellerProducts(user.id));
});

export const POST = handler(async (request: NextRequest) => {
  const user = await requireRequestUser(request, ["seller", "admin"]);
  const data = await parseJson(request, productSchema);
  return NextResponse.json(await createProduct(user.id, data), { status: 201 });
});
