export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-6 py-10 text-sm text-slate-600 md:grid-cols-3">
        <div><p className="font-bold text-slate-950">MarketPilot</p><p>Startup-ready marketplace foundation with customers, sellers, admins, and secure REST APIs.</p></div>
        <div><p className="font-bold text-slate-950">Architecture</p><p>Next.js App Router, MongoDB, service layer, validation, JWT auth, and role-based authorization.</p></div>
        <div><p className="font-bold text-slate-950">MVP Scope</p><p>Product discovery, carts, wishlists, orders, inventory management, and marketplace operations.</p></div>
      </div>
    </footer>
  );
}
