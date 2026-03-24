
import React, { useState } from 'react';
import { Download, Check, FileText, PieChart, ShieldAlert } from 'lucide-react';
import { jsPDF } from "jspdf";

const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      
      // --- GENERAZIONE PDF AVANZATA (8 PAGINE) ---
      const doc = new jsPDF();
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Helper per footer
      const addFooter = (pageNum: number) => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, 280, pageWidth - margin, 280);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Strategic Report ZES 2025 - 2D Sviluppo Immobiliare", margin, 286);
        doc.text(`Pagina ${pageNum}`, pageWidth - margin - 10, 286);
      };

      // === PAGINA 1: COPERTINA & EXECUTIVE SUMMARY ===
      doc.setFillColor(0, 51, 102); // Navy Blue
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.text("ZES UNICA 2025", margin, 30);
      doc.setFontSize(16);
      doc.text("Manuale Strategico per Investitori Immobiliari", margin, 45);

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text(`Preparato per: ${email}`, margin, 70);
      doc.text(`Data: ${new Date().toLocaleDateString()}`, margin, 75);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("1. Executive Summary", margin, 90);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const text1 = "La Zona Economica Speciale (ZES) Unica del Mezzogiorno rappresenta oggi l'opportunità di leva finanziaria più rilevante per lo sviluppo immobiliare nel Sud Italia. Non si tratta solo di un incentivo fiscale, ma di un acceleratore procedurale che riduce drasticamente i tempi di 'Time-to-Market' per nuovi insediamenti produttivi, logistici e turistici.";
      doc.text(doc.splitTextToSize(text1, contentWidth), margin, 100);

      const text2 = "Questo report strategico, sviluppato dal centro studi di 2D Sviluppo Immobiliare, analizza verticalmente l'impatto della normativa sui diversi asset class immobiliari, fornendo proiezioni finanziarie e strategie di mitigazione del rischio.";
      doc.text(doc.splitTextToSize(text2, contentWidth), margin, 130);

      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(margin, 150, pageWidth - margin, 150);

      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("Indice del Report:", margin, 165);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text("1. Executive Summary", margin + 5, 175);
      doc.text("2. Analisi Finanziaria & Incentivi", margin + 5, 185);
      doc.text("3. Timeline Autorizzazione Unica", margin + 5, 195);
      doc.text("4. Strategie Settoriali (Logistica, Hospitality, Uffici)", margin + 5, 205);
      doc.text("5. Case Study: Polo Logistico (ROI Analysis)", margin + 5, 215);
      doc.text("6. Case Study: Riqualificazione Turistica", margin + 5, 225);
      doc.text("7. Gestione dei Rischi & Mitigation Plan", margin + 5, 235);
      doc.text("8. Checklist & Conclusioni", margin + 5, 245);

      addFooter(1);

      // === PAGINA 2: ANALISI FINANZIARIA & GRAFICI ===
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("2. Analisi Finanziaria & Incentivi", margin, 20);

      doc.setFontSize(12);
      doc.text("Intensità dell'Aiuto (Credito d'Imposta)", margin, 35);
      
      const chartY = 45;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin + 10, chartY + 60, margin + 160, chartY + 60); 
      doc.line(margin + 10, chartY + 60, margin + 10, chartY); 

      // Piccole (60%)
      doc.setFillColor(0, 102, 204); 
      doc.rect(margin + 20, chartY + 60 - 50, 30, 50, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text("60%", margin + 28, chartY + 55);
      doc.setTextColor(0, 0, 0);
      doc.text("Piccole", margin + 22, chartY + 65);

      // Medie (50%)
      doc.setFillColor(51, 153, 255);
      doc.rect(margin + 60, chartY + 60 - 41, 30, 41, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text("50%", margin + 68, chartY + 55);
      doc.setTextColor(0, 0, 0);
      doc.text("Medie", margin + 65, chartY + 65);

      // Grandi (40%)
      doc.setFillColor(160, 160, 160);
      doc.rect(margin + 100, chartY + 60 - 33, 30, 33, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text("40%", margin + 108, chartY + 55);
      doc.setTextColor(0, 0, 0);
      doc.text("Grandi", margin + 105, chartY + 65);

      const simY = 130;
      doc.setFontSize(14);
      doc.text("Schema di Cumulabilità", margin, simY);
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const textCumulo = "Il vero vantaggio competitivo risiede nella cumulabilità. Il Credito ZES è cumulabile con gli incentivi Industria 4.0 e Nuova Sabatini, a condizione che l'aiuto complessivo non superi il 100% del costo.";
      doc.text(doc.splitTextToSize(textCumulo, contentWidth), margin, simY + 10);

      doc.setFillColor(240, 248, 255);
      doc.rect(margin, simY + 30, contentWidth, 30, 'F');
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("Formula del Valore:", margin + 10, simY + 42);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text("Credito ZES (es. 40%) + Credito 4.0 (es. 20%) + Sabatini (es. 10%)", margin + 10, simY + 52);
      doc.text("= Risparmio Totale fino al 70% sull'Asset Tecnologico", margin + 10, simY + 58);

      addFooter(2);

      // === PAGINA 3: PROCEDURA TECNICA ===
      doc.addPage();
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text("3. Autorizzazione Unica & Tempistiche", margin, 20);

      const tlY = 40;
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(1);
      doc.line(margin + 20, tlY, margin + 20, tlY + 100); 

      // Step 1
      doc.setFillColor(0, 51, 102);
      doc.circle(margin + 20, tlY, 3, 'F');
      doc.setFontSize(12);
      doc.text("Presentazione Istanza", margin + 30, tlY + 2);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Sportello Unico Digitale ZES.", margin + 30, tlY + 8);

      // Step 2
      doc.circle(margin + 20, tlY + 35, 3, 'F');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Conferenza di Servizi Semplificata", margin + 30, tlY + 37);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Termini perentori dimezzati.", margin + 30, tlY + 43);

      // Step 3
      doc.circle(margin + 20, tlY + 70, 3, 'F');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Rilascio Autorizzazione Unica", margin + 30, tlY + 72);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Titolo unico per costruzione ed esercizio.", margin + 30, tlY + 78);

      // Box Silenzio Assenso
      doc.setFillColor(255, 250, 240);
      doc.rect(margin, 160, contentWidth, 40, 'F');
      doc.setFontSize(12);
      doc.setTextColor(200, 100, 0);
      doc.text("Il Silenzio Assenso", margin + 10, 175);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Decorsi i termini senza pronuncia da parte degli enti coinvolti, l'atto si intende acquisito.", margin + 10, 185);
      doc.text("Questa è la garanzia maggiore per l'investitore immobiliare.", margin + 10, 190);

      addFooter(3);

      // === PAGINA 4: STRATEGIE SETTORIALI (NEW) ===
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("4. Vantaggi Strategici per Asset Class", margin, 20);

      // Logistica
      doc.setFillColor(240, 248, 255);
      doc.rect(margin, 30, contentWidth, 50, 'F');
      doc.setFontSize(13);
      doc.setTextColor(0, 51, 102);
      doc.text("A. Logistica & Industria", margin + 5, 42);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("La Puglia è l'hub naturale per i traffici verso i Balcani e il Mediterraneo orientale.", margin + 5, 52);
      doc.text("• Vantaggio ZES: Agevolazione su capannoni, baie di carico e celle frigorifere.", margin + 5, 58);
      doc.text("• Strategia: Acquisire aree retroportuali (Bari/Taranto) o snodi intermodali.", margin + 5, 64);
      doc.text("• Target: Logistica last-mile e filiera del freddo agroalimentare.", margin + 5, 70);

      // Hospitality
      doc.setFillColor(255, 250, 245);
      doc.rect(margin, 90, contentWidth, 50, 'F');
      doc.setFontSize(13);
      doc.setTextColor(150, 50, 0);
      doc.text("B. Turismo & Hospitality", margin + 5, 102);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Il settore turistico beneficia pienamente del credito d'imposta.", margin + 5, 112);
      doc.text("• Vantaggio ZES: Copre ristrutturazioni pesanti per 'salto di categoria' (es. 3->4 stelle).", margin + 5, 118);
      doc.text("• Strategia: Riqualificazione di masserie storiche o immobili dismessi.", margin + 5, 124);
      doc.text("• Obiettivo: De-stagionalizzazione tramite investimenti in SPA e centri congressi.", margin + 5, 130);

      // Commerciale
      doc.setFillColor(245, 255, 245);
      doc.rect(margin, 150, contentWidth, 50, 'F');
      doc.setFontSize(13);
      doc.setTextColor(0, 100, 50);
      doc.text("C. Direzionale & Uffici", margin + 5, 162);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Sviluppo di Headquarters e poli tecnologici.", margin + 5, 172);
      doc.text("• Vantaggio ZES: Infrastrutturazione digitale e domotica avanzata (BMS).", margin + 5, 178);
      doc.text("• Strategia: Realizzazione di spazi coworking o uffici 'Grade A' in aree ZES.", margin + 5, 184);

      addFooter(4);

      // === PAGINA 5: CASE STUDY LOGISTICA (NEW) ===
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("5. Case Study: Polo Logistico del Freddo", margin, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text("Simulazione di un investimento per una Grande Impresa a Bari Nord.", margin, 30);

      // Financial Table
      const rowH = 10;
      let currY = 50;

      // Headers
      doc.setFillColor(50, 50, 50);
      doc.rect(margin, currY, contentWidth, rowH, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("VOCE INVESTIMENTO", margin + 5, currY + 7);
      doc.text("IMPORTO (€)", margin + 130, currY + 7);
      
      // Rows
      currY += rowH;
      doc.setTextColor(0, 0, 0);
      const rowsLog = [
        { label: "Acquisto Terreno (50% max ammissibile)", val: "500.000" },
        { label: "Opere Murarie & Costruzione Hub", val: "3.500.000" },
        { label: "Impianti Frigoriferi (Ind. 4.0)", val: "2.000.000" },
        { label: "Software WMS & Automazione", val: "500.000" },
      ];

      rowsLog.forEach(row => {
        doc.text(row.label, margin + 5, currY + 7);
        doc.text(row.val, margin + 130, currY + 7);
        doc.line(margin, currY + rowH, pageWidth - margin, currY + rowH);
        currY += rowH;
      });

      // Totals
      doc.setFont("helvetica", "bold");
      doc.text("TOTALE INVESTIMENTO", margin + 5, currY + 7);
      doc.text("6.500.000", margin + 130, currY + 7);
      currY += rowH + 5;

      // Analysis
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("Calcolo Agevolazioni:", margin, currY);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      currY += 10;
      doc.text("• Credito ZES (40% su 6.5M):", margin + 5, currY);
      doc.text("€ 2.600.000", margin + 130, currY);
      currY += 8;
      doc.text("• Credito 4.0 (20% su 2.5M impianti):", margin + 5, currY);
      doc.text("€ 500.000", margin + 130, currY);
      
      currY += 12;
      doc.setDrawColor(0, 150, 0);
      doc.setLineWidth(1);
      doc.rect(margin, currY, contentWidth, 25);
      doc.setFontSize(12);
      doc.setTextColor(0, 100, 0);
      doc.setFont("helvetica", "bold");
      doc.text("RISPARMIO TOTALE GENERATO: € 3.100.000", margin + 10, currY + 10);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Costo Netto dell'Opera: € 3.400.000 (Sconto reale del 48%)", margin + 10, currY + 18);

      // ROI Text
      currY += 35;
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      doc.text("Impatto sul ROI: Il dimezzamento del CapEx riduce il Break-Even Point da 8 a 4.5 anni, rendendo il progetto bancabile e altamente profittevole.", margin, currY, { maxWidth: contentWidth });

      addFooter(5);

      // === PAGINA 6: CASE STUDY TURISMO (NEW) ===
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("6. Case Study: Resort 'Masseria Luxury'", margin, 20);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Simulazione per Piccola Impresa (Agevolazione 60%) in Salento.", margin, 30);

      // Scenario Box
      doc.setFillColor(255, 245, 230);
      doc.rect(margin, 35, contentWidth, 30, 'F');
      doc.setFontSize(10);
      doc.text("Obiettivo: Acquisizione di una masseria storica e conversione in Resort 5 stelle.", margin + 5, 45);
      doc.text("L'intervento punta sulla qualità architettonica e sull'efficienza energetica.", margin + 5, 52);

      // Financials
      currY = 75;
      doc.setFillColor(150, 75, 0); // Brownish
      doc.rect(margin, currY, contentWidth, rowH, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text("VOCE DI SPESA", margin + 5, currY + 7);
      doc.text("IMPORTO (€)", margin + 130, currY + 7);

      currY += rowH;
      doc.setTextColor(0, 0, 0);
      const rowsHos = [
        { label: "Acquisto Immobile (50% max)", val: "800.000" },
        { label: "Ristrutturazione Edilizia & Restauro", val: "1.200.000" },
        { label: "Arredi Fissi & Impianti SPA", val: "600.000" },
        { label: "Efficientamento Energetico (FV)", val: "200.000" },
      ];

      rowsHos.forEach(row => {
        doc.text(row.label, margin + 5, currY + 7);
        doc.text(row.val, margin + 130, currY + 7);
        doc.line(margin, currY + rowH, pageWidth - margin, currY + rowH);
        currY += rowH;
      });

      // Totals
      doc.setFont("helvetica", "bold");
      doc.text("TOTALE INVESTIMENTO", margin + 5, currY + 7);
      doc.text("2.800.000", margin + 130, currY + 7);
      currY += rowH + 5;

      // Result
      doc.setDrawColor(0, 51, 102);
      doc.rect(margin, currY, contentWidth, 25);
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("CREDITO D'IMPOSTA ZES (60%): € 1.680.000", margin + 10, currY + 10);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Esposizione Finanziaria Netta: € 1.120.000", margin + 10, currY + 18);

      currY += 35;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Analisi Cashflow: Il credito è utilizzabile in compensazione F24. Questo significa che l'azienda non pagherà IRES, IRAP, IVA e Contributi dipendenti per i primi 3-4 anni di attività, garantendo una liquidità eccezionale in fase di start-up.", margin, currY, { maxWidth: contentWidth });

      addFooter(6);

      // === PAGINA 7: GESTIONE RISCHI (NEW) ===
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("7. Gestione dei Rischi & Strategie", margin, 20);

      const riskY = 40;
      
      // Risk 1: Recapture
      doc.setTextColor(200, 0, 0); // Red
      doc.setFontSize(12);
      doc.text("1. Vincolo di Mantenimento (Clawback)", margin, riskY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("RISCHIO: Se i beni agevolati vengono ceduti o delocalizzati prima di 5 anni, l'Agenzia delle Entrate revoca il credito con sanzioni.", margin, riskY + 7, {maxWidth: contentWidth});
      doc.setFont("helvetica", "italic");
      doc.text("MITIGAZIONE: Strutturare l'investimento tramite SPV (Special Purpose Vehicle) dedicata. In caso di exit, si cedono le quote della società (M&A) e non l'asset fisico, preservando il credito.", margin, riskY + 20, {maxWidth: contentWidth});

      // Risk 2: Cumulability
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("2. Superamento Massimali di Aiuto", margin, riskY + 40);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("RISCHIO: Cumulare ZES, 4.0 e Sabatini oltre il 100% del costo (o oltre i limiti de minimis se applicabili) porta a rettifiche fiscali.", margin, riskY + 47, {maxWidth: contentWidth});
      doc.setFont("helvetica", "italic");
      doc.text("MITIGAZIONE: Analisi preliminare accurata del 'Gross Grant Equivalent' (GGE) per ogni cespite. Monitoraggio puntuale dei codici tributo in F24.", margin, riskY + 60, {maxWidth: contentWidth});

      // Risk 3: Timing
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("3. Avvio Lavori Prematuro", margin, riskY + 80);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("RISCHIO: Iniziare gli investimenti (ordini vincolanti) prima di aver protocollato la Domanda di Accesso rende le spese inammissibili.", margin, riskY + 87, {maxWidth: contentWidth});
      doc.setFont("helvetica", "italic");
      doc.text("MITIGAZIONE: Rigida cronoprogrammazione. Nessun impegno giuridicamente vincolante prima del click-day o della presentazione istanza.", margin, riskY + 100, {maxWidth: contentWidth});

      addFooter(7);

      // === PAGINA 8: CHECKLIST & CHIUSURA ===
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("8. Checklist Operativa & Contatti", margin, 20);

      doc.setFontSize(12);
      doc.text("Documentazione Indispensabile", margin, 35);

      let listY = 45;
      const checkItems = [
        "Business Plan asseverato (3-5 anni)",
        "Titolo di proprietà o preliminare registrato",
        "Progetto Tecnico Definitivo",
        "Visura Camerale aggiornata",
        "Dichiarazione DNSH (Do No Significant Harm)",
        "Computo Metrico Estimativo",
        "Certificazione Antimafia (per importi > soglia)",
        "Durc Regolare"
      ];

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      checkItems.forEach((item) => {
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, listY - 4, 4, 4); 
        doc.text(item, margin + 10, listY);
        listY += 10;
      });

      // Closing Box
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, 140, contentWidth, 60, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.setFont("helvetica", "bold");
      doc.text("Trasforma le Opportunità in Cantieri", margin + 10, 155);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text("2D Sviluppo Immobiliare è il partner che unisce l'ingegneria finanziaria", margin + 10, 165);
      doc.text("alla concretezza del cantiere edile.", margin + 10, 170);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Contattaci per una valutazione preliminare gratuita:", margin + 10, 185);
      doc.setFont("helvetica", "bold");
      doc.text("info@2dsviluppoimmobiliare.it | 340 803 9322", margin + 10, 192);

      addFooter(8);

      // Salva il PDF
      doc.save("Report_Strategico_ZES_2025_2D.pdf");

      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="py-20 bg-blue-900 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          
          <div className="md:w-1/2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
              Premium Content
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Report Strategico ZES 2025
            </h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Scarica il nostro <strong>Report Tecnico di 8 Pagine</strong>. Include analisi settoriali (Logistica vs Hospitality), case studies reali con proiezioni di cashflow e una sezione dedicata alla gestione dei rischi.
            </p>
            <ul className="space-y-3 text-slate-600 mb-8">
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full"><PieChart size={16} className="text-green-600" /></div>
                <span><strong>2 Case Studies Completi</strong> (Logistica & Turismo)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full"><FileText size={16} className="text-green-600" /></div>
                <span><strong>Analisi Settoriale</strong> & Strategie Mirate</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full"><ShieldAlert size={16} className="text-green-600" /></div>
                <span><strong>Gestione Rischi</strong> (Revoca & Cumulabilità)</span>
              </li>
            </ul>
          </div>

          <div className="md:w-1/2 w-full bg-slate-50 p-8 rounded-xl border border-slate-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Download size={32} />
              </div>
              <h3 className="font-bold text-slate-900 text-xl">Scarica il Report (8 Pagine)</h3>
              <p className="text-slate-500 text-sm">Accesso immediato al documento PDF completo.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Aziendale</label>
                <input 
                  type="email" 
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@azienda.it" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  submitted ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-900/20'
                }`}
              >
                {submitted ? (
                  <>Generazione Report... <Check size={20} /></>
                ) : (
                  <>Ricevi il Report Completo <Download size={20} /></>
                )}
              </button>
              <p className="text-xs text-center text-slate-400 mt-3">
                Rispettiamo la tua privacy. Niente spam.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
