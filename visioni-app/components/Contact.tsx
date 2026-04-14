import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Calendar, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Formspree endpoint - form ID: xreyqyla
      const response = await fetch('https://formspree.io/f/xreyqyla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          _subject: `Nuovo contatto da ${formState.name}`
        })
      });
      
      if (response.ok) {
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Form error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info & Map */}
          <RevealOnScroll>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-[#003366] mb-6">Parla con noi</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Il futuro del tuo investimento inizia con una conversazione. 
                Siamo qui per rispondere alle tue domande, senza impegno.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="p-3 bg-white shadow-md rounded-full text-cyan-600 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Sede Principale</h4>
                    <p className="text-slate-600">Via Domenico Di Venere - Ceglie del Campo - Bari</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="p-3 bg-white shadow-md rounded-full text-cyan-600 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Email</h4>
                    <p className="text-slate-600">info@2dsviluppoimmobiliare.it</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="p-3 bg-white shadow-md rounded-full text-cyan-600 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Telefono</h4>
                    <p className="text-slate-600">+39 340 803 9322</p>
                  </div>
                </div>
              </div>

              {/* Calendly Call Action */}
              <div className="mb-12">
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#003366] text-white rounded-xl font-bold shadow-lg hover:bg-cyan-600 transition-all transform hover:-translate-y-1">
                  <Calendar className="w-5 h-5" />
                  Prenota una Consulenza (15 min)
                </button>
              </div>

              {/* Embedded Map */}
              <div className="w-full h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.4789547144186!2d16.8643128!3d41.0805125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347e85c1c0c1b0b%3A0x6b9d6c8b1c0c1b0b!2sVia%20Domenico%20Di%20Venere%2C%20Ceglie%20del%20Campo%2C%20Bari!5e0!3m2!1sit!2sit!4v1620000000000!5m2!1sit!2sit" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  title="Mappa Sede 2D Sviluppo Immobiliare"
                ></iframe>
              </div>
            </div>
          </RevealOnScroll>

          {/* Form */}
          <RevealOnScroll delay={200}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 h-full flex flex-col justify-center relative overflow-hidden">
              {/* Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-full"></div>

              <h3 className="text-2xl font-bold text-[#003366] mb-2">Scrivici un messaggio</h3>
              <p className="text-gray-500 mb-8 text-sm">Compila il form per richiedere la brochure o informazioni.</p>
              
              {status === 'success' ? (
                <div className="bg-green-50 text-green-700 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-64 border border-green-100">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">Messaggio Ricevuto!</h4>
                  <p>Grazie per averci contattato. Un nostro consulente ti risponderà entro 24 ore.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      id="name"
                      aria-label="Inserisci il tuo nome completo"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-cyan-500 focus:ring-0 outline-none transition-all font-medium text-slate-800"
                      placeholder="Es. Mario Rossi"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Indirizzo Email</label>
                    <input 
                      type="email" 
                      id="email"
                      aria-label="Inserisci il tuo indirizzo email"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-cyan-500 focus:ring-0 outline-none transition-all font-medium text-slate-800"
                      placeholder="Es. mario@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Come possiamo aiutarti?</label>
                    <textarea 
                      id="message"
                      aria-label="Inserisci il tuo messaggio"
                      required
                      rows={4}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-cyan-500 focus:ring-0 outline-none transition-all resize-none font-medium text-slate-800"
                      placeholder="Vorrei maggiori informazioni sul progetto..."
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    aria-label={status === 'loading' ? 'Invio del messaggio in corso' : 'Invia richiesta'}
                    aria-disabled={status === 'loading'}
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-[#003366] to-cyan-800 text-white font-bold py-5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'INVIO IN CORSO...' : 'INVIA RICHIESTA'}
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
};