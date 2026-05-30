'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StateMessage } from '@/components/StateMessage';
import { apiFetch, money } from '@/lib/api';
import type { Cart } from '@/types/domain';

export default function CartPage() {
  const [cart, setCart] = useState<Cart>();
  const [error, setError] = useState('');
  const total = useMemo(() => cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0, [cart]);
  const load = useCallback(() => {
    void apiFetch<Cart>('/cart').then(setCart).catch((err) => setError(err.message));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  async function update(productId: string, quantity: number) { await apiFetch(`/cart/items/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }); load(); }
  if (error) return <div className="container-page"><StateMessage title="Login required" description={error} /></div>;
  if (!cart) return <div className="container-page"><StateMessage title="Loading cart" description="Restoring your saved cart." /></div>;
  if (cart.items.length === 0) return <div className="container-page"><StateMessage title="Your cart is empty" description="Add products to start checkout." /></div>;
  return <div className="container-page grid gap-6 lg:grid-cols-[1fr_360px]"><section className="space-y-4">{cart.items.map((item) => <div key={item.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 text-4xl dark:bg-slate-800">📦</div><div className="flex-1"><h2 className="font-bold">{item.product.name}</h2><p className="text-slate-500">{money.format(item.product.price)}</p></div><input className="input max-w-24" type="number" min={0} max={item.product.inventory} value={item.quantity} onChange={(e) => update(item.productId, Number(e.target.value))} /><button className="btn-secondary" onClick={() => update(item.productId, 0)}>Remove</button></div>)}</section><aside className="card h-fit space-y-4 p-6"><h2 className="text-2xl font-black">Order summary</h2><div className="flex justify-between"><span>Subtotal</span><strong>{money.format(total)}</strong></div><Link href="/checkout" className="btn-primary w-full">Checkout</Link></aside></div>;
}
