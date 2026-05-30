import mongoose from "mongoose";
import { env } from "@/lib/env";

type CachedConnection = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as typeof globalThis & { mongooseCache?: CachedConnection };
const cached = globalForMongoose.mongooseCache ?? { conn: null, promise: null };

globalForMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
