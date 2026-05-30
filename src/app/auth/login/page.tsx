import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 py-12"><AuthForm mode="login" /><p className="text-sm text-slate-600">No account? <Link className="font-bold text-brand-600" href="/auth/register">Register</Link></p></div>;
}
