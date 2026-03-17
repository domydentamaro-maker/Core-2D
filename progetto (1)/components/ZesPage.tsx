import React from 'react';
import { Hero } from './Hero';
import { ComparisonTable } from './ComparisonTable';
import { Contact } from './Contact';
import { LeadMagnet } from './LeadMagnet';
import { FAQ } from './FAQ';

export const ZesPage: React.FC = () => {
  const sectionClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10';

  return (
    <>
      <Hero
        videoUrl="https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4"
        fallbackImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=75&fm=webp"
        title="ZES Bari - Opportunità di sviluppo immobiliare"
        subtitle="Incentivi, esenzioni fiscali e piano operativo 2024-2026"
      />

      <section className={sectionClass}>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Perché la ZES Bari è strategica</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          La Zona Economica Speciale (ZES) Bari è un ecosistema di incentivi che permette alle imprese di ridurre il costo netto degli investimenti. Il nostro approccio è end-to-end: da analisi territoriale all’attivazione delle agevolazioni.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Investitori e sviluppatori possono accedere a crediti d’imposta, esenzioni IRAP, semplificazioni amministrative e priorità nei bandi. La nostra equipe verifica la fattibilità con mappa operativa e direct support al Gestore ZES.
        </p>
      </section>

      <section className={`${sectionClass} bg-gray-50 rounded-xl`}>
        <h3 className="text-2xl font-semibold mb-4">Cosa copriamo su misura</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Analisi di eleggibilità della proprietà in ambito ZES</li>
          <li>Piano finanziario per credito d’imposta e IRAP decennale</li>
          <li>Assistenza permessi, SUE e AIA</li>
          <li>Supporto link a infrastrutture logistiche (porto, ferrovia, road)</li>
          <li>Project management per ciclo di sviluppo completo</li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h3 className="text-2xl font-semibold mb-4">Analisi dei vantaggi ZES Bari 2024-2025</h3>
        <ComparisonTable />
      </section>

      <section className={sectionClass}>
        <h3 className="text-2xl font-semibold mb-4">Guida rapida in 5 step</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Verifica della localizzazione in ZES con geo-tag comunali</li>
          <li>Checklist documentale e iter autorizzativo</li>
          <li>Render & computo: assetto delle spese + obiettivi di ROI</li>
          <li>Interazione con Ente Gestore e percorso agevolazione</li>
          <li>Monitoraggio KPI e piano scaling</li>
        </ol>
      </section>

      <section className={sectionClass}>
        <h3 className="text-2xl font-semibold mb-4">Pronto per partire?</h3>
        <LeadMagnet />
      </section>

      <section className={sectionClass}>
        <h3 className="text-2xl font-semibold mb-4">Domande frequenti su ZES</h3>
        <FAQ />
      </section>

      <section className={`${sectionClass} border-t pt-8`}>        
        <Contact />
      </section>
    </>
  );
};
