import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error.js";

export const notFound: ErrorRequestHandler = (err, _req, res, next) => next(err);

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) return res.status(422).json({ message: "Validation failed", code: "VALIDATION_ERROR", details: err.flatten() });
  if (err instanceof HttpError) return res.status(err.statusCode).json({ message: err.message, code: err.code, details: err.details });
  if (err?.code === 11000) return res.status(409).json({ message: "Duplicate resource", code: "DUPLICATE_RESOURCE" });
  console.error(err);
  return res.status(500).json({ message: "Internal server error", code: "INTERNAL_ERROR" });
};
