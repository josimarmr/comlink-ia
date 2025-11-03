/**
 * Extrai dados de gráfico da resposta da IA
 */
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

/**
 * Remove o bloco de gráfico da mensagem
 */
export function removerGrafico(mensagem) {
  if (!mensagem) return '';
  return mensagem.replace(/---GRAFICO---[\s\S]*?---FIM---/g, '').trim();
}
```

5. Role até o fim da página
6. Clique em **"Commit new file"** ou **"Commit changes"**

---

## 🎯 RESULTADO ESPERADO:

Depois do commit, você terá:
```
src/
  utils/
    graficos.js  ← NOVO ARQUIVO ✅