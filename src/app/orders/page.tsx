import { getCurrentUser } from "@/lib/auth";
import { listCustomerOrders } from "@/lib/services/order-service";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user ? await listCustomerOrders(user.id).catch(() => []) : [];
  return <div className="container-page py-10"><h1 className="text-4xl font-black">Order history</h1><div className="mt-8 space-y-4">{orders.map((order: any) => <div key={String(order._id)} className="card p-6"><div className="flex justify-between"><p className="font-bold">Order #{String(order._id).slice(-8)}</p><p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold capitalize">{order.status}</p></div><p className="mt-3 text-slate-600">{order.items.length} items · ${order.subtotal.toFixed(2)}</p></div>)}</div></div>;
}
