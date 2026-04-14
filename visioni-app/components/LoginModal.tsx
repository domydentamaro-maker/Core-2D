
import React, { useState } from 'react';
import { X, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  /** Se fornita, viene usata per la validazione reale (es. /admin). Restituisce true se ok. */
  onLoginAttempt?: (username: string, password: string) => boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onLoginAttempt }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (onLoginAttempt) {
      // Real auth (area perizie)
      const ok = onLoginAttempt(username, password);
      setLoading(false);
      if (ok) {
        onLogin();
        onClose();
      } else {
        setError('Credenziali non valide. Riprova.');
      }
    } else {
      // Simulazione dashboard investitori
      setTimeout(() => {
        setLoading(false);
        onLogin();
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <X className="w-5 h-5" />
        </button>

        <div className="bg-[#003366] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            {onLoginAttempt ? 'Area Riservata' : 'Area Investitori'}
          </h3>
          <p className="text-cyan-100 text-sm mt-2">
            {onLoginAttempt ? 'Perizie & Stime Immobiliari' : 'Accedi ai dati in tempo reale'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#003366] focus:bg-white outline-none transition-all"
                placeholder={onLoginAttempt ? 'username' : 'investor@2d.it'}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#003366] focus:bg-white outline-none transition-all"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#003366] text-white font-bold py-4 rounded-xl hover:bg-cyan-700 transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                ACCEDI
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-400">
            {onLoginAttempt ? 'Accesso riservato — uso interno 2D Sviluppo.' : 'Accesso riservato ai partner accreditati 2D Sviluppo.'}
          </p>
        </form>
      </div>
    </div>
  );
};
