import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/startup-marketplace"),
  JWT_ACCESS_SECRET: z.string().min(24).default("development-access-secret-change-before-production"),
  JWT_REFRESH_SECRET: z.string().min(24).default("development-refresh-secret-change-before-production"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120)
});

export const env = envSchema.parse(process.env);
