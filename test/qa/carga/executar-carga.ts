// Teste de carga/vazao da API GameHit.
// Uso: npx ts-node test/qa/carga/executar-carga.ts [url] [total] [concorrencias...]
// Ex.: npx ts-node test/qa/carga/executar-carga.ts http://localhost:3000 500 10 50
import { writeFileSync } from 'fs';
import { executarCarga } from './carga.lib';

const [url = 'http://localhost:3000', totalArg = '500', ...concArgs] = process.argv.slice(2);
const total = Number(totalArg);
const concorrencias = concArgs.length ? concArgs.map(Number) : [10, 50];
const adm = {
  email: process.env.GAMEHIT_ADM_EMAIL ?? 'adm@email.com',
  password: process.env.GAMEHIT_ADM_SENHA ?? '123456',
};

async function ok(resp: Response): Promise<boolean> {
  const corpo: any = await resp.json();
  return resp.status < 300 && Number(corpo.status ?? 200) < 300;
}

async function main() {
  const login: any = await (await fetch(`${url}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(adm),
  })).json();
  const auth = { Authorization: `Bearer ${login.dataUnit.access_token}` };

  const cenarios: Record<string, () => Promise<boolean>> = {
    'GET /Game (listar jogos)': async () => ok(await fetch(`${url}/Game`, { headers: auth })),
    'GET /Genre (listar generos)': async () => ok(await fetch(`${url}/Genre`, { headers: auth })),
    'POST /auth/login (bcrypt)': async () => ok(await fetch(`${url}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(adm),
    })),
  };

  const resultados = [];
  for (const [cenario, requisicao] of Object.entries(cenarios)) {
    for (const concorrencia of concorrencias) {
      const linha = { cenario, concorrencia, ...(await executarCarga(requisicao, total, concorrencia)) };
      resultados.push(linha);
      console.log(JSON.stringify(linha));
    }
  }
  writeFileSync('resultado-carga.json', JSON.stringify(resultados, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
