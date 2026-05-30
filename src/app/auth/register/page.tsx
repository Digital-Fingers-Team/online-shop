import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 py-12"><AuthForm mode="register" /><p className="text-sm text-slate-600">Already registered? <Link className="font-bold text-brand-600" href="/auth/login">Log in</Link></p></div>;
}
