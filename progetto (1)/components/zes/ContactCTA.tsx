import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactCTA: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Left Side: Image/Brand */}
          <div className="md:w-1/2 relative min-h-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80" 
              alt="Ufficio 2D Sviluppo Immobiliare" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-center p-8">
              <h3 className="text-4xl font-bold text-white mb-2">2D</h3>
              <p className="text-xl text-blue-200 tracking-widest uppercase">Sviluppo Immobiliare</p>
            </div>
          </div>

          {/* Right Side: Contact Info */}
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Realizziamo il tuo progetto
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Hai un'idea imprenditoriale o cerchi un'area industriale in zona ZES? 
              Contatta <strong>2D Sviluppo Immobiliare</strong> per una valutazione preliminare del tuo investimento.
            </p>

            <div className="space-y-6">
              <a href="mailto:info@2dsviluppoimmobiliare.it" className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-6 h-6 text-blue-700 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Scrivici una Email</p>
                  <p className="text-lg font-bold text-slate-900">info@2dsviluppoimmobiliare.it</p>
                </div>
              </a>

              <a href="tel:+393408039322" className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Phone className="w-6 h-6 text-blue-700 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Chiamaci Ora</p>
                  <p className="text-lg font-bold text-slate-900">340 803 9322</p>
                </div>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;