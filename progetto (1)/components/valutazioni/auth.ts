/**
 * Auth module per l'area riservata /admin (perizie/stime).
 * Credenziali configurabili tramite variabili d'ambiente (Vite),
 * con fallback su valori di default sicuri.
 * La sessione viene tenuta in sessionStorage (svanisce alla chiusura del tab).
 */

const SESSION_KEY = '2d_admin_session';

// Le credenziali reali vanno impostate come variabili Vite (.env):
// VITE_ADMIN_USER=nomeutente
// VITE_ADMIN_PASS=password
// Per ora usa le env var o fallback provvisorio
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER as string | undefined;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS as string | undefined;

export function login(username: string, password: string): boolean {
  if (!ADMIN_USER || !ADMIN_PASS) {
    // Credenziali non configurate — accesso bloccato per sicurezza
    return false;
  }
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, btoa(`${username}:${Date.now()}`));
    return true;
  }
  return false;
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) !== null;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
