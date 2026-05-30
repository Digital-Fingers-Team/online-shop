import type { Request, Response } from "express";
import * as orders from "../services/order.service.js";
export async function create(req: Request, res: Response) { res.status(201).json(await orders.createOrder(req.user!.id, req.body.address)); }
export async function mine(req: Request, res: Response) { res.json(await orders.listCustomerOrders(req.user!.id)); }
export async function sellerIndex(req: Request, res: Response) { res.json(await orders.listSellerOrders(req.user!.id)); }
export async function updateStatus(req: Request, res: Response) { res.json(await orders.updateSellerOrderStatus(req.user!.id, req.params.id, req.body.status)); }
