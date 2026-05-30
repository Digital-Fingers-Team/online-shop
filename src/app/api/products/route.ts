import { NextRequest, NextResponse } from "next/server";
import { handler } from "@/lib/api";
import { listProducts } from "@/lib/services/product-service";
import { productQuerySchema } from "@/lib/validation/product";

export const GET = handler(async (request: NextRequest) => {
  const query = productQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  return NextResponse.json(await listProducts(query));
});
