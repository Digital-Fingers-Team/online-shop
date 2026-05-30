import { NextRequest } from "next/server";
import { errorResponse } from "@/lib/errors";

export function handler(fn: (request: NextRequest, context?: unknown) => Promise<Response>) {
  return async (request: NextRequest, context?: unknown) => {
    try {
      return await fn(request, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export async function parseJson<T>(request: Request, schema: { parse: (data: unknown) => T }) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const body = Object.fromEntries(form.entries());
    return schema.parse(body);
  }
  const body = await request.json().catch(() => ({}));
  return schema.parse(body);
}
