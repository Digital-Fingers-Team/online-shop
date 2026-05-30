import { ProductCard } from "@/components/product/ProductCard";
import { listProducts } from "@/lib/services/product-service";
import { productQuerySchema } from "@/lib/validation/product";

export const dynamic = "force-dynamic";

export default async function Marketplace({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const query = productQuerySchema.parse(params);
  const result = await listProducts(query).catch(() => ({ items: [], total: 0, page: 1, pages: 0, limit: 12 }));
  return (
    <div className="container-page py-10">
      <div className="mb-8"><h1 className="text-4xl font-black">Marketplace</h1><p className="mt-2 text-slate-600">Search, filter, sort, and discover products from verified sellers.</p></div>
      <form className="card mb-8 grid gap-3 p-4 md:grid-cols-5">
        <input className="input md:col-span-2" name="q" defaultValue={query.q} placeholder="Search products" />
        <input className="input" name="category" defaultValue={query.category} placeholder="Category" />
        <select className="input" name="sort" defaultValue={query.sort}><option value="newest">Newest</option><option value="price_asc">Price low-high</option><option value="price_desc">Price high-low</option><option value="rating">Top rated</option></select>
        <button className="btn-primary">Apply</button>
      </form>
      <p className="mb-4 text-sm font-semibold text-slate-500">{result.total} products found</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{result.items.map((product: any) => <ProductCard key={String(product._id)} product={product} />)}</div>
    </div>
  );
}
