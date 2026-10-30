import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { api } from '../../lib/api';
import { memberKey, tokenKey } from '../../constants';
import type { AuthMember } from '../../types';

type Credentials = { email: string; password: string };
type Registration = Credentials & { name: string; phone: string; type: 'BUYER' | 'SELLER' };
type SessionContextValue = {
  member: AuthMember | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signUp: (registration: Registration) => Promise<void>;
  signOut: () => Promise<void>;
};
const SessionContext = createContext<SessionContextValue | null>(null);

function readMember(): AuthMember | null {
  try { return JSON.parse(localStorage.getItem(memberKey) ?? 'null') as AuthMember | null; }
  catch { return null; }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<AuthMember | null>(readMember);
  const value = useMemo<SessionContextValue>(() => ({
    member,
    async signIn(credentials) {
      const result = await api<{ member: AuthMember; token: string }>('/api/members/login', { method: 'POST', body: JSON.stringify(credentials) });
      localStorage.setItem(tokenKey, result.token);
      localStorage.setItem(memberKey, JSON.stringify(result.member));
      setMember(result.member);
    },
    async signUp(registration) {
      await api('/api/members/register', { method: 'POST', body: JSON.stringify(registration) });
    },
    async signOut() {
      try { await api('/api/members/logout', { method: 'POST' }); } catch { /* Eskirgan server sessiyasi lokal chiqishga xalal bermaydi. */ }
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(memberKey);
      setMember(null);
    }
  }), [member]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession SessionProvider ichida ishlatilishi kerak');
  return context;
}
