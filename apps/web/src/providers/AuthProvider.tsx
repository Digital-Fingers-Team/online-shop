"use client";
import type { UserDTO } from "@marketplace/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { marketplaceApi } from "@/lib/api";

type AuthContextValue = { user: UserDTO | null; token: string | null; login(email: string, password: string): Promise<void>; register(input: Record<string, unknown>): Promise<void>; logout(): void };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => { setToken(localStorage.getItem("accessToken")); const stored = localStorage.getItem("user"); if (stored) setUser(JSON.parse(stored)); }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    async login(email, password) { const auth = await marketplaceApi.login({ email, password }); localStorage.setItem("accessToken", auth.accessToken); localStorage.setItem("user", JSON.stringify(auth.user)); setToken(auth.accessToken); setUser(auth.user); },
    async register(input) { const auth = await marketplaceApi.register(input); localStorage.setItem("accessToken", auth.accessToken); localStorage.setItem("user", JSON.stringify(auth.user)); setToken(auth.accessToken); setUser(auth.user); },
    logout() { localStorage.removeItem("accessToken"); localStorage.removeItem("user"); setToken(null); setUser(null); }
  }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
