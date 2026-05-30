'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter(); const { register } = useAuth(); const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState('');
  async function submit(event: React.FormEvent) { event.preventDefault(); setError(''); try { await register(form.name, form.email, form.password); router.push('/products'); } catch (err) { setError(err instanceof Error ? err.message : 'Registration failed'); } }
  return <div className="container-page max-w-md"><form onSubmit={submit} className="card space-y-4 p-6"><h1 className="text-3xl font-black">Create account</h1>{error ? <p className="rounded-xl bg-red-50 p-3 text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}<input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><input className="input" type="password" minLength={8} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button className="btn-primary w-full">Register</button></form></div>;
}
