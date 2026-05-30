"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error?.message ?? "Authentication failed");
      return;
    }
    router.push(search.get("next") ?? "/profile");
    router.refresh();
  }
  return (
    <form action={submit} className="card w-full max-w-md space-y-4 p-8">
      <h1 className="text-3xl font-black">{mode === "login" ? "Welcome back" : "Create an account"}</h1>
      {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      {mode === "register" && <label className="label">Name<input className="input mt-1" name="name" required /></label>}
      <label className="label">Email<input className="input mt-1" name="email" type="email" required /></label>
      <label className="label">Password<input className="input mt-1" name="password" type="password" required minLength={8} /></label>
      {mode === "register" && <><label className="label">Role<select className="input mt-1" name="role"><option value="customer">Customer</option><option value="seller">Seller</option></select></label><label className="label">Store name (sellers)<input className="input mt-1" name="storeName" /></label></>}
      <button className="btn-primary w-full">{mode === "login" ? "Log in" : "Register"}</button>
    </form>
  );
}
