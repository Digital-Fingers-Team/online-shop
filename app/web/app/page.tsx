import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container-page space-y-10">
      <section className="card overflow-hidden bg-gradient-to-br from-brand-50 to-white p-8 dark:from-slate-900 dark:to-slate-950 md:p-14">
        <div className="max-w-3xl space-y-6">
          <p className="font-semibold uppercase tracking-wide text-brand-600">Amazon-inspired, small-team friendly</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Everything needed for a real commerce MVP.</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">Browse products, manage a persistent cart, check out, track orders, and run admin operations from one clean platform.</p>
          <div className="flex flex-wrap gap-3"><Link className="btn-primary" href="/products">Shop products</Link><Link className="btn-secondary" href="/admin">Admin dashboard</Link></div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {['Secure JWT auth', 'Inventory-aware checkout', 'Role-based admin'].map((item) => <div key={item} className="card p-6"><h2 className="text-xl font-bold">{item}</h2><p className="mt-2 text-slate-500">Built with TypeScript, Zod validation, Prisma, MongoDB, and reusable React components.</p></div>)}
      </section>
    </div>
  );
}
