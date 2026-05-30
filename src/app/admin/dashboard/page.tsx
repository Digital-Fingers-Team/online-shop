import { StatCard } from "@/components/ui/StatCard";
import { getMarketplaceStats, listUsers } from "@/lib/services/admin-service";
import { listAllOrders } from "@/lib/services/order-service";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, users, orders] = await Promise.all([getMarketplaceStats().catch(() => ({ users: 0, sellers: 0, products: 0, orders: 0, revenue: 0 })), listUsers().catch(() => []), listAllOrders().catch(() => [])]);
  return <div className="container-page py-10"><p className="font-bold text-brand-600">Admin dashboard</p><h1 className="text-4xl font-black">Marketplace operations</h1><div className="mt-8 grid gap-4 md:grid-cols-5"><StatCard label="Customers" value={stats.users} /><StatCard label="Sellers" value={stats.sellers} /><StatCard label="Products" value={stats.products} /><StatCard label="Orders" value={stats.orders} /><StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} /></div><section className="mt-10 grid gap-6 lg:grid-cols-2"><div className="card overflow-hidden"><h2 className="p-5 text-xl font-black">Users and sellers</h2>{users.map((user: any) => <div key={String(user._id)} className="flex justify-between border-t p-5"><div><p className="font-bold">{user.name}</p><p className="text-sm text-slate-500">{user.email} · {user.role}</p></div><span className="text-sm font-bold">{user.isSuspended ? "Suspended" : "Active"}</span></div>)}</div><div className="card overflow-hidden"><h2 className="p-5 text-xl font-black">Recent orders</h2>{orders.map((order: any) => <div key={String(order._id)} className="flex justify-between border-t p-5"><p className="font-bold">#{String(order._id).slice(-8)}</p><p className="text-sm font-bold capitalize">{order.status} · ${order.subtotal.toFixed(2)}</p></div>)}</div></section></div>;
}
