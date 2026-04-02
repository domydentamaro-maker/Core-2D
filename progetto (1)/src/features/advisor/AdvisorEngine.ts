export function generateAdvisorReply(input: string): string {
  const txt = input.toLowerCase();
  if (txt.includes('yield') || txt.includes('rendimento')) {
    return 'Per massimizzare rendimento a Bari, valuta quartieri con yield >6% e liquidita media-alta con ticket entro mercato.';
  }
  if (txt.includes('prima casa')) {
    return 'Per prima casa, pesa qualita urbana e tempi di rivendita: preferisci microzone con servizi e domanda stabile.';
  }
  return 'Posso aiutarti su cashflow, rischio zona, score F.I.L.O. e timing di acquisto.';
}
