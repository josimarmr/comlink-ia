export function extrairGrafico(mensagem) {
  if (!mensagem) return null;
  
  const regex = /---GRAFICO---\s*TIPO:\s*(\w+)\s*TITULO:\s*([^\n]+)\s*LABELS:\s*([^\n]+)\s*VALORES:\s*([^\n]+)\s*CORES:\s*([^\n]+)\s*---FIM---/s;
  
  const match = mensagem.match(regex);
  
  if (!match) {
    return null;
  }
  
  return {
    tipo: match[1].trim(),
    titulo: match[2].trim(),
    labels: match[3].split(',').map(l => l.trim()),
    valores: match[4].split(',').map(v => parseFloat(v.trim())),
    cores: match[5].split(',').map(c => c.trim())
  };
}

export function removerGrafico(mensagem) {
  if (!mensagem) return '';
  return mensagem.replace(/---GRAFICO---[\s\S]*?---FIM---/g, '').trim();
}
