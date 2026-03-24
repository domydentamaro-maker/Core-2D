
export const generatePDF = async (userEmail: string) => {
  // Dynamic import: Loads the heavy library ONLY when the user clicks download
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Colors
  const brandDark = "#003366";
  const brandAccent = "#06b6d4"; // Cyan
  const textGray = "#4b5563";

  // Helper: Draw Footer on every page
  const addFooter = (pageNumber: number) => {
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Report Generato per: ${userEmail} - 2D Sviluppo Immobiliare`, margin, height - 10);
    doc.text(`Pagina ${pageNumber}`, width - margin, height - 10, { align: "right" });
  };

  // --- PAGE 1: COVER ---
  doc.setFillColor(brandDark);
  doc.rect(0, 0, width, height, 'F');

  // Abstract graphic lines
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, height/2, width - margin, height/2);
  doc.line(margin, height/2 + 2, width - margin, height/2 + 2);

  // Title Block
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.text("REPORT", margin, 80);
  doc.text("MERCATO 2025", margin, 95);
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(brandAccent);
  doc.text("ANALISI STRATEGICA & VALORIZZAZIONE SUOLI", margin, 110);

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text("BARI E PROVINCIA", margin, 120);

  doc.text("Documento Riservato", margin, height - 30);
  doc.text("www.2dsviluppoimmobiliare.it", margin, height - 25);

  // --- PAGE 2: EXECUTIVE SUMMARY ---
  doc.addPage();
  doc.setTextColor(brandDark);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin, 30);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(brandAccent);
  doc.line(margin, 35, 80, 35);

  doc.setFontSize(11);
  doc.setTextColor(textGray);
  doc.setFont("helvetica", "normal");
  const summaryText = `
Il mercato immobiliare barese nel biennio 2024-2025 conferma un trend di netta separazione tra il centro consolidato e le aree di espansione peri-urbana.

Mentre il residenziale classico mostra una stabilità dei prezzi (+1.2%), il settore dei SUOLI EDIFICABILI e delle AREE DA RIGENERARE registra performance a doppia cifra (+12% medio).

I fattori chiave analizzati in questo documento:
1. Pressione demografica verso quartieri come Carbonara, Ceglie e Loseto.
2. Saturazione degli spazi in centro (Murat, Madonnella).
3. Nuovi incentivi regionali per la rigenerazione sostenibile.

Il "Metodo F.I.L.O." di 2D Sviluppo Immobiliare ha identificato 3 macro-aree dove il ROI (Return on Investment) per lo sviluppo di nuovi complessi residenziali supera il 18% annuo.
  `;
  doc.text(summaryText, margin, 50, { maxWidth: width - (margin * 2), lineHeightFactor: 1.5 });

  // Box Summary
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, 150, width - (margin * 2), 40, 3, 3, 'F');
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandDark);
  doc.text("L'Opportunità Chiave", margin + 5, 160);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("I terreni agricoli o dismessi in zona 'Ceglie del Campo' con indici di edificabilità", margin + 5, 170);
  doc.text("superiori allo 0.5 mc/mq sono attualmente l'asset class più sottovalutata del mercato.", margin + 5, 175);

  addFooter(2);

  // --- PAGE 3: DATI OMI E ANALISI ---
  doc.addPage();
  doc.setFontSize(22);
  doc.setTextColor(brandDark);
  doc.text("Valori OMI & Trend 2025", margin, 30);
  doc.line(margin, 35, 80, 35);

  // Table Headers
  let yPos = 50;
  doc.setFillColor(brandDark);
  doc.rect(margin, yPos, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ZONA / QUARTIERE", margin + 5, yPos + 7);
  doc.text("PREZZO MEDIO (€/mq)", margin + 70, yPos + 7);
  doc.text("VARIAZIONE ANNUA", margin + 120, yPos + 7);

  // Table Data
  const tableData = [
    { zone: "Poggiofranco (Nuovo)", price: "3.200 - 3.800", change: "+ 5.5%" },
    { zone: "Carbonara (Espansione)", price: "2.100 - 2.500", change: "+ 11.2%" },
    { zone: "Ceglie del Campo", price: "1.900 - 2.300", change: "+ 14.8%" },
    { zone: "San Paolo (Riqualificato)", price: "1.600 - 1.900", change: "+ 3.5%" },
    { zone: "Santo Spirito / Palese", price: "2.400 - 2.800", change: "+ 4.0%" },
  ];

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  yPos += 10;
  tableData.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 245);
    doc.rect(margin, yPos, 170, 10, 'F');
    doc.text(row.zone, margin + 5, yPos + 7);
    doc.text(row.price, margin + 70, yPos + 7);
    
    // Highlight high growth
    if(row.change.includes("1")) doc.setTextColor(0, 150, 0); // Green for >10%
    doc.text(row.change, margin + 120, yPos + 7);
    doc.setTextColor(0, 0, 0);
    
    yPos += 10;
  });

  // Visual Chart (Bar Chart simulated with rectangles)
  yPos += 20;
  doc.setFontSize(14);
  doc.setTextColor(brandDark);
  doc.text("Potenziale di Crescita 2026 (Forecast)", margin, yPos);
  
  yPos += 15;
  const chartData = [
    { label: "Ceglie", val: 80 },
    { label: "Carbonara", val: 65 },
    { label: "Poggiofranco", val: 30 },
    { label: "Centro", val: 15 }
  ];

  chartData.forEach((item, i) => {
    const barY = yPos + (i * 15);
    doc.setFontSize(10);
    doc.text(item.label, margin, barY + 5);
    
    // Draw Bar
    doc.setFillColor(brandAccent);
    doc.rect(margin + 30, barY, item.val, 8, 'F');
    
    // Label Value
    doc.setTextColor(textGray);
    doc.text(`+${(item.val / 5).toFixed(1)}%`, margin + 35 + item.val, barY + 6);
  });

  addFooter(3);

  // --- PAGE 4: STRATEGIA 2D ---
  doc.addPage();
  doc.setFontSize(22);
  doc.setTextColor(brandDark);
  doc.text("Strategia di Valorizzazione", margin, 30);
  doc.line(margin, 35, 80, 35);

  doc.setFontSize(12);
  doc.setTextColor(textGray);
  const strategyText = `
La nostra metodologia di intervento si basa su 4 pilastri fondamentali per massimizzare il valore del suolo prima ancora della costruzione:

1. DUE DILIGENCE LEGALE
Verifica preventiva di tutti i vincoli (PAI, PPTR, Archeologici) per azzerare il rischio di blocco cantiere.

2. CONCEPT ARCHITETTONICO "MARKET-FIT"
Non progettiamo ciò che piace a noi, ma ciò che il mercato chiede. Attualmente: trilocali con ampi terrazzi e classe A4 NZEB.

3. PIANO ECONOMICO & BUSINESS PLAN
Generiamo un piano finanziario dettagliato che presentiamo agli istituti di credito per ottenere le migliori condizioni di leva finanziaria.

4. PRE-COMMERCIALIZZAZIONE
Grazie ai render fotorealistici e al Virtual Tour, puntiamo a vendere il 40% delle unità "su carta" prima dell'inizio lavori.
  `;
  doc.text(strategyText, margin, 50, { maxWidth: width - (margin * 2), lineHeightFactor: 1.5 });

  addFooter(4);

  // --- PAGE 5: CONTATTI ---
  doc.addPage();
  doc.setFillColor(brandDark);
  doc.rect(0, 0, width, height, 'F'); // Dark Background

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.text("TRASFORMIAMO", width/2, 80, { align: "center" });
  doc.text("IL FUTURO", width/2, 95, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(brandAccent);
  doc.text("Prenota una consulenza strategica sul tuo terreno", width/2, 110, { align: "center" });

  doc.setDrawColor(255, 255, 255);
  doc.line(width/2 - 20, 120, width/2 + 20, 120);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("Domenico Dentamaro", width/2, 140, { align: "center" });
  doc.setFontSize(11);
  doc.text("Founder & Developer", width/2, 146, { align: "center" });

  doc.text("Via Domenico Di Venere", width/2, 160, { align: "center" });
  doc.text("Ceglie del Campo - Bari", width/2, 166, { align: "center" });
  doc.text("+39 340 803 9322", width/2, 172, { align: "center" });
  doc.text("info@2dsviluppoimmobiliare.it", width/2, 178, { align: "center" });

  addFooter(5);

  doc.save("Dossier_Strategico_2025_2D.pdf");
};
