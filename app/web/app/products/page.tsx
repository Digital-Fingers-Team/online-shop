'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { StateMessage } from '@/components/StateMessage';
import { apiFetch } from '@/lib/api';
import type { Category, Paginated, Product } from '@/types/domain';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { apiFetch<Category[]>('/categories').then(setCategories).catch(() => undefined); }, []);
  useEffect(() => {
    setLoading(true); setError('');
    const params = new URLSearchParams({ page: '1', limit: '24' });
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId);
    apiFetch<Paginated<Product>>(`/products?${params}`).then((data) => setProducts(data.items)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [search, categoryId]);

  return <div className="container-page space-y-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="text-3xl font-black">Products</h1><p className="text-slate-500">Search, filter, and shop active inventory.</p></div><div className="grid gap-3 sm:grid-cols-2"><input className="input" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} /><select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div></div>{loading ? <StateMessage title="Loading products" description="Fetching the latest catalog." /> : error ? <StateMessage title="Could not load products" description={error} /> : products.length === 0 ? <StateMessage title="No products found" description="Try changing your filters." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</div>;
}
