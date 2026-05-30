import { NextRequest, NextResponse } from "next/server";
import { handler, parseJson } from "@/lib/api";
import { requireRequestUser } from "@/lib/auth";
import { suspendUser } from "@/lib/services/admin-service";
import { suspendSchema } from "@/lib/validation/admin";

export const PATCH = handler(async (request: NextRequest, context: any) => {
  await requireRequestUser(request, ["admin"]);
  const data = await parseJson(request, suspendSchema);
  return NextResponse.json(await suspendUser(context.params.id, data.isSuspended));
});
