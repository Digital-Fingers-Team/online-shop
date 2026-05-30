import Link from 'next/link';
import { money } from '@/lib/api';
import type { Product } from '@/types/domain';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="card group overflow-hidden">
      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-slate-100 to-brand-100 text-5xl dark:from-slate-800 dark:to-slate-700">📦</div>
      <div className="space-y-2 p-4">
        <p className="text-xs font-semibold uppercase text-brand-600">{product.category.name}</p>
        <h3 className="line-clamp-2 font-bold group-hover:text-brand-600">{product.name}</h3>
        <p className="text-lg font-black">{money.format(product.price)}</p>
        <p className="text-sm text-slate-500">{product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}</p>
      </div>
    </Link>
  );
}
