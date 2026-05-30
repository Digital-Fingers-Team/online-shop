import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(public statusCode: number, message: string, public code = "APP_ERROR") {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.statusCode });
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid request payload", issues: error.flatten() } },
      { status: 422 }
    );
  }
  console.error(error);
  return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } }, { status: 500 });
}

export function assertFound<T>(value: T | null | undefined, label = "Resource"): T {
  if (!value) throw new AppError(404, `${label} not found`, "NOT_FOUND");
  return value;
}
