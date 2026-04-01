import { useState } from "react";
import { Button } from "../valutazioni/ui/button";
import { Input } from "../valutazioni/ui/input";
import { Textarea } from "../valutazioni/ui/textarea";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Collaboration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.alert("Richiesta inviata. Ti contatteremo presto per discutere del tuo progetto.");
    setFormData({ name: "", email: "", type: "", message: "" });
  };

  return (
    <section id="contatti" className="py-20 bg-nero text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gold">
            Parla con noi
          </h2>
          <p className="text-xl text-background/80 leading-relaxed">
            Il futuro del tuo investimento inizia con una conversazione. 
            Siamo qui per rispondere alle tue domande, senza impegno.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <div className="bg-background/5 backdrop-blur-sm p-8 rounded-sm border border-gold/30">
            <h3 className="text-2xl font-serif font-semibold mb-6 text-gold">
              Scrivici un messaggio
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Nome Completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-gold"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Indirizzo Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-gold"
                />
              </div>
              <div>
                <Input
                  placeholder="Sei un Proprietario, Investitore o Tecnico?"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-gold"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Come possiamo aiutarti?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-gold resize-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gold hover:bg-gold-dark text-nero font-semibold text-lg py-6 rounded-none"
              >
                Invia richiesta
              </Button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-background/5 backdrop-blur-sm p-8 rounded-sm border border-gold/30">
              <h3 className="text-2xl font-serif font-semibold mb-6 text-gold">
                Contatti diretti
              </h3>
              <div className="space-y-4 text-background/90">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gold flex-shrink-0 mt-1" size={20} />
                  <span>Via Domenico Di Venere<br />Ceglie del Campo - Bari</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gold flex-shrink-0" size={20} />
                  <a href="mailto:info@2dsviluppoimmobiliare.it" className="hover:text-gold transition-colors">
                    info@2dsviluppoimmobiliare.it
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gold flex-shrink-0" size={20} />
                  <a href="tel:+393408039322" className="hover:text-gold transition-colors">
                    +39 340 803 9322
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-background/5 backdrop-blur-sm p-8 rounded-sm border border-gold/30">
              <h3 className="text-2xl font-serif font-semibold mb-6 text-gold">
                Cosa possiamo fare per te
              </h3>
              <ul className="space-y-3 text-background/90">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">→</span>
                  <span>Valutazione gratuita del tuo terreno</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">→</span>
                  <span>Studio di fattibilità urbanistica</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">→</span>
                  <span>Analisi del potenziale di sviluppo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">→</span>
                  <span>Proposta di permuta al nuovo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">→</span>
                  <span>Consulenza per investitori</span>
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full border-gold text-gold hover:bg-gold hover:text-nero font-semibold text-lg py-6 rounded-none"
            >
              <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2" size={20} />
                Visita il sito principale
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
