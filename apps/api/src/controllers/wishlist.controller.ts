import type { Request, Response } from "express";
import * as wishlist from "../services/wishlist.service.js";
export async function index(req: Request, res: Response) { res.json(await wishlist.getWishlist(req.user!.id)); }
export async function add(req: Request, res: Response) { res.json(await wishlist.addWishlist(req.user!.id, req.body.productId)); }
export async function remove(req: Request, res: Response) { res.json(await wishlist.removeWishlist(req.user!.id, req.params.productId)); }
