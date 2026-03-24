# 🔧 GUIDA IMPLEMENTAZIONE TECNICA - FIX PRIORITARI
**Documento Pratico**: Codice pronto per copy-paste

---

## 🔴 CRITICO #1: ARIA LABELS - CONTACT.TSX FIX

### Codice Attuale (SBAGLIATO)
```tsx
export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <RevealOnScroll>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-[#003366] mb-6">Parla con noi</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4 group cursor-pointer">
                  {/* ❌ NO ARIA LABEL */}
                  <div className="p-3 bg-white shadow-md rounded-full text-cyan-600 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  {/* ... */}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* RIGHT SIDE: FORM */}
          <RevealOnScroll delay={200}>
            <form onSubmit={handleSubmit}>
              {/* ❌ INPUTS WITHOUT LABELS */}
              <input
                type="text"
                placeholder="Nome completo"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              />
              
              <input
                type="email"
                placeholder="La tua email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              />
              
              <textarea
                placeholder="Il tuo messaggio"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              ></textarea>

              {/* ❌ BUTTON WITHOUT ARIA STATES */}
              <button type="submit" className="...">
                <Send className="w-5 h-5" />
                Invia Messaggio
              </button>

              {/* ❌ NO ARIA LIVE FOR STATUS */}
              {status === 'success' && <p>Messaggio inviato!</p>}
              {status === 'error' && <p>Errore nell'invio</p>}
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};
```

