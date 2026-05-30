"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/seller/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error?.message ?? "Unable to create product");
      return;
    }
    router.push("/seller/dashboard");
    router.refresh();
  }
  return <form action={submit} className="mt-6 space-y-4">{error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<input className="input" name="title" placeholder="Title" required /><textarea className="input" name="description" placeholder="Description" required /><input className="input" name="price" type="number" step="0.01" placeholder="Price" required /><input className="input" name="category" placeholder="Category" required /><input className="input" name="images" placeholder="Image URL" required /><input className="input" name="stock" type="number" placeholder="Stock" required /><button className="btn-primary w-full">Create</button></form>;
}
