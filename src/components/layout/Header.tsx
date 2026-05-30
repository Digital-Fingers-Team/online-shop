import Link from "next/link";
import { ShoppingCart, Store, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-950">Market<span className="text-brand-600">Pilot</span></Link>
        <form action="/marketplace" className="hidden flex-1 md:block max-w-2xl">
          <input name="q" placeholder="Search products, brands, categories..." className="input py-2.5" />
        </form>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link className="rounded-full px-3 py-2 hover:bg-slate-100" href="/marketplace">Shop</Link>
          {user?.role === "seller" && <Link className="rounded-full px-3 py-2 hover:bg-slate-100" href="/seller/dashboard"><Store size={18} /></Link>}
          {user?.role === "admin" && <Link className="rounded-full px-3 py-2 hover:bg-slate-100" href="/admin/dashboard">Admin</Link>}
          <Link className="rounded-full px-3 py-2 hover:bg-slate-100" href={user ? "/profile" : "/auth/login"}><UserRound size={18} /></Link>
          <Link className="rounded-full px-3 py-2 hover:bg-slate-100" href="/cart"><ShoppingCart size={18} /></Link>
        </nav>
      </div>
    </header>
  );
}
