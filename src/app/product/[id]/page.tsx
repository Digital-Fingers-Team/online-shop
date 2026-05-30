import Image from "next/image";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { getProduct } from "@/lib/services/product-service";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product: any = await getProduct(id);
  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-2">
      <div className="card overflow-hidden"><div className="relative aspect-square"><Image src={product.images[0]} alt={product.title} fill className="object-cover" /></div></div>
      <div>
        <p className="font-bold uppercase tracking-wide text-brand-600">{product.category}</p>
        <h1 className="mt-2 text-4xl font-black">{product.title}</h1>
        <p className="mt-4 text-3xl font-black">${Number(product.price).toFixed(2)}</p>
        <p className="mt-2 text-sm text-slate-500">★ {Number(product.rating).toFixed(1)} · {product.stock} in stock · Sold by {product.seller?.sellerProfile?.storeName ?? product.seller?.name}</p>
        <p className="mt-6 whitespace-pre-line text-slate-700">{product.description}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2"><AddToCartButton productId={String(product._id)} /><WishlistButton productId={String(product._id)} /></div>
      </div>
    </div>
  );
}
