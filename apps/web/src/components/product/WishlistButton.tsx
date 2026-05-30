"use client";
import { Heart } from "lucide-react";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
export function WishlistButton({ productId }: { productId: string }) { const { token } = useAuth(); return <button className="btn-secondary" onClick={() => token && marketplaceApi.addWishlist(token, productId)} type="button" aria-label="Add to wishlist"><Heart size={18}/></button>; }
