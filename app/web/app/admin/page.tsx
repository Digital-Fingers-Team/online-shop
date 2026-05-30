'use client';

import { useEffect, useState } from 'react';
import { StateMessage } from '@/components/StateMessage';
import { apiFetch, money } from '@/lib/api';
import type { Category, Order, Product, User } from '@/types/domain';

const orderStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [productForm, setProductForm] = useState({ name: '', description: '', price: 0, inventory: 0, categoryId: '', images: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const load = () => {
    apiFetch<{ items: Product[] }>('/products?limit=100').then((data) => setProducts(data.items));
    apiFetch<Category[]>('/categories').then(setCategories);
    apiFetch<Order[]>('/admin/orders').then(setOrders).catch((err) => setError(err.message));
    apiFetch<User[]>('/admin/users').then(setUsers).catch(() => undefined);
  };

  useEffect(load, []);

  async function createProduct(event: React.FormEvent) {
    event.preventDefault();
    await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify({ ...productForm, images: productForm.images ? productForm.images.split(',').map((x) => x.trim()) : [] })
    });
    setProductForm({ name: '', description: '', price: 0, inventory: 0, categoryId: '', images: '' });
    load();
  }

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    await apiFetch('/categories', { method: 'POST', body: JSON.stringify(categoryForm) });
    setCategoryForm({ name: '', description: '' });
    load();
  }

  async function updateStatus(id: string, status: string) {
    await apiFetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
  }

  if (error) return <div className="container-page"><StateMessage title="Admin access required" description={error} /></div>;

  return (
    <div className="container-page space-y-8">
      <h1 className="text-3xl font-black">Admin dashboard</h1>
      <section className="grid gap-4 md:grid-cols-4">
        {[['Products', products.length], ['Categories', categories.length], ['Orders', orders.length], ['Users', users.length]].map(([label, value]) => (
          <div key={label} className="card p-5"><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-black">{value}</p></div>
        ))}
      </section>

      <form onSubmit={createProduct} className="card grid gap-3 p-5 md:grid-cols-2">
        <h2 className="text-xl font-bold md:col-span-2">Product management</h2>
        <input className="input" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
        <input className="input" placeholder="Image URLs comma-separated" value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} />
        <textarea className="input md:col-span-2" placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
        <input className="input" type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} />
        <input className="input" type="number" placeholder="Inventory" value={productForm.inventory} onChange={(e) => setProductForm({ ...productForm, inventory: Number(e.target.value) })} />
        <select className="input" value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}>
          <option value="">Select category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <button className="btn-primary">Create product</button>
      </form>

      <form onSubmit={createCategory} className="card grid gap-3 p-5 md:grid-cols-[1fr_2fr_auto]">
        <h2 className="text-xl font-bold md:col-span-3">Category management</h2>
        <input className="input" placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
        <input className="input" placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
        <button className="btn-primary">Create category</button>
      </form>

      <section className="card overflow-hidden">
        <h2 className="p-5 text-xl font-bold">Inventory management</h2>
        {products.map((product) => <div key={product.id} className="flex justify-between border-t border-slate-200 p-4 dark:border-slate-800"><span>{product.name}</span><span>{money.format(product.price)} · {product.inventory} left</span></div>)}
      </section>

      <section className="card overflow-hidden">
        <h2 className="p-5 text-xl font-bold">Order management</h2>
        {orders.map((order) => (
          <div key={order.id} className="flex flex-col gap-3 border-t border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
            <span>#{order.id.slice(-8)} · {money.format(order.total)}</span>
            <select className="input max-w-48" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
              {orderStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        ))}
      </section>

      <section className="card overflow-hidden">
        <h2 className="p-5 text-xl font-bold">User management</h2>
        {users.map((user) => <div key={user.id} className="flex justify-between border-t border-slate-200 p-4 dark:border-slate-800"><span>{user.name} · {user.email}</span><strong>{user.role}</strong></div>)}
      </section>
    </div>
  );
}
