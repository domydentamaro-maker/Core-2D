import { storage } from './storage';

const AUTH_KEY = 'visioni.auth';

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  role: 'cliente' | 'admin';
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const token = btoa(`${email}:${password}:${Date.now()}`);
  const session: AuthSession = {
    token,
    userId: `u_${Math.random().toString(36).slice(2, 10)}`,
    email,
    role: email.includes('admin') ? 'admin' : 'cliente',
  };
  storage.set(AUTH_KEY, session);
  return session;
}

export function logout(): void {
  storage.remove(AUTH_KEY);
}

export function getSession(): AuthSession | null {
  return storage.get<AuthSession | null>(AUTH_KEY, null);
}
