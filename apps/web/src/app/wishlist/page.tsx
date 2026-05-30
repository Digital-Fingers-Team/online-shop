"use client";
import { useEffect, useState } from "react";
import type { WishlistDTO } from "@marketplace/types";
import { marketplaceApi } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { useAuth } from "@/providers/AuthProvider";
export default function WishlistPage() { const { token } = useAuth(); const [wishlist, setWishlist] = useState<WishlistDTO | null>(null); useEffect(() => { if (token) marketplaceApi.wishlist(token).then(setWishlist); }, [token]); return <main className="container-page py-10"><h1 className="text-4xl font-black">Wishlist</h1><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{wishlist?.products.map((product) => <ProductCard key={product.id} product={product}/>)}</div></main>; }
