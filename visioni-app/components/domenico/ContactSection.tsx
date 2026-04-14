import { MapPin, Mail, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section
      className="reveal-section opacity-0 translate-y-4 transition-all duration-700 ease-out py-20 md:py-32 px-6"
      style={{ backgroundColor: "hsl(215, 45%, 12%)" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4" style={{ textWrap: "balance" }}>
          Parla con Domenico
        </h2>
        <p className="text-white/60 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
          Il futuro del tuo investimento immobiliare inizia con una conversazione. Senza impegno.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl border border-white/8 bg-white/[0.03]">
            <MapPin className="w-5 h-5 mx-auto mb-3" style={{ color: "hsl(42, 55%, 60%)" }} />
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Sede</p>
            <p className="text-sm text-white/80">Via Domenico Di Venere<br />Ceglie del Campo — Bari</p>
          </div>
          <a
            href="mailto:info@2dsviluppoimmobiliare.it"
            className="p-6 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors active:scale-[0.97]"
          >
            <Mail className="w-5 h-5 mx-auto mb-3" style={{ color: "hsl(42, 55%, 60%)" }} />
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Email</p>
            <p className="text-sm text-white/80">info@2dsviluppoimmobiliare.it</p>
          </a>
          <a
            href="tel:+393408039322"
            className="p-6 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors active:scale-[0.97]"
          >
            <Phone className="w-5 h-5 mx-auto mb-3" style={{ color: "hsl(42, 55%, 60%)" }} />
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Telefono</p>
            <p className="text-sm text-white/80">+39 340 803 9322</p>
          </a>
        </div>

        <div className="mt-10">
          <a
            href="https://www.2dsviluppoimmobiliare.it/#contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
            style={{ backgroundColor: "hsl(42, 55%, 55%)", color: "hsl(215, 45%, 12%)" }}
          >
            Prenota una Consulenza Gratuita
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
