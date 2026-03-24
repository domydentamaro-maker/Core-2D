import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { isAuthenticated, logout } from './auth';
import AdminLauncher from './AdminLauncher';

interface ValutazioniGuardProps {
  onRequireLogin: () => void;
}

const ValutazioniGuard: React.FC<ValutazioniGuardProps> = ({ onRequireLogin }) => {
  const [authed, setAuthed] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const check = () => setAuthed(isAuthenticated());
    check();
    const interval = setInterval(check, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!authed) {
      onRequireLogin();
    }
  }, [authed, onRequireLogin]);

  const handleLogout = useCallback(() => {
    logout();
    setAuthed(false);
  }, []);

  if (!authed) {
    return (
      <>
        <Helmet>
          <title>Area Riservata | 2D Sviluppo Immobiliare</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
          <p className="text-[#C8A96E] font-medium" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Accesso richiesto...
          </p>
        </div>
      </>
    );
  }

  return <AdminLauncher onLogout={handleLogout} />;
};

export default ValutazioniGuard;
