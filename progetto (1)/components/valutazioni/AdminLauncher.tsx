import React, { lazy, Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { logout } from './auth';
import { FileText, BarChart2, Plus, LogOut } from 'lucide-react';

const ValutazioniApp = lazy(() => import('./ValutazioniApp'));

interface AppCard {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
}

const APPS: AppCard[] = [
  {
    id: 'perizie',
    label: 'Perizie & Stime',
    sublabel: 'Valutazioni immobiliari',
    icon: <FileText size={32} />,
    color: '#C8A96E',
    available: true,
  },
  {
    id: 'analisi',
    label: 'Analisi di Mercato',
    sublabel: 'Prossimamente',
    icon: <BarChart2 size={32} />,
    color: '#9E9E9E',
    available: false,
  },
  {
    id: 'nuova',
    label: 'Nuova App',
    sublabel: 'In sviluppo',
    icon: <Plus size={32} />,
    color: '#9E9E9E',
    available: false,
  },
];

const AdminLauncher: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  // Apri direttamente l'app Perizie & Stime all'accesso
  const [activeApp, setActiveApp] = useState<string | null>('perizie');

  if (activeApp === 'perizie') {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
          <p className="text-[#5C5346] font-medium">Caricamento...</p>
        </div>
      }>
        <ValutazioniApp onLogout={onLogout} />
      </Suspense>
    );
  }

  return (
    <>
      <Helmet>
        <title>Area Riservata | 2D Sviluppo Immobiliare</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)',
          fontFamily: 'Source Sans 3, Playfair Display, sans-serif',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <p className="text-[#C8A96E] text-xs font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
              Area Riservata
            </p>
            <h1 className="text-white text-2xl font-bold mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              2D Sviluppo Immobiliare
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-[#9E9E9E] hover:text-white text-sm transition-colors"
            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
          >
            <LogOut size={16} />
            Esci
          </button>
        </div>

        {/* Divisore */}
        <div className="mx-8 border-t border-white/10 mb-10" />

        {/* Griglia icone app */}
        <div className="px-8 pb-12">
          <p className="text-white/50 text-sm mb-6 uppercase tracking-widest" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
            Seleziona un'applicazione
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-3xl">
            {APPS.map(app => (
              <button
                key={app.id}
                onClick={() => app.available && setActiveApp(app.id)}
                disabled={!app.available}
                className={[
                  'flex flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center transition-all duration-200',
                  app.available
                    ? 'bg-white/5 hover:bg-white/10 hover:scale-105 cursor-pointer border border-white/10 hover:border-[#C8A96E]/40'
                    : 'bg-white/3 cursor-not-allowed opacity-40 border border-white/5',
                ].join(' ')}
              >
                <span style={{ color: app.available ? app.color : '#9E9E9E' }}>
                  {app.icon}
                </span>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight"
                    style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                    {app.label}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5"
                    style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                    {app.sublabel}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLauncher;
