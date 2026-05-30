'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, setToken } from '@/lib/api';
import type { User } from '@/types/domain';

type AuthContextValue = {
  user?: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<User>('/auth/me').then(setUser).catch(() => setUser(undefined)).finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(email, password) {
      const data = await apiFetch<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setToken(data.token);
      setUser(data.user);
    },
    async register(name, email, password) {
      const data = await apiFetch<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      setToken(data.token);
      setUser(data.user);
    },
    logout() {
      setToken(undefined);
      setUser(undefined);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
