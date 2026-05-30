"use client";
import { useAuth } from "@/providers/AuthProvider";
export default function ProfilePage() { const { user } = useAuth(); return <main className="container-page py-10"><h1 className="text-4xl font-black">Profile</h1><pre className="card mt-6 overflow-auto p-5">{JSON.stringify(user, null, 2)}</pre></main>; }
