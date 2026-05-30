"use client";
import { useEffect, useState } from "react";
import type { UserDTO } from "@marketplace/types";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
export default function AdminDashboardPage() { const { token } = useAuth(); const [stats, setStats] = useState<Record<string, number>>({}); const [users, setUsers] = useState<UserDTO[]>([]); useEffect(() => { if (token) { marketplaceApi.adminStats(token).then(setStats); marketplaceApi.adminUsers(token).then(setUsers); } }, [token]); return <main className="container-page py-10"><h1 className="text-4xl font-black">Admin dashboard</h1><div className="mt-6 grid gap-4 md:grid-cols-5">{Object.entries(stats).map(([key, value]) => <div className="card p-5" key={key}><p className="text-sm capitalize text-slate-500">{key}</p><p className="text-3xl font-black">{value}</p></div>)}</div><section className="card mt-6 overflow-auto p-5"><h2 className="text-2xl font-bold">Users and sellers</h2>{users.map((user) => <div className="border-b py-3" key={user.id}>{user.name} · {user.email} · {user.role} · {user.isSuspended ? "Suspended" : "Active"}</div>)}</section></main>; }
