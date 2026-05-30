"use client";
import { useEffect, useState } from "react";
import type { OrderDTO } from "@marketplace/types";
import { formatCurrency } from "@marketplace/utils";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
export default function OrdersPage() { const { token } = useAuth(); const [orders, setOrders] = useState<OrderDTO[]>([]); useEffect(() => { if (token) marketplaceApi.orders(token).then(setOrders); }, [token]); return <main className="container-page py-10"><h1 className="text-4xl font-black">Order history</h1><div className="mt-6 space-y-4">{orders.map((order) => <article className="card p-5" key={order.id}><div className="flex justify-between"><h2 className="font-bold">Order {order.id}</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{order.status}</span></div><p className="mt-2">{order.items.length} items · {formatCurrency(order.subtotal)}</p></article>)}</div></main>; }