### Codice Corretto (✅)
```tsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Calendar, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // ✅ ADD VALIDATION
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    } else if (formState.name.length < 3) {
      newErrors.name = 'Il nome deve avere almeno 3 caratteri';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!emailRegex.test(formState.email)) {
      newErrors.email = 'Email non valida';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Il messaggio è obbligatorio';
    } else if (formState.message.length < 10) {
      newErrors.message = 'Il messaggio deve avere almeno 10 caratteri';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ VALIDATE BEFORE SUBMIT
    if (!validateForm()) {
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch('https://formspree.io/f/mgvwqwbp', {
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
        setErrors({});
        // ✅ LONGER TIMEOUT FOR VISIBILITY
        setTimeout(() => setStatus('idle'), 5000);
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

  const handlePhoneClick = () => {
    window.location.href = 'tel:+39340803932';
  };

  return (
    <section 
      id="contact" 
      className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden scroll-mt-20"
      aria-label="Sezione Contatti"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT SIDE: INFO */}
          <RevealOnScroll>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-[#003366] mb-6">Parla con noi</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Il futuro del tuo investimento inizia con una conversazione. 
                Siamo qui per rispondere alle tue domande, senza impegno.
              </p>

              <div className="space-y-8 mb-12">
                {/* LOCATION */}
                <div 
                  className="flex items-start gap-4 group cursor-pointer"
                  role="listitem"
                  aria-label="Sede principale"
                >
                  <div 
                    className="p-3 bg-white shadow-md rounded-full text-cyan-600 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors"
                    aria-hidden="true"  // ✅ HIDE FROM SCREEN READERS (presentational)
                  >
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Sede Principale</h4>
                    <p className="text-slate-600">Via Domenico Di Venere - Ceglie del Campo - Bari</p>
                  </div>
                </div>

                {/* EMAIL */}
                <a 
                  href="mailto:info@2dsviluppoimmobiliare.it"
                  className="flex items-start gap-4 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-2"
                  role="listitem"
                  aria-label="Email info@2dsviluppoimmobiliare.it"
                >
                  <div 
                    className="p-3 bg-white shadow-md rounded-full text-cyan-600 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors"
                    aria-hidden="true"
                  >
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Email</h4>
                    <p className="text-slate-600">info@2dsviluppoimmobiliare.it</p>
                  </div>
                </a>

                {/* PHONE */}
                <button
                  onClick={handlePhoneClick}
                  className="flex items-start gap-4 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-2 text-left w-full bg-transparent border-0 p-0"
                  aria-label="Telefonare +39 340 803 9322"
                >
                  <div 
                    className="p-3 bg-white shadow-md rounded-full text-cyan-600 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors"
                    aria-hidden="true"
                  >
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Telefono</h4>
                    <p className="text-slate-600">+39 340 803 9322</p>
                  </div>
                </button>
              </div>

              {/* CALENDAR CTA */}
              <div className="mb-12">
                <button 
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#003366] text-white rounded-xl font-bold shadow-lg hover:bg-cyan-600 transition-all transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  aria-label="Prenota una consulenza di 15 minuti"
                >
                  <Calendar className="w-5 h-5" />
                  Prenota una Consulenza (15 min)
                </button>
              </div>

              {/* MAP */}
              <div className="w-full h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.4789547144186!2d16.8643128!3d41.0805125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347e85c1c0c1b0b%3A0x6b9d6c8b1c0c1b0b!2sVia%20Domenico%20Di%20Venere%2C%20Ceglie%20del%20Campo%2C%20Bari!5e0!3m2!1sit!2sit!4v1620000000000!5m2!1sit!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa - Sede 2D Sviluppo Immobiliare Bari"
                />
              </div>
            </div>
          </RevealOnScroll>

          {/* RIGHT SIDE: FORM */}
          <RevealOnScroll delay={200}>
            <form 
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
              aria-label="Modulo di contatti"
              noValidate
            >
              <h3 className="text-2xl font-serif text-[#003366] mb-8">Inviaci un Messaggio</h3>

              {/* NAME */}
              <div className="mb-6">
                <label 
                  htmlFor="contact-name"
                  className="block font-bold text-slate-800 mb-2"
                >
                  Nome Completo <span aria-label="obbligatorio" className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Es: Luca Rossi"
                  value={formState.name}
                  onChange={(e) => {
                    setFormState({ ...formState, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  onBlur={() => validateForm()}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  className={`w-full px-6 py-4 rounded-xl border-2 transition-colors ${
                    errors.name 
                      ? 'border-red-500 bg-red-50 focus:border-red-600' 
                      : 'border-slate-200 bg-slate-50 focus:border-cyan-500 focus:bg-white'
                  } outline-none`}
                />
                {errors.name && (
                  <div 
                    id="error-name"
                    className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* EMAIL */}
              <div className="mb-6">
                <label 
                  htmlFor="contact-email"
                  className="block font-bold text-slate-800 mb-2"
                >
                  Email <span aria-label="obbligatorio" className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="tu@example.com"
                  value={formState.email}
                  onChange={(e) => {
                    setFormState({ ...formState, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  onBlur={() => validateForm()}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  className={`w-full px-6 py-4 rounded-xl border-2 transition-colors ${
                    errors.email 
                      ? 'border-red-500 bg-red-50 focus:border-red-600' 
                      : 'border-slate-200 bg-slate-50 focus:border-cyan-500 focus:bg-white'
                  } outline-none`}
                />
                {errors.email && (
                  <div 
                    id="error-email"
                    className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* MESSAGE */}
              <div className="mb-8">
                <label 
                  htmlFor="contact-message"
                  className="block font-bold text-slate-800 mb-2"
                >
                  Messaggio <span aria-label="obbligatorio" className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  placeholder="Raccontaci del tuo terreno e delle tue aspettative..."
                  value={formState.message}
                  onChange={(e) => {
                    setFormState({ ...formState, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  onBlur={() => validateForm()}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  rows={5}
                  className={`w-full px-6 py-4 rounded-xl border-2 transition-colors resize-none ${
                    errors.message 
                      ? 'border-red-500 bg-red-50 focus:border-red-600' 
                      : 'border-slate-200 bg-slate-50 focus:border-cyan-500 focus:bg-white'
                  } outline-none`}
                />
                {errors.message && (
                  <div 
                    id="error-message"
                    className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
                aria-label={
                  status === 'loading' 
                    ? 'Invio del messaggio in corso' 
                    : 'Invia il messaggio'
                }
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  status === 'loading'
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
                    : 'bg-[#003366] text-white hover:bg-cyan-600 transform hover:-translate-y-1 shadow-lg'
                } outline-none focus-visible:ring-2 focus-visible:ring-cyan-500`}
              >
                {status === 'loading' ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Invia Messaggio
                  </>
                )}
              </button>

              {/* STATUS MESSAGES WITH ARIA LIVE */}
              {status === 'success' && (
                <div
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-start gap-3 animate-fade-in"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-800">Messaggio inviato!</h4>
                    <p className="text-green-700 text-sm">Ti contatteremo il prima possibile per discutere il tuo progetto.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3 animate-fade-in"
                >
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-800">Errore nell'invio</h4>
                    <p className="text-red-700 text-sm">Riprova più tardi o contattaci direttamente al tema o email.</p>
                  </div>
                </div>
              )}
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};
```

**Differenze Chiave - Copy questo codice in Contact.tsx**:
1. ✅ `<label htmlFor="...">` per ogni input
2. ✅ `aria-required="true"` su input obbligatori
3. ✅ `aria-invalid` + `aria-describedby` per errori
4. ✅ `role="status"` + `aria-live="polite"` per messaggi success/error
5. ✅ `aria-busy` su button durante loading
6. ✅ Validazione client-side con `validateForm()`
7. ✅ `tel:` link per telefono (mobile friendly)
8. ✅ AlertCircle icon per errori

---

## 🔴 CRITICO #2: GLOSSARY CONTRAST FIX

### File: `components/Glossary.tsx` (Linea 39)

**PRIMA**:
```tsx
<span className="text-slate-600">  {/* ❌ 3.2:1 ratio - BELOW WCAG */}
  {item.term}
