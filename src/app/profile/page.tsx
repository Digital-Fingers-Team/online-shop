import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return <div className="container-page py-10"><div className="card max-w-2xl p-8"><p className="font-bold text-brand-600">Profile</p><h1 className="mt-2 text-3xl font-black">{user.name}</h1><p className="mt-2 text-slate-600">{user.email}</p><p className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-bold capitalize">{user.role}</p></div></div>;
}
