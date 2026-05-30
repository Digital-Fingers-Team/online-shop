import Image from "next/image";
import Link from "next/link";

type Props = { product: any };
export function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product._id}`} className="card group overflow-hidden">
      <div className="relative aspect-square bg-slate-100">
        <Image src={product.images?.[0] ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} alt={product.title} fill className="object-cover transition-transform group-hover:scale-105" />
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 font-bold text-slate-950">{product.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-black">${Number(product.price).toFixed(2)}</span>
          <span className="text-sm text-amber-600">★ {Number(product.rating ?? 0).toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
