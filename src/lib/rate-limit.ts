import { NextRequest } from "next/server";
import { AppError } from "@/lib/errors";
import { env } from "@/lib/env";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: NextRequest, keyPrefix = "global") {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + env.RATE_LIMIT_WINDOW_MS });
    return;
  }
  bucket.count += 1;
  if (bucket.count > env.RATE_LIMIT_MAX) {
    throw new AppError(429, "Too many requests. Please try again shortly.", "RATE_LIMITED");
  }
}
