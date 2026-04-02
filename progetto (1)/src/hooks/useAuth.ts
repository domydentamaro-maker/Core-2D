import { useEffect, useState } from 'react';
import { getSession, login, logout, type AuthSession } from '../services/auth';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  return {
    session,
    isLoggedIn: Boolean(session),
    login: async (email: string, password: string) => {
      const s = await login(email, password);
      setSession(s);
      return s;
    },
    logout: () => {
      logout();
      setSession(null);
    },
  };
}
