import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { HttpError } from "./utils/http-error.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN.split(","), credentials: true }));
app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(compression());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api", routes);
app.use((_req, _res, next) => next(new HttpError(404, "Route not found", "NOT_FOUND")));
app.use(errorHandler);

export default app;