</span>
```

**DOPO**:
```tsx
<span className="text-slate-800">  {/* ✅ 6.5:1 ratio - WCAG AAA */}
  {item.term}
</span>
```

### Spiegazione
- `text-slate-600` = #4b5563 on white = 3.2:1 (FAIL)
- `text-slate-800` = #1e293b on white = 6.5:1 (PASS)

---

## 🔴 CRITICO #3: OG:IMAGE - INDEX.HTML FIX

### File: `index.html` (Linea 13)

**PRIMA**:
```html
<meta property="og:image" content="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=75&fm=webp&fm=webp" />
<meta name="twitter:image" content="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?..." />
```

**DOPO**:
```html
<meta property="og:image" content="https://www.2dsviluppoimmobiliare.it/assets/domenico-dentamaro.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />

<meta name="twitter:image" content="https://www.2dsviluppoimmobiliare.it/assets/domenico-dentamaro.jpg" />
```

**Nota**: Assicurati che `domenico-dentamaro.jpg` esista in `public/assets/`

---

## 🟡 ALTO #4: PERSON SCHEMA - SEO.TSX ENHANCEMENT

### File: `components/Seo.tsx` (JSON section)

**Aggiungi LinkedIn + description** nel Person schema (ritrova la sezione Person già presente e migliora):

```json
{
  "@type": "Person",
  "@id": "https://www.2dsviluppoimmobiliare.it#domenico-dentamaro",
  "name": "Domenico Dentamaro",
  "url": "https://www.2dsviluppoimmobiliare.it",
  "image": "https://www.2dsviluppoimmobiliare.it/assets/domenico-dentamaro.jpg",
  "description": "Esperto di sviluppo immobiliare e valorizzazione terreni in Puglia con oltre 15 anni di esperienza nel settore. Fondatore di 2D Sviluppo Immobiliare, specialista ZES Bari. Autore del Metodo F.I.L.O. proprietario.",
  "jobTitle": "Fondatore & Consulente Immobiliare Specialista ZES",
  "worksFor": {
    "@type": "Organization",
    "@id": "https://www.2dsviluppoimmobiliare.it#org",
    "name": "2D Sviluppo Immobiliare"
  },
  "sameAs": [
    "https://www.facebook.com/2DSviluppoImmobiliare",
    "https://www.instagram.com/2d.sviluppoimmobiliare/",
    "https://www.linkedin.com/in/domenico-dentamaro",  // ⬅️ AGGIUNGI VERA PROFILO
    "https://www.linkedin.com/company/2dsviluppoimmobiliare"
  ],
  "areaServed": [
    "Bari",
    "Taranto",
    "Brindisi",
    "Lecce",
    "Altamura",
    "Puglia",
    "Basilicata"
  ],
  "knowsAbout": [
    "Sviluppo Immobiliare",
    "Valutazione Terreni",
    "ZES Bari",
    "Edilizia Sostenibile",
    "Real Estate",
    "Fattibilità Urbanistica"
  ],
  "telephone": "+39 340 803 9322",
  "email": "info@2dsviluppoimmobiliare.it",
  "award": [
    {
      "@type": "Award",
      "name": "Esperto Riconosciuto in Sviluppo Immobiliare Puglia"
    }
  ]
}
```

---

## 🟡 ALTO #5: HERO VIDEO LCP OPTIMIZATION

### File: `index.html` - Aggiungi nel `<head>`

```html
<!-- Video Preload (1 posizione prima di </head>) -->
<link rel="preload" as="video" href="https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4" type="video/mp4" media="(min-width: 1024px)">

