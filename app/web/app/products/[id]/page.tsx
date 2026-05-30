'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StateMessage } from '@/components/StateMessage';
import { apiFetch, money } from '@/lib/api';
import type { Product } from '@/types/domain';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => { apiFetch<Product>(`/products/${id}`).then(setProduct).catch((err) => setError(err.message)); }, [id]);
  async function addToCart() { await apiFetch('/cart/items', { method: 'POST', body: JSON.stringify({ productId: id, quantity }) }); router.push('/cart'); }

  if (error) return <div className="container-page"><StateMessage title="Product unavailable" description={error} /></div>;
  if (!product) return <div className="container-page"><StateMessage title="Loading product" description="Getting product details." /></div>;
  return <div className="container-page grid gap-8 lg:grid-cols-2"><div className="card flex aspect-square items-center justify-center bg-gradient-to-br from-slate-100 to-brand-100 text-8xl dark:from-slate-800 dark:to-slate-700">📦</div><section className="space-y-5"><p className="font-semibold uppercase text-brand-600">{product.category.name}</p><h1 className="text-4xl font-black">{product.name}</h1><p className="text-3xl font-black">{money.format(product.price)}</p><p className="leading-7 text-slate-600 dark:text-slate-300">{product.description}</p><p className="font-semibold">{product.inventory} available</p><div className="flex gap-3"><input className="input max-w-28" type="number" min={1} max={product.inventory} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /><button disabled={product.inventory === 0} onClick={addToCart} className="btn-primary">Add to cart</button></div></section></div>;
}
