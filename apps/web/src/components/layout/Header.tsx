"use client";
import Link from "next/link";
import { ShoppingCart, Store, ShieldCheck } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export function Header() {
  const { user, logout } = useAuth();
  return <header className="sticky top-0 z-40 border-b bg-slate-950 text-white shadow-lg">
    <div className="container-page flex h-16 items-center justify-between gap-4">
      <Link href="/" className="text-xl font-black tracking-tight text-brand-500">MarketPilot</Link>
      <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
        <Link href="/marketplace">Marketplace</Link><Link href="/orders">Orders</Link><Link href="/wishlist">Wishlist</Link><Link href="/cart" className="inline-flex items-center gap-1"><ShoppingCart size={16}/>Cart</Link>
        <Link href="/seller/dashboard" className="inline-flex items-center gap-1"><Store size={16}/>Seller</Link>
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1"><ShieldCheck size={16}/>Admin</Link>
      </nav>
      <div className="flex items-center gap-3 text-sm">{user ? <><span className="hidden sm:inline">{user.name}</span><button onClick={logout} className="btn-secondary py-1 text-slate-900">Logout</button></> : <><Link href="/auth/login">Login</Link><Link href="/auth/register" className="btn-primary py-1">Register</Link></>}</div>
    </div>
  </header>;
}
