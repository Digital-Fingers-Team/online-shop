"use client";

import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  async function add() {
    setState("loading");
    const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, quantity: 1 }) });
    setState(response.ok ? "done" : "idle");
  }
  return <button onClick={add} disabled={state === "loading"} className="btn-primary w-full">{state === "done" ? "Added to cart" : state === "loading" ? "Adding..." : "Add to cart"}</button>;
}
