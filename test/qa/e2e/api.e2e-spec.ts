// Testes e2e via HTTP contra a API rodando. So executam com GAMEHIT_URL definido.
// Ex.: GAMEHIT_URL=http://localhost:3000 npx jest -c test/qa/jest-qa.json e2e
import * as request from 'supertest';
import {
  CASOS_JOGO_DTO, CASOS_JOGO_GENERO, CASOS_USUARIO_DTO, CASOS_USUARIO_HTTP, CasoDto, CasoHttp,
  RegraDecisao, TABELA_DECISAO_JOGO, comDefeito, semDefeito,
} from '../casos';

const URL = process.env.GAMEHIT_URL;
const ADM = { email: process.env.GAMEHIT_ADM_EMAIL ?? 'adm@email.com', password: process.env.GAMEHIT_ADM_SENHA ?? '123456' };
const descrever = URL ? describe : describe.skip;
jest.setTimeout(30000);

const api = () => request(URL);
const emailNovo = () => `qa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@teste.com`;

// A API devolve erro de negocio com HTTP 2xx e "status": 500 no corpo (DEF-01): considera o pior dos dois.
const statusEfetivo = (res: request.Response) => Math.max(res.status, Number(res.body?.status ?? 0));
const esperarStatus = (res: request.Response, esperado: number) =>
  expect([res.status, statusEfetivo(res)]).toEqual([esperado, esperado]);

function multipart(req: request.Test, campos: Record<string, any>) {
  for (const [k, v] of Object.entries(campos)) if (v !== undefined) req.field(k, String(v));
  return req;
}

async function login(credenciais: { email: string; password: string }) {
  const res = await api().post('/auth/login').send(credenciais);
  return res.body?.dataUnit?.access_token as string | undefined;
}

async function criarUsuarioComum() {
  const email = emailNovo();
  const res = await multipart(api().post('/User'), { username: 'comum', email, password: 'senha123' });
  return { id: res.body.dataUnit.id as number, token: await login({ email, password: 'senha123' }) };
}

descrever('E2E Cadastro de Usuario (POST /User)', () => {
  const enviar = (dados: Record<string, any>) =>
    multipart(api().post('/User'), { ...dados, email: dados.email === 'jogador@teste.com' ? emailNovo() : dados.email });

  test.each(semDefeito(CASOS_USUARIO_DTO))('$id $tecnica', async ({ dados, valido }: CasoDto) => {
    esperarStatus(await enviar(dados), valido ? 201 : 400);
  });

  test.failing.each(comDefeito(CASOS_USUARIO_DTO))('$id $tecnica ($defeito)', async ({ dados, valido }: CasoDto) => {
    esperarStatus(await enviar(dados), valido ? 201 : 400);
  });

  const comImagem = ({ tamanho, tipo }: Record<string, any>) =>
    multipart(api().post('/User'), { username: 'jogador', email: emailNovo(), password: 'ab' })
      .attach('userImage', Buffer.alloc(tamanho), { filename: `img.${tipo.split('/')[1]}`, contentType: tipo });

  test.each(semDefeito(CASOS_USUARIO_HTTP))('$id $tecnica', async ({ dados, esperado }: CasoHttp) => {
    esperarStatus(await comImagem(dados), esperado);
  });

  test.failing.each(comDefeito(CASOS_USUARIO_HTTP))('$id $tecnica ($defeito)', async ({ dados, esperado }: CasoHttp) => {
    esperarStatus(await comImagem(dados), esperado);
  });

  test.failing('CT-U16 email duplicado retorna 409 (DEF-01)', async () => {
    const email = emailNovo();
    await multipart(api().post('/User'), { username: 'a', email, password: 'ab' });
    esperarStatus(await multipart(api().post('/User'), { username: 'b', email, password: 'ab' }), 409);
  });
});

