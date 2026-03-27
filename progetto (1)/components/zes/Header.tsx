
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Logo: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => (
  <svg width="280" height="60" viewBox="0 0 280 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto transition-all duration-300">
    {/* Icona Palazzo Stilizzato */}
    <path d="M5 45L15 10L40 5L45 40L5 45Z" fill="url(#building_grad)" fillOpacity="0.1" />
    <path d="M10 45V15M20 45V10M30 45V8M40 45V12M10 15H40M10 25H40M10 35H40" stroke={isScrolled ? "#64748b" : "#cbd5e1"} strokeWidth="0.5" />
    <path d="M12 45L12 15L38 15L38 45" stroke={isScrolled ? "#94a3b8" : "#f1f5f9"} strokeWidth="1" />
    <rect x="25" y="10" width="12" height="35" fill={isScrolled ? "#475569" : "#ffffff"} fillOpacity="0.2" />
    
    {/* Testo 2D con Gradienti */}
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="gradD" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
      <linearGradient id="building_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    
    <text x="55" y="42" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="38" fill="url(#grad2)">2</text>
    <text x="82" y="42" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="38" fill="url(#gradD)">D</text>
    
    {/* Testo Sviluppo Immobiliare */}
    <text x="125" y="28" fontFamily="Inter, sans-serif" fontWeight="300" fontSize="18" letterSpacing="2" fill={isScrolled ? "#0f172a" : "#ffffff"}>SVILUPPO</text>
    <text x="125" y="48" fontFamily="Inter, sans-serif" fontWeight="300" fontSize="18" letterSpacing="2" fill={isScrolled ? "#0f172a" : "#ffffff"}>IMMOBILIARE</text>
  </svg>
);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Chi Siamo', href: '#about' },
    { name: 'ZES & Terziario', href: '#focus' },
    { name: 'Progetti', href: '#projects' },
    { name: 'Proprietari', href: '#owners' },
    { name: 'Manuale ZES 2026', href: '/zes/manuale' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (href === '#') return;

    // Handle internal route navigation
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" onClick={(e) => handleScroll(e, '#root')} className="flex items-center group">
              <Logo isScrolled={isScrolled} />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`text-sm font-semibold hover:text-blue-500 transition-colors ${
                  isScrolled ? 'text-slate-700' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              className={`px-5 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wide transition-all ${
                isScrolled 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-white text-slate-900 hover:bg-blue-50'
              }`}
            >
              Contattaci
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition-colors ${isScrolled ? 'text-slate-900' : 'text-white bg-slate-900/30 backdrop-blur-sm'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-xl absolute top-full left-0 w-full border-t border-slate-100 h-screen overflow-y-auto pb-20">
          <div className="px-4 py-6 space-y-6 flex flex-col items-center text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-slate-800 font-bold hover:text-blue-700 text-xl w-full py-2"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              className="w-full text-center bg-slate-900 text-white py-4 rounded-sm font-bold hover:bg-slate-800 text-lg mt-4"
            >
              Contattaci
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
