"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CheckoutForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function checkout(formData: FormData) {
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error?.message ?? "Checkout failed");
      return;
    }
    router.push("/orders");
    router.refresh();
  }
  return <form action={checkout} className="mt-6 space-y-3">{error && <p className="text-sm font-semibold text-red-600">{error}</p>}<textarea className="input" name="address" placeholder="Shipping address" required /><button className="btn-primary w-full">Place order</button></form>;
}