descrever('E2E Cadastro de Jogo (POST /Game como ADM)', () => {
  let tokenAdm: string;
  beforeAll(async () => {
    tokenAdm = await login(ADM);
  });
  const enviar = (dados: Record<string, any>, token = tokenAdm) =>
    multipart(api().post('/Game').set('Authorization', `Bearer ${token}`), dados);
  const base = { name: 'Zelda', firstReleaseDate: '2017-03-03' };

  test.each(semDefeito(CASOS_JOGO_DTO))('$id $tecnica', async ({ dados, valido }: CasoDto) => {
    esperarStatus(await enviar(dados), valido ? 201 : 400);
  });

  test.failing.each(comDefeito(CASOS_JOGO_DTO))('$id $tecnica ($defeito)', async ({ dados, valido }: CasoDto) => {
    esperarStatus(await enviar(dados), valido ? 201 : 400);
  });

  test.each(semDefeito(CASOS_JOGO_GENERO))('$id $tecnica', async ({ dados, esperado }: CasoHttp) => {
    esperarStatus(await enviar({ ...base, ...dados }), esperado);
  });

  test.failing.each(comDefeito(CASOS_JOGO_GENERO))('$id $tecnica ($defeito)', async ({ dados, esperado }: CasoHttp) => {
    esperarStatus(await enviar({ ...base, ...dados }), esperado);
  });
});

descrever('E2E Tabela de Decisao do POST /Game', () => {
  let tokenAdm: string;
  let tokenComum: string;
  beforeAll(async () => {
    tokenAdm = await login(ADM);
    tokenComum = (await criarUsuarioComum()).token;
  });

  const executar = async ({ token, adm, dadosValidos, generoExiste, esperado }: RegraDecisao) => {
    const req = api().post('/Game');
    if (token) req.set('Authorization', `Bearer ${adm ? tokenAdm : tokenComum}`);
    const res = await multipart(req, {
      name: dadosValidos === false ? '' : 'Zelda',
      firstReleaseDate: '2017-03-03',
      genreId: generoExiste === false ? 99 : 2,
    });
    esperarStatus(res, esperado);
  };

  test.each(semDefeito(TABELA_DECISAO_JOGO))('$id -> HTTP $esperado', executar);
  test.failing.each(comDefeito(TABELA_DECISAO_JOGO))('$id -> HTTP $esperado ($defeito)', executar);
});

descrever('E2E Seguranca e permissoes', () => {
  let tokenAdm: string;
  beforeAll(async () => {
    tokenAdm = await login(ADM);
  });

  test('CT-S01 login valido retorna token', async () => {
    expect(await login(ADM)).toBeTruthy();
  });

  test.failing('CT-S02 login invalido retorna 401 (DEF-01)', async () => {
    esperarStatus(await api().post('/auth/login').send({ email: emailNovo(), password: 'x' }), 401);
  });

  test.failing('CT-S05 usuario comum nao se promove a ADM pelo PUT (DEF-02)', async () => {
    const { id, token } = await criarUsuarioComum();
    await multipart(api().put(`/User/${id}`).set('Authorization', `Bearer ${token}`),
      { username: 'comum', email: emailNovo(), password: 'senha123', roleId: 1 });
    const res = await api().get(`/User/${id}?BuscaImagem=false`).set('Authorization', `Bearer ${token}`);
    expect(res.body.dataUnit.roleId).toBe(2);
  });

  test.failing('CT-S06 usuario comum nao exclui jogo (DEF-03)', async () => {
    const jogo = await multipart(api().post('/Game').set('Authorization', `Bearer ${tokenAdm}`),
      { name: 'Protegido', firstReleaseDate: '2020-01-01', genreId: 1 });
    const { token } = await criarUsuarioComum();
    expect((await api().delete(`/Game/${jogo.body.dataUnit.id}`).set('Authorization', `Bearer ${token}`)).status).toBe(403);
  });

  test.failing('CT-S07 excluir usuario inexistente retorna 404, hoje 500 (DEF-10)', async () => {
    expect((await api().delete('/User/999999').set('Authorization', `Bearer ${tokenAdm}`)).status).toBe(404);
  });
});
