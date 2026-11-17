// Metricas de carga com requisicoes simuladas (sem rede).
import { executarCarga, percentil, resumir } from '../carga/carga.lib';

describe('percentil', () => {
  test.each([
    [[10, 20, 30, 40], 50, 20],
    [[10, 20, 30, 40], 95, 40],
    [[7], 95, 7],
    [Array.from({ length: 100 }, (_, i) => i + 1), 95, 95],
  ])('%j p%d = %d', (valores, p, esperado) => {
    expect(percentil(valores, p)).toBe(esperado);
  });

  test.each([[[], 50], [[1], 0], [[1], 101]])('entrada invalida %j p%d', (valores, p) => {
    expect(() => percentil(valores, p)).toThrow();
  });
});

describe('executarCarga', () => {
  test('conta respostas com falha e excecoes como erro', async () => {
    const roteiro = [true, false, true, 'erro', true];
    let i = 0;
    const requisicao = async () => {
      const r = roteiro[i++ % roteiro.length];
      if (r === 'erro') throw new Error('conexao recusada');
      return r as boolean;
    };
    const resumo = await executarCarga(requisicao, 20, 1);
    expect(resumo).toMatchObject({ requisicoes: 20, erros: 8, taxaErroPct: 40 });
  });

  test('executa com concorrencia e ordena p50 <= p95 <= max', async () => {
    const resumo = await executarCarga(async () => true, 50, 10);
    expect(resumo.requisicoes).toBe(50);
    expect(resumo.erros).toBe(0);
    expect(resumo.p50Ms).toBeLessThanOrEqual(resumo.p95Ms);
    expect(resumo.p95Ms).toBeLessThanOrEqual(resumo.maxMs);
  });

  test.each([[0, 1], [1, 0]])('parametros invalidos total=%d concorrencia=%d', async (total, conc) => {
    await expect(executarCarga(async () => true, total, conc)).rejects.toThrow();
  });

  test('resumo vazio nao divide por zero', () => {
    expect(resumir([], 0, 0)).toMatchObject({ requisicoes: 0, taxaErroPct: 0, vazaoRps: 0 });
  });
});
