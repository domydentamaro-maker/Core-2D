import React from 'react';
import { Helmet } from 'react-helmet-async';

// This component is visually minimal but provides structured FAQ markup for crawlers/AI.
export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Cos'è il Metodo F.I.L.O.?",
      answer: "F.I.L.O. è il nostro approccio proprietario che unisce Fattibilità, Idea, Localizzazione e Operazione per valorizzare al massimo un suolo.",
    },
    {
      question: "Come posso avere una stima del mio terreno?",
      answer: "Compila il form contatti o richiedi lo studio ZES: ti forniremo un'analisi gratuita delle potenzialità del tuo terreno secondo il Metodo F.I.L.O.",
    },
    {
      question: "La ZES Bari offre vantaggi fiscali?",
      answer: "Sì, gli insediamenti nella Zona Economica Speciale godono di crediti d'imposta e incentivi che possiamo aiutarti a massimizzare.",
    }
  ];

  return (
    <>
      <Helmet>
        {/* FAQPage structured data in <head> for better crawler recognition */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
              }
            }))
          })}
        </script>
      </Helmet>
      
      <section className="hidden sr-only">
        {faqs.map((item, i) => (
          <div key={i} itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">{item.question}</h3>
            <div itemScope itemType="https://schema.org/Answer">
              <p itemProp="text">{item.answer}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};
