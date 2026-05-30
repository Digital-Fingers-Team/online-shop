import type { Request, Response } from "express";
import * as cart from "../services/cart.service.js";
export async function index(req: Request, res: Response) { res.json(await cart.getCart(req.user!.id)); }
export async function upsert(req: Request, res: Response) { res.json(await cart.upsertCartItem(req.user!.id, req.body.productId ?? req.params.productId, req.body.quantity)); }
export async function remove(req: Request, res: Response) { res.json(await cart.removeCartItem(req.user!.id, req.params.productId)); }
