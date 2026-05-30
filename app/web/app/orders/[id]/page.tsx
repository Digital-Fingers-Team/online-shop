'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StateMessage } from '@/components/StateMessage';
import { apiFetch, money } from '@/lib/api';
import type { Order } from '@/types/domain';

const steps = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>(); const [order, setOrder] = useState<Order>(); const [error, setError] = useState('');
  useEffect(() => { apiFetch<Order>(`/orders/${id}`).then(setOrder).catch((err) => setError(err.message)); }, [id]);
  if (error) return <div className="container-page"><StateMessage title="Order unavailable" description={error} /></div>;
  if (!order) return <div className="container-page"><StateMessage title="Loading order" description="Fetching status." /></div>;
  const active = Math.max(0, steps.indexOf(order.status));
  return <div className="container-page space-y-6"><h1 className="text-3xl font-black">Order #{order.id.slice(-8)}</h1><div className="card p-6"><div className="grid gap-3 md:grid-cols-4">{steps.map((step, index) => <div key={step} className={`rounded-xl p-4 text-center font-semibold ${index <= active ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{step}</div>)}</div></div><section className="card divide-y divide-slate-200 dark:divide-slate-800">{order.items.map((item) => <div key={item.id} className="flex justify-between p-5"><span>{item.name} × {item.quantity}</span><strong>{money.format(item.price * item.quantity)}</strong></div>)}<div className="flex justify-between p-5 text-xl"><span>Total</span><strong>{money.format(order.total)}</strong></div></section></div>;
}
