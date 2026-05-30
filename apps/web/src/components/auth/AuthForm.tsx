"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter(); const auth = useAuth(); const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(null); const data = new FormData(event.currentTarget); try { if (mode === "login") await auth.login(String(data.get("email")), String(data.get("password"))); else await auth.register({ name: data.get("name"), email: data.get("email"), password: data.get("password"), role: data.get("role"), sellerProfile: data.get("role") === "seller" ? { storeName: data.get("storeName") } : undefined }); router.push("/marketplace"); } catch (err) { setError(err instanceof Error ? err.message : "Authentication failed"); } }
  return <form onSubmit={submit} className="card mx-auto mt-10 max-w-md space-y-4 p-6"><h1 className="text-3xl font-black">{mode === "login" ? "Login" : "Create account"}</h1>{mode === "register" && <><input className="input" name="name" placeholder="Full name" required/><select className="input" name="role"><option value="customer">Customer</option><option value="seller">Seller</option></select><input className="input" name="storeName" placeholder="Store name for sellers"/></>}<input className="input" name="email" type="email" placeholder="Email" required/><input className="input" name="password" type="password" placeholder="Password" required/>{error && <p className="text-sm text-red-600">{error}</p>}<button className="btn-primary w-full">Continue</button></form>;
}
