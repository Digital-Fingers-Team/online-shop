import mongoose from "mongoose";
import { env } from "../config/env.js";

let cached: Promise<typeof mongoose> | null = null;

export function connectDatabase() {
  if (!cached) {
    mongoose.set("strictQuery", true);
    cached = mongoose.connect(env.MONGODB_URI, { autoIndex: env.NODE_ENV !== "production" });
  }
  return cached;
}
