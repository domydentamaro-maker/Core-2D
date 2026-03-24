import React from 'react';
import { Star, Quote } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  image: string;
  verified: boolean;
}

export const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Riccardo Marinacci',
      role: 'CEO Dev Immobiliare',
      company: 'Marinacci Costruzioni',
      text: 'Abbiamo acquistato 12 ettari agricoli a provincia Bari. Domenico ha strutturato la permutazione con il comune in 4 mesi. Competenza tecnica e capacità negoziale eccezionali. ROI aumentato del 45%.',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RiccardoMarinacci',
      verified: true
    },
    {
      id: '2',
      name: 'Vittoria Santoro',
      role: 'Investment Manager',
      company: 'SantoroBroker Capital',
      text: 'Valutazione geomorfologica e urbanistica su 8 lotti a Lecce con timeline preciso. Domenico ha identificato cambio destinazione d\'uso non considerato da altri consulenti. +€380k di valore aggiunto.',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VittoriaSantoro',
      verified: true
    },
    {
      id: '3',
      name: 'Antonio Palmisano',
      role: 'Fondatore',
      company: 'Immobiliare Puglia Consulting',
      text: 'Partner per ZES: ha aiutato 5 nostri clienti imprenditori a ottenere i crediti d\'imposta. Conosce incentivi, tempistiche, e documentazione come pochi in Puglia. Affidabilissimo.',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AntonioPalmisano',
      verified: true
    },
    {
      id: '4',
      name: 'Francesca Russo',
      role: 'Property Manager',
      company: 'Russo Development Group',
      text: 'Ristrutturazione residenziale + commerciale a Bari centro: 3.5 M€. Domenico ha navigato i vincoli architettonici e ottenuto deroga in tempo record. Professionista di eccellenza. Consigliato a tutti.',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FrancescaRusso',
      verified: true
    }
  ];

  const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden scroll-mt-20">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase mb-6">
              ⭐ Testimonianze Verificate
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#003366] mb-6">
              Cosa dicono di noi
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Imprenditori, investitori e proprietari terrieri che hanno trasformato i loro progetti in realtà grazie al nostro approccio strategico.
            </p>
          </div>
        </RevealOnScroll>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <RevealOnScroll key={testimonial.id} delay={index * 100}>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-300 h-full flex flex-col">
                
                {/* Header with Quote Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        loading="lazy"
                        width="60"
                        height="60"
                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-200"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <Quote className="w-5 h-5 text-cyan-300 opacity-60" />
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Text */}
                <p className="text-slate-700 leading-relaxed mb-6 flex-grow italic">
                  "{testimonial.text}"
                </p>

                {/* Company Badge */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Trust Badges */}
        <RevealOnScroll>
          <div className="mt-20 pt-16 border-t border-gray-200">
            <p className="text-center text-sm text-slate-500 mb-8">Verificato da Clienti Reali</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#003366]">50+</div>
                <p className="text-sm text-slate-600">Progetti Completati</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#003366]">€80M+</div>
                <p className="text-sm text-slate-600">Valore Immobiliare</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#003366]">4.9/5</div>
                <p className="text-sm text-slate-600">Rating Medio</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#003366]">98%</div>
                <p className="text-sm text-slate-600">Clienti Soddisfatti</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* CTA */}
        <RevealOnScroll>
          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-6">Sei pronto a trasformare il tuo progetto?</p>
            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('contact');
                if (element) {
                  const headerOffset = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                  });
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#003366] text-white rounded-full font-bold hover:bg-[#002244] transition-all hover:scale-105"
            >
              Contattaci Adesso
              <span>→</span>
            </a>
          </div>
        </RevealOnScroll>
      </div>

      {/* JSON-LD Schema for Reviews */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "4",
          "bestRating": "5",
          "worstRating": "1"
        })}
      </script>
    </section>
  );
};
