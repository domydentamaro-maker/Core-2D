import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import AppShell from './app/AppShell';

/**
 * Wrapper root per l'app perizie/stime.
 * Applica il tema gold/ivory tramite la classe `valutazioni-app`
 * che attiva le CSS variables definite in index.css.
 */
const ValutazioniApp: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  useEffect(() => {
    // Marca il body per le CSS variables scoped
    document.body.classList.add('valutazioni-app');
    return () => {
      document.body.classList.remove('valutazioni-app');
    };
  }, []);

  return (
    <div className="valutazioni-app min-h-screen">
      <AppShell onLogout={onLogout} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#FDFAF4',
            border: '1px solid #D4C9B0',
            color: '#1A1A1A',
            fontFamily: 'Source Sans 3, sans-serif',
          },
        }}
      />
    </div>
  );
};

export default ValutazioniApp;
