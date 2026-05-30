import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { listProducts } from "@/lib/services/product-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts({ limit: 4 }).then((r) => r.items).catch(() => []);
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 text-white">
        <div className="container-page grid min-h-[520px] items-center gap-10 py-20 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">Production-grade marketplace MVP</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Launch a trusted multi-vendor marketplace faster.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">Customers shop, sellers manage inventory, and admins operate the marketplace from one scalable Next.js application.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/marketplace" className="btn-primary bg-white text-slate-950 hover:bg-slate-100">Browse marketplace</Link><Link href="/auth/register" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20">Start selling</Link></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["JWT auth", "Seller tools", "Admin ops", "MongoDB schemas"].map((item) => <div key={item} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15"><p className="text-2xl font-black">{item}</p><p className="mt-2 text-sm text-slate-200">Built as an extensible service layer, not throwaway demo code.</p></div>)}
          </div>
        </div>
      </section>
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between"><div><p className="font-bold text-brand-600">Featured</p><h2 className="text-3xl font-black">Latest products</h2></div><Link href="/marketplace" className="btn-secondary">View all</Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product: any) => <ProductCard key={String(product._id)} product={product} />)}</div>
      </section>
    </div>
  );
}
