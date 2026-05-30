import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { getCurrentUser } from "@/lib/auth";
import { listSellerOrders } from "@/lib/services/order-service";
import { listSellerProducts } from "@/lib/services/product-service";

export const dynamic = "force-dynamic";

export default async function SellerDashboard() {
  const user = await getCurrentUser();
  const [products, orders] = user ? await Promise.all([listSellerProducts(user.id).catch(() => []), listSellerOrders(user.id).catch(() => [])]) : [[], []];
  const revenue = orders.reduce((sum: number, order: any) => sum + order.subtotal, 0);
  return <div className="container-page py-10"><div className="flex items-center justify-between"><div><p className="font-bold text-brand-600">Seller dashboard</p><h1 className="text-4xl font-black">Inventory and orders</h1></div><Link className="btn-primary" href="/seller/products/new">Create product</Link></div><div className="mt-8 grid gap-4 md:grid-cols-3"><StatCard label="Products" value={products.length} /><StatCard label="Orders" value={orders.length} /><StatCard label="Gross revenue" value={`$${revenue.toFixed(2)}`} /></div><section className="mt-10 card overflow-hidden"><h2 className="p-5 text-xl font-black">Products</h2>{products.map((product: any) => <div key={String(product._id)} className="flex justify-between border-t p-5"><div><p className="font-bold">{product.title}</p><p className="text-sm text-slate-500">Stock {product.stock} · ${product.price}</p></div><span className="text-sm font-bold">{product.isActive ? "Active" : "Inactive"}</span></div>)}</section></div>;
}
