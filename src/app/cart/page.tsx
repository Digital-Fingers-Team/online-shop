import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/services/cart-service";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const cart = await getCart(user.id).catch(() => ({ items: [], subtotal: 0 }));
  return <div className="container-page py-10"><h1 className="text-4xl font-black">Cart</h1><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><div className="card divide-y">{cart.items.map((item: any) => <div key={String(item.product?._id ?? item.product)} className="flex items-center justify-between p-5"><div><p className="font-bold">{item.product?.title ?? "Product"}</p><p className="text-sm text-slate-500">Qty {item.quantity}</p></div><p className="font-black">${(item.priceSnapshot * item.quantity).toFixed(2)}</p></div>)}</div><aside className="card h-fit p-6"><p className="text-sm font-bold text-slate-500">Subtotal</p><p className="mt-2 text-3xl font-black">${cart.subtotal.toFixed(2)}</p><CheckoutForm /></aside></div></div>;
}
