'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StateMessage } from '@/components/StateMessage';
import { apiFetch, money } from '@/lib/api';
import type { Order } from '@/types/domain';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]); const [error, setError] = useState('');
  useEffect(() => { apiFetch<Order[]>('/orders').then(setOrders).catch((err) => setError(err.message)); }, []);
  if (error) return <div className="container-page"><StateMessage title="Orders unavailable" description={error} /></div>;
  return <div className="container-page space-y-4"><h1 className="text-3xl font-black">Order history</h1>{orders.length === 0 ? <StateMessage title="No orders yet" description="Your completed checkouts will appear here." /> : orders.map((order) => <Link href={`/orders/${order.id}`} key={order.id} className="card flex items-center justify-between p-5"><div><p className="font-bold">Order #{order.id.slice(-8)}</p><p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()} · {order.status}</p></div><strong>{money.format(order.total)}</strong></Link>)}</div>;
}
