
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  logoUrl: string;
  onOpenLogin: () => void;
  forceBackground?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ logoUrl, onOpenLogin, forceBackground = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solidBg = isScrolled || forceBackground;

  const navLinks = [
    { label: 'Domenico Dentamaro', href: '/domenico-dentamaro' },
    { label: 'Metodo F.I.L.O', href: '/metodofilo' },
    { label: 'ZES', href: '/zes' },
    { label: 'Osservatorio', href: '/osservatorio' },
    { label: 'Permuta', href: '#permuta' },
    { label: 'Glossario', href: '#glossario' },
    { label: 'Area Tecnica', href: '#partners' },
    { label: 'Contatti', href: '#contact' }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // internal page routes — use React router (no full reload)
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0);
      return;
    }
    // anchor links
    if (!href.startsWith('#')) {
      return;
    }
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Not on home page — navigate home then scroll
      window.location.href = '/' + href;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        solidBg ? 'bg-[#003366]/95 backdrop-blur-xl shadow-lg py-2' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo(0, 0); }} className="flex-shrink-0">
          <img 
            src="https://storage.googleapis.com/tempo-image-previews/user_33jc6kDInS2v6uK8MIf4PZDaR7c-1764612387906-1000321309-removebg-preview.png" 
            alt="2D Sviluppo Immobiliare" 
            loading="lazy"
            width="96" // approximate based on h-24
            height="96"
            className="h-20 md:h-24 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className={`font-medium text-sm tracking-wide transition-colors relative group ${
                isScrolled ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                isScrolled ? 'bg-white' : 'bg-white'
              }`}></span>
            </a>
          ))}
          
          <button 
            onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              isScrolled 
                ? 'border-white/30 text-white hover:bg-white/20' 
                : 'border-white/30 text-white hover:bg-white/20'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Area Riservata</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-slate-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <Menu className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="absolute top-full left-0 w-full bg-white shadow-xl py-8 px-6 flex flex-col gap-4 lg:hidden animate-fade-in border-t border-gray-100">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xl font-serif text-[#003366] py-2 border-b border-gray-100"
            >
              {link.label}
            </a>
          ))}
          <button 
            onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
            className="flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-[#003366] text-white rounded-xl font-bold"
          >
            <Lock className="w-4 h-4" />
            ACCEDI AREA RISERVATA
          </button>
        </div>
      )}
    </header>
  );
};
