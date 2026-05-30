import { NextRequest, NextResponse } from "next/server";
import { handler } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { getMarketplaceStats, listUsers } from "@/lib/services/admin-service";
import { listAllOrders } from "@/lib/services/order-service";

export const GET = handler(async (request: NextRequest) => {
  await requireRequestUser(request, ["admin"]);
  const [stats, users, orders] = await Promise.all([getMarketplaceStats(), listUsers(), listAllOrders()]);
  return NextResponse.json({ stats, users, orders });
});
