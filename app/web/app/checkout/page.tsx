'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Order } from '@/types/domain';

const fields = ['fullName', 'line1', 'line2', 'city', 'state', 'postalCode', 'country'] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({ country: 'United States' });
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('');
    try { const order = await apiFetch<Order>('/orders/checkout', { method: 'POST', body: JSON.stringify({ shippingAddress: form }) }); router.push(`/orders/${order.id}`); }
    catch (err) { setError(err instanceof Error ? err.message : 'Checkout failed'); }
  }
  return <div className="container-page max-w-2xl"><form onSubmit={submit} className="card space-y-4 p-6"><h1 className="text-3xl font-black">Checkout</h1>{error ? <p className="rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}{fields.map((field) => <label key={field} className="block text-sm font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1')}<input className="input mt-1" required={field !== 'line2'} value={form[field] ?? ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /></label>)}<button className="btn-primary w-full">Place order</button></form></div>;
}
