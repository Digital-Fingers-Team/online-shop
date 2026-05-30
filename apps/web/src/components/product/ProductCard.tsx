import type { ProductDTO } from "@marketplace/types";
import { formatCurrency } from "@marketplace/utils";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";
export function ProductCard({ product }: { product: ProductDTO }) { return <article className="card overflow-hidden"><Link href={`/product/${product.id}`}><img src={product.images[0]} alt={product.title} className="h-52 w-full object-cover" /></Link><div className="space-y-3 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{product.category}</p><Link href={`/product/${product.id}`} className="line-clamp-2 text-lg font-bold">{product.title}</Link><p className="text-2xl font-black">{formatCurrency(product.price)}</p><p className="text-sm text-slate-600">⭐ {product.rating.toFixed(1)} · {product.stock} in stock</p><div className="flex gap-2"><AddToCartButton productId={product.id}/><WishlistButton productId={product.id}/></div></div></article>; }
