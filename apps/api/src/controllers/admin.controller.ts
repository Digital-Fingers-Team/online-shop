import type { Request, Response } from "express";
import * as admin from "../services/admin.service.js";
export async function stats(_req: Request, res: Response) { res.json(await admin.getStats()); }
export async function users(req: Request, res: Response) { res.json(await admin.listUsers(req.query.role as string | undefined)); }
export async function suspend(req: Request, res: Response) { res.json(await admin.suspendUser(req.params.id, Boolean(req.body.isSuspended))); }
export async function products(_req: Request, res: Response) { res.json(await admin.listProductsAdmin()); }
export async function removeProduct(req: Request, res: Response) { await admin.removeProductAdmin(req.params.id); res.status(204).send(); }
export async function orders(_req: Request, res: Response) { res.json(await admin.listOrdersAdmin()); }
