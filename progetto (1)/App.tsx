
import React, { useState, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrackRecord } from './components/TrackRecord';
import { ProgressBar } from './components/ProgressBar';
import { ProjectGrid } from './components/ProjectGrid'; // Static import for anchor links
import { Contact } from './components/Contact';         // Static import for anchor links
import { TechnicalPartners } from './components/TechnicalPartners';
import { ComparisonTable } from './components/ComparisonTable';
import { Glossary } from './components/Glossary';
import { Seo } from './components/Seo';
import { FAQ } from './components/FAQ';
import { login as authLogin } from './components/valutazioni/auth';

// Lazy Load Non-Critical Content
const Values = lazy(() => import('./components/Values').then(module => ({ default: module.Values })));
const FiloMethod = lazy(() => import('./components/FiloMethod').then(module => ({ default: module.FiloMethod })));
const ProcessTimeline = lazy(() => import('./components/ProcessTimeline').then(module => ({ default: module.ProcessTimeline })));
const LeadMagnet = lazy(() => import('./components/LeadMagnet').then(module => ({ default: module.LeadMagnet })));
const Founder = lazy(() => import('./components/Founder').then(module => ({ default: module.Founder })));
const Stats = lazy(() => import('./components/Stats').then(module => ({ default: module.Stats })));
const ZesPage = lazy(() => import('./components/ZesPage').then(module => ({ default: module.ZesPage })));
const DomenicoPage = lazy(() => import('./components/DomenicoPage').then(module => ({ default: module.DomenicoPage })));
const MetodoFiloPage = lazy(() => import('./components/MetodoFiloPage').then(module => ({ default: module.default })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const FloatingContact = lazy(() => import('./components/FloatingContact').then(module => ({ default: module.FloatingContact })));
const ScrollToTop = lazy(() => import('./components/ScrollToTop').then(module => ({ default: module.ScrollToTop })));const CookieBanner = lazy(() => import('./components/CookieBanner').then(module => ({ default: module.CookieBanner })));
const LoginModal = lazy(() => import('./components/LoginModal').then(module => ({ default: module.LoginModal })));
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const ValutazioniGuard = lazy(() => import('./components/valutazioni/ValutazioniGuard'));

// --- Static Definitions ---
const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
  <g stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80 130 L80 60 L100 50 L100 130" />
    <path d="M80 75 L100 65" />
    <path d="M100 130 L100 30 L140 10 L140 130" />
    <path d="M100 50 L140 30" />
    <path d="M140 130 L140 40 L180 55 L180 130" />
    <path d="M140 60 L180 75" />
    <path d="M50 140 Q 150 120 250 140" stroke-width="1.5" opacity="0.8" />
  </g>
  <g font-family="Arial, sans-serif" font-weight="800" font-size="80">
    <text x="110" y="205" text-anchor="end" fill="#D4AF37" stroke="white" stroke-width="1">2</text>
    <text x="115" y="205" text-anchor="start" fill="#005C97" stroke="white" stroke-width="1">D</text>
  </g>
  <g font-family="Arial, sans-serif" font-weight="600" text-anchor="middle">
    <text x="150" y="235" font-size="14" fill="white" letter-spacing="4" font-weight="bold">SVILUPPO IMMOBILIARE</text>
  </g>
</svg>
`.trim();

const LOGO_URL = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
const HERO_VIDEO_URL = "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4"; 
// hero image is already WebP but if it exceeds 500KB consider generating a lighter version
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=75&fm=webp";

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForAdmin, setLoginForAdmin] = useState(false);
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, '') || '/'; // Normalize pathname

  // Render helpers for different pages
  const renderHome = () => (
    <>
      <Hero videoUrl={HERO_VIDEO_URL} fallbackImage={HERO_IMAGE_URL} />
      <TrackRecord />
      <Suspense fallback={<div className="py-24"></div>}>
        <Values />
        <FiloMethod />
        <ProcessTimeline />
        <LeadMagnet />
        <ComparisonTable />
        <ProjectGrid />
        <Glossary />
        <TechnicalPartners />
        <Stats />
        <Founder />
        <Contact />
      </Suspense>
    </>
  );

  const renderFiloPage = () => (
    <>
      <Hero videoUrl={HERO_VIDEO_URL} fallbackImage={HERO_IMAGE_URL} />
      <Suspense fallback={<div className="py-24"></div>}>
        <FiloMethod />
      </Suspense>
    </>
  );

  const renderContactPage = () => (
    <>
      <Hero videoUrl={HERO_VIDEO_URL} fallbackImage={HERO_IMAGE_URL} />
      <Suspense fallback={<div className="py-24"></div>}>
        <Contact />
      </Suspense>
    </>
  );

  const renderGlossaryPage = () => (
    <>
      <Hero videoUrl={HERO_VIDEO_URL} fallbackImage={HERO_IMAGE_URL} />
      <Suspense fallback={<div className="py-24"></div>}>
        <Glossary />
      </Suspense>
    </>
  );

  const renderBariPage = () => (
    <>
      <Hero videoUrl={HERO_VIDEO_URL} fallbackImage={HERO_IMAGE_URL} />
      <Suspense fallback={<div className="py-24"></div>}>
        <ProjectGrid />
      </Suspense>
    </>
  );

  const renderProvinciaBariPage = () => (
    <>
      <Hero videoUrl={HERO_VIDEO_URL} fallbackImage={HERO_IMAGE_URL} />
      <Suspense fallback={<div className="py-24"></div>}>
        <ComparisonTable />
      </Suspense>
    </>
  );

  // Determine which content to render
  const getMainContent = () => {
    switch (pathname) {
      case '/filo':
        return (
          <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <MetodoFiloPage />
          </Suspense>
        );
      case '/contact':
        return renderContactPage();
      case '/glossario':
        return renderGlossaryPage();
      case '/bari':
        return renderBariPage();
      case '/zes':
        return (
          <Suspense fallback={<div className="min-h-screen bg-[#0a1628]" />}>
            <ZesPage />
          </Suspense>
        );
      case '/domenico-dentamaro':
        return (
          <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <DomenicoPage />
          </Suspense>
        );
      case '/provincia-bari':
        return renderProvinciaBariPage();
      case '/admin':
        return (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]"><span className="text-[#5C5346]">Caricamento...</span></div>}>
            <ValutazioniGuard onRequireLogin={() => { setLoginForAdmin(true); setIsLoginOpen(true); }} />
          </Suspense>
        );
      default:
        return renderHome();
    }
  };

  const isZesPage = pathname === '/zes' || pathname === '/domenico-dentamaro' || pathname === '/filo' || pathname === '/admin';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased overflow-x-hidden">
        <div className="animate-fade-in relative">
          <Seo />
          {!isZesPage && <ProgressBar />}
          {!isZesPage && <Navbar logoUrl={LOGO_URL} onOpenLogin={() => setIsLoginOpen(true)} />}
          
          <main>
            {getMainContent()}
          </main>
          
          {/* hidden FAQ for crawlers / AI search */}
          {!isZesPage && <FAQ />}

          <Suspense fallback={null}>
            {!isZesPage && <Footer logoUrl={LOGO_URL} brandName="2D Sviluppo Immobiliare" />}
            {!isZesPage && <FloatingContact />}
            {!isZesPage && <ScrollToTop />}
            <CookieBanner />
            
            <LoginModal 
              isOpen={isLoginOpen} 
              onClose={() => { setIsLoginOpen(false); setLoginForAdmin(false); }} 
              onLogin={() => { if (!loginForAdmin) setIsLoggedIn(true); }}
              onLoginAttempt={loginForAdmin ? authLogin : undefined}
            />
            <Dashboard 
              isOpen={isLoggedIn} 
              onClose={() => setIsLoggedIn(false)} 
              user="Investitore Partner"
            />
          </Suspense>
        </div>
    </div>
  );
};

export default App;
