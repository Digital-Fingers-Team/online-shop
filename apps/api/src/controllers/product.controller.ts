import type { Request, Response } from "express";
import * as products from "../services/product.service.js";
export async function index(req: Request, res: Response) { res.json(await products.listProducts(req.query)); }
export async function show(req: Request, res: Response) { res.json(await products.getProduct(req.params.id)); }
export async function sellerIndex(req: Request, res: Response) { res.json(await products.listSellerProducts(req.user!.id)); }
export async function create(req: Request, res: Response) { res.status(201).json(await products.createProduct(req.user!.id, req.body)); }
export async function update(req: Request, res: Response) { res.json(await products.updateProduct(req.user!.id, req.params.id, req.body)); }
export async function destroy(req: Request, res: Response) { await products.deleteProduct(req.user!.id, req.params.id); res.status(204).send(); }