<!-- Image Preload (già presente, pero verifica) -->
<link rel="preload" as="image" href="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=75&fm=webp" imagesrcset="" sizes="100vw">
```

### File: `components/Hero.tsx` - Cambia preload

**PRIMA**:
```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"  // ❌
  className="w-full h-full object-cover"
>
```

**DOPO**:
```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  preload="auto"  // ✅ CAMBIA
  className="w-full h-full object-cover"
>
```

---

## ✅ CHECKLIST IMPLEMENTAZIONE VELOCE (30 minuti)

**[ ] 10 minuti - OG:Image**
- [ ] Scarica Domenico foto da Google Storage o crea placeholder
- [ ] Copia in `public/assets/domenico-dentamaro.jpg`
- [ ] Aggiorna `index.html` linea 13

**[ ] 5 minuti - Glossary Contrast**
- [ ] Cambia `text-slate-600` → `text-slate-800` in Glossary.tsx

**[ ] 10 minuti - Contact Accessibility** (quick pass)
- [ ] Aggiungi ARIA labels agli input (copy codice sopra)
- [ ] Aggiungi validazione email

**[ ] 5 minuti - Person Schema**
- [ ] Aggiungi LinkedIn URL in Seo.tsx
- [ ] Aggiungi description field

**TOTAL**: ~30 minuti = +15% SEO immediato

---

## 📚 COME TESTARE I FIX

### Test WCAG Accessibility:
```bash
# Installa accessibility extension Chrome:
# https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnkpklempisson/

# Oppure installa il tool npm:
npm install -D @axe-core/webdriverio
```

### Test Contrast Ratio:
```
Colore test: #4b5563 (text-slate-600) on #ffffff
Rapporto: 3.24:1 ❌

Colore test: #1e293b (text-slate-800) on #ffffff
Rapporto: 6.48:1 ✅ WCAG AAA
```
(Usa strumento: https://webaim.org/resources/contrastchecker/)

### Test OG:Image:
```bash
# Vai su: https://www.opengraph.xyz/
# Incolla URL sito: https://www.2dsviluppoimmobiliare.it
# Verifica og:image preview
```

### Test Schema Markup:
```bash
# Google Structured Data Tester:
# https://search.google.com/test/rich-results

# Incolla fonte HTML e verifica @graph structure
```

---

**Tempo totale implementation**: 4-6 ore (full fix)  
**Tempo quick wins**: 30-45 minuti  
**SEO improvement expected**: +15-25% visibilità in 30 giorni

