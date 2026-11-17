// Casos de teste derivados de Classes de Equivalencia (CE), Analise de Valor-Limite (AVL)
// e Tabela de Decisao (TD). Usados pelos testes unitarios (DTO) e e2e (HTTP).
// "defeito" preenchido = caso que hoje falha por defeito conhecido (roda com test.failing).

export const MIB_2 = 2 * 1024 * 1024;

export interface CasoDto {
  id: string;
  tecnica: string;
  dados: Record<string, string | number>;
  valido: boolean;
  defeito?: string;
}

export interface CasoHttp {
  id: string;
  tecnica: string;
  dados: Record<string, any>;
  esperado: number;
  defeito?: string;
}

const usuario = { username: 'jogador', email: 'jogador@teste.com', password: 'ab' };
const jogo = { name: 'Zelda', firstReleaseDate: '2017-03-03', genreId: '2' };

// ---------- Cadastro de Usuario: validacao do UserDto ----------
export const CASOS_USUARIO_DTO: CasoDto[] = [
  { id: 'CT-U01', tecnica: 'CE validas / AVL senha=2', dados: usuario, valido: true },
  { id: 'CT-U02', tecnica: 'CE nome vazio', dados: { ...usuario, username: '' }, valido: false },
  { id: 'CT-U03', tecnica: 'AVL nome=255', dados: { ...usuario, username: 'a'.repeat(255) }, valido: true },
  { id: 'CT-U04', tecnica: 'AVL nome=256', dados: { ...usuario, username: 'a'.repeat(256) }, valido: false, defeito: 'DEF-05' },
  { id: 'CT-U05', tecnica: 'CE email sem @', dados: { ...usuario, email: 'jogador.com' }, valido: false },
  { id: 'CT-U06', tecnica: 'CE email vazio', dados: { ...usuario, email: '' }, valido: false },
  { id: 'CT-U07', tecnica: 'CE senha vazia', dados: { ...usuario, password: '' }, valido: false },
  { id: 'CT-U08', tecnica: 'AVL senha=1', dados: { ...usuario, password: 'a' }, valido: false },
  { id: 'CT-U09', tecnica: 'AVL senha=3', dados: { ...usuario, password: 'abc' }, valido: true },
  { id: 'CT-U10', tecnica: 'CE papel informado', dados: { ...usuario, roleId: '1' }, valido: false, defeito: 'DEF-02' },
  { id: 'CT-U11', tecnica: 'CE campo extra', dados: { ...usuario, foo: 'x' }, valido: false },
];

// ---------- Cadastro de Usuario: imagem e unicidade (somente via HTTP) ----------
export const CASOS_USUARIO_HTTP: CasoHttp[] = [
  { id: 'CT-U12', tecnica: 'AVL imagem=2MiB-1', dados: { tamanho: MIB_2 - 1, tipo: 'image/png' }, esperado: 201 },
  { id: 'CT-U13', tecnica: 'AVL imagem=2MiB', dados: { tamanho: MIB_2, tipo: 'image/png' }, esperado: 201, defeito: 'DEF-04' },
  { id: 'CT-U14', tecnica: 'AVL imagem=2MiB+1', dados: { tamanho: MIB_2 + 1, tipo: 'image/png' }, esperado: 413 },
  { id: 'CT-U15', tecnica: 'CE imagem GIF', dados: { tamanho: 1024, tipo: 'image/gif' }, esperado: 400 },
];

// ---------- Cadastro de Jogo: validacao do GameDto ----------
export const CASOS_JOGO_DTO: CasoDto[] = [
  { id: 'CT-J01', tecnica: 'CE validas', dados: jogo, valido: true },
  { id: 'CT-J02', tecnica: 'CE nome vazio', dados: { ...jogo, name: '' }, valido: false },
  { id: 'CT-J03', tecnica: 'AVL nome=255', dados: { ...jogo, name: 'a'.repeat(255) }, valido: true },
  { id: 'CT-J04', tecnica: 'AVL nome=256', dados: { ...jogo, name: 'a'.repeat(256) }, valido: false, defeito: 'DEF-05' },
  { id: 'CT-J05', tecnica: 'CE data DD/MM/AAAA', dados: { ...jogo, firstReleaseDate: '03/03/2017' }, valido: false },
  { id: 'CT-J06', tecnica: 'CE data vazia', dados: { ...jogo, firstReleaseDate: '' }, valido: false },
  { id: 'CT-J07', tecnica: 'CE data inexistente', dados: { ...jogo, firstReleaseDate: '2017-02-30' }, valido: false, defeito: 'DEF-06' },
  { id: 'CT-J08', tecnica: 'AVL data >10 caracteres', dados: { ...jogo, firstReleaseDate: '2017-03-03T10:00:00Z' }, valido: false, defeito: 'DEF-06' },
  { id: 'CT-J09', tecnica: 'CE data so com ano', dados: { ...jogo, firstReleaseDate: '2017' }, valido: false, defeito: 'DEF-06' },
  { id: 'CT-J10', tecnica: 'CE genero nao numerico', dados: { ...jogo, genreId: 'abc' }, valido: false },
  { id: 'CT-J11', tecnica: 'CE genero decimal', dados: { ...jogo, genreId: '1.5' }, valido: false },
];

// ---------- Cadastro de Jogo: genero existente (12 generos no init.sql) ----------
export const CASOS_JOGO_GENERO: CasoHttp[] = [
  { id: 'CT-J12', tecnica: 'AVL genero=0', dados: { genreId: 0 }, esperado: 404, defeito: 'DEF-01' },
  { id: 'CT-J13', tecnica: 'AVL genero=1', dados: { genreId: 1 }, esperado: 201 },
  { id: 'CT-J14', tecnica: 'AVL genero=12', dados: { genreId: 12 }, esperado: 201 },
  { id: 'CT-J15', tecnica: 'AVL genero=13', dados: { genreId: 13 }, esperado: 404, defeito: 'DEF-01' },
];

// ---------- Tabela de Decisao do POST /Game ----------
// C1 token valido | C2 usuario ADM | C3 dados validos | C4 genero existe  ->  efeito (HTTP)
export interface RegraDecisao {
  id: string;
  token: boolean;
  adm?: boolean;
  dadosValidos?: boolean;
  generoExiste?: boolean;
  esperado: number;
  defeito?: string;
}

export const TABELA_DECISAO_JOGO: RegraDecisao[] = [
  { id: 'TD-R1', token: false, esperado: 401 },
  { id: 'TD-R2', token: true, adm: false, esperado: 403 },
  { id: 'TD-R3', token: true, adm: true, dadosValidos: false, esperado: 400 },
  { id: 'TD-R4', token: true, adm: true, dadosValidos: true, generoExiste: false, esperado: 404, defeito: 'DEF-01' },
  { id: 'TD-R5', token: true, adm: true, dadosValidos: true, generoExiste: true, esperado: 201 },
];

export const comDefeito = <T extends { defeito?: string }>(casos: T[]) => casos.filter((c) => c.defeito);
export const semDefeito = <T extends { defeito?: string }>(casos: T[]) => casos.filter((c) => !c.defeito);
