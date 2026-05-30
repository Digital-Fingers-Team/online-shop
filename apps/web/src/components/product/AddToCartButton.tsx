"use client";
import { useState } from "react";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
export function AddToCartButton({ productId }: { productId: string }) { const { token } = useAuth(); const [status, setStatus] = useState("Add to cart"); return <button className="btn-primary flex-1" onClick={async () => { if (!token) return setStatus("Login required"); setStatus("Adding..."); await marketplaceApi.addCart(token, productId); setStatus("Added"); }} type="button">{status}</button>; }
