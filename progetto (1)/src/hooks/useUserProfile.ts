import { useMemo } from 'react';
import { useAuth } from './useAuth';

export function useUserProfile() {
  const { session } = useAuth();

  return useMemo(
    () => ({
      id: session?.userId ?? 'guest',
      email: session?.email ?? 'guest@local',
      role: session?.role ?? 'cliente',
    }),
    [session]
  );
}
