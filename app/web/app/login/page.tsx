'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter(); const { login } = useAuth(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  async function submit(event: React.FormEvent) { event.preventDefault(); setError(''); try { await login(email, password); router.push('/products'); } catch (err) { setError(err instanceof Error ? err.message : 'Login failed'); } }
  return <div className="container-page max-w-md"><form onSubmit={submit} className="card space-y-4 p-6"><h1 className="text-3xl font-black">Login</h1>{error ? <p className="rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}<input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button className="btn-primary w-full">Login</button><p className="text-center text-sm text-slate-500">Need an account? <Link className="text-brand-600" href="/register">Register</Link></p></form></div>;
}
