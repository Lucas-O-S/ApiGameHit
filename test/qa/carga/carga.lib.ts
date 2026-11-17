// Executor de carga concorrente e metricas: tempo de resposta, vazao e taxa de erro.

export function percentil(valores: number[], p: number): number {
  if (valores.length === 0) throw new Error('lista vazia');
  if (p <= 0 || p > 100) throw new Error('p deve estar em (0, 100]');
  const ordenados = [...valores].sort((a, b) => a - b);
  return ordenados[Math.ceil((p / 100) * ordenados.length) - 1];
}

export interface Resumo {
  requisicoes: number;
  erros: number;
  taxaErroPct: number;
  vazaoRps: number;
  mediaMs: number;
  p50Ms: number;
  p95Ms: number;
  maxMs: number;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export function resumir(temposMs: number[], erros: number, duracaoS: number): Resumo {
  const total = temposMs.length;
  return {
    requisicoes: total,
    erros,
    taxaErroPct: total ? r1((100 * erros) / total) : 0,
    vazaoRps: duracaoS > 0 ? r1(total / duracaoS) : 0,
    mediaMs: total ? r1(temposMs.reduce((s, t) => s + t, 0) / total) : 0,
    p50Ms: total ? r1(percentil(temposMs, 50)) : 0,
    p95Ms: total ? r1(percentil(temposMs, 95)) : 0,
    maxMs: total ? r1(Math.max(...temposMs)) : 0,
  };
}

/** Dispara `total` chamadas com `concorrencia` workers. A chamada devolve true em sucesso; excecao conta como erro. */
export async function executarCarga(requisicao: () => Promise<boolean>, total: number, concorrencia: number): Promise<Resumo> {
  if (total <= 0 || concorrencia <= 0) throw new Error('total e concorrencia devem ser positivos');
  const tempos: number[] = [];
  let erros = 0;
  let disparadas = 0;

  const worker = async () => {
    while (disparadas < total) {
      disparadas++;
      const t0 = performance.now();
      try {
        if (!(await requisicao())) erros++;
      } catch {
        erros++;
      }
      tempos.push(performance.now() - t0);
    }
  };

  const inicio = performance.now();
  await Promise.all(Array.from({ length: concorrencia }, worker));
  return resumir(tempos, erros, (performance.now() - inicio) / 1000);
}
