import type { Request, Response } from "express";
import * as auth from "../services/auth.service.js";

export async function register(req: Request, res: Response) { const result = await auth.register(req.body); auth.setRefreshCookie(res, result.refreshToken); res.status(201).json({ user: result.user, accessToken: result.accessToken }); }
export async function login(req: Request, res: Response) { const result = await auth.login(req.body); auth.setRefreshCookie(res, result.refreshToken); res.json({ user: result.user, accessToken: result.accessToken }); }
export async function refresh(req: Request, res: Response) { res.json(await auth.refresh(req.cookies?.refreshToken)); }
export async function logout(req: Request, res: Response) { await auth.logout(req.user?.id); auth.clearRefreshCookie(res); res.status(204).send(); }
export async function me(req: Request, res: Response) { res.json({ user: req.user }); }
