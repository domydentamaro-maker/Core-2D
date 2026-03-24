const FooterSection = () => {
  return (
    <footer className="py-8 px-6 border-t border-slate-200">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} Domenico Dentamaro — 2D Sviluppo Immobiliare. Tutti i diritti riservati.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.2dsviluppoimmobiliare.it"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors"
          >
            2dsviluppoimmobiliare.it
          </a>
          <a
            href="https://it.linkedin.com/in/domenico-dentamaro-"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
