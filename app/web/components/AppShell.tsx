'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle } from 'lucide-react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black tracking-tight text-brand-600">ShopMVP</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/products">Products</Link><Link href="/orders">Orders</Link>{user?.role === 'ADMIN' ? <Link href="/admin">Admin</Link> : null}
        </nav>
        <div className="flex items-center gap-3">
          <Link aria-label="Cart" href="/cart" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><ShoppingCart size={20} /></Link>
          {user ? <button onClick={logout} className="btn-secondary !px-3 !py-2">Logout</button> : <Link href="/login" className="btn-primary !px-3 !py-2"><UserCircle size={18} /> Login</Link>}
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <AuthProvider><Header /><main className="min-h-screen py-8">{children}</main></AuthProvider>;
}
