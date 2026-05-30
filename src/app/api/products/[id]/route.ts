import { NextResponse } from "next/server";
import { handler } from "@/lib/api";
import { getProduct } from "@/lib/services/product-service";

export const GET = handler(async (_request, context: any) => NextResponse.json(await getProduct(context.params.id)));
