"use client";

import { Heart } from "lucide-react";

export function WishlistButton({ productId }: { productId: string }) {
  return <button onClick={() => fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) })} className="btn-secondary w-full"><Heart size={16} /> Save to wishlist</button>;
}
