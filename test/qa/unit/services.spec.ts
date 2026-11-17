// Testes unitarios dos Services com repositorios e dependencias isolados por mocks (jest.fn).
import * as bcrypt from 'bcrypt';
import { GameService } from 'src/App/classes/Games/Game.Service';
import { UserService } from 'src/App/classes/User/User.Service';
import { AuthService } from 'src/auth/auth.service';

const jogo = { name: 'Zelda', firstReleaseDate: '2017-03-03', genreId: 2 } as any;
const usuario = { username: 'ana', email: 'ana@teste.com', password: 'ab', roleId: 2 } as any;

describe('GameService', () => {
  let repo: Record<string, jest.Mock>;
  let generos: { get: jest.Mock };
  let service: GameService;

  beforeEach(() => {
    repo = { insert: jest.fn(), update: jest.fn(), exists: jest.fn(), get: jest.fn(), delete: jest.fn() };
    generos = { get: jest.fn() };
    service = new GameService(repo as any, generos as any);
  });

  test('CT-J13 insere quando o genero existe', async () => {
    generos.get.mockResolvedValue({ id: 2 });
    repo.insert.mockResolvedValue({ id: 1, ...jogo });
    await expect(service.insert(jogo)).resolves.toMatchObject({ id: 1 });
    expect(repo.insert).toHaveBeenCalledWith(jogo);
  });

  test('CT-J15 nao insere quando o genero nao existe', async () => {
    generos.get.mockRejectedValue(new Error('Genero de jogo não existe ou encontrado'));
    await expect(service.insert({ ...jogo, genreId: 13 })).rejects.toThrow('Genero de jogo');
    expect(repo.insert).not.toHaveBeenCalled();
  });

  test('genero retornado vazio tambem bloqueia a insercao', async () => {
    generos.get.mockResolvedValue(null);
    await expect(service.insert(jogo)).rejects.toThrow('não foi encontrado');
  });

  test('nao atualiza jogo inexistente', async () => {
    repo.exists.mockResolvedValue(false);
    await expect(service.update(jogo, 99)).rejects.toThrow('Jogo não existe');
    expect(repo.update).not.toHaveBeenCalled();
  });

  test('get de jogo inexistente lanca erro', async () => {
    repo.get.mockResolvedValue(null);
    await expect(service.get(99)).rejects.toThrow('Jogo não existe');
  });

  test('atualiza jogo existente com genero valido', async () => {
    repo.exists.mockResolvedValue(true);
    generos.get.mockResolvedValue({ id: 2 });
    repo.update.mockResolvedValue(true);
    await expect(service.update(jogo, 1)).resolves.toBe(true);
  });

  test('consultas repassam parametros ao repositorio', async () => {
    Object.assign(repo, { getAll: jest.fn().mockResolvedValue([]), findByName: jest.fn().mockResolvedValue([]), findByGenre: jest.fn().mockResolvedValue([]) });
    repo.get.mockResolvedValue({ id: 1 });
    await service.get(1, false);
    await service.getAll();
    await service.findByName('zel', false);
    await service.findByGenre(2);
    expect(repo.get).toHaveBeenCalledWith(1, false);
    expect(repo.findByName).toHaveBeenCalledWith('zel', false);
    expect(repo.findByGenre).toHaveBeenCalledWith(2, true);
  });

  test('exclui jogo existente', async () => {
    repo.exists.mockResolvedValue(true);
    repo.delete.mockResolvedValue(true);
    await expect(service.delete(1)).resolves.toBe(true);
  });
});

describe('UserService', () => {
  let repo: Record<string, jest.Mock>;
  let papeis: { verifyExist: jest.Mock };
  let service: UserService;

  beforeEach(() => {
    repo = {
      create: jest.fn(), update: jest.fn(), exists: jest.fn(), verifyRepeatedEmail: jest.fn(),
      changeRole: jest.fn(), get: jest.fn(),
    };
    papeis = { verifyExist: jest.fn() };
    service = new UserService(repo as any, papeis as any);
  });

  test('CT-U01 cria usuario com email novo', async () => {
    repo.verifyRepeatedEmail.mockResolvedValue(false);
    repo.create.mockResolvedValue({ id: 5 });
    await expect(service.create(usuario)).resolves.toEqual({ id: 5 });
  });

  test('CT-U16 recusa email ja cadastrado', async () => {
    repo.verifyRepeatedEmail.mockResolvedValue(true);
    await expect(service.create(usuario)).rejects.toThrow('Email já cadastrado');
    expect(repo.create).not.toHaveBeenCalled();
  });

  test('update verifica email repetido ignorando o proprio usuario', async () => {
    repo.exists.mockResolvedValue(true);
    repo.verifyRepeatedEmail.mockResolvedValue(false);
    repo.update.mockResolvedValue(true);
    await service.update(usuario, 5);
    expect(repo.verifyRepeatedEmail).toHaveBeenCalledWith(usuario, 5);
  });

  test('changeRole com papel inexistente nao altera', async () => {
    repo.exists.mockResolvedValue(true);
    papeis.verifyExist.mockRejectedValue(new Error('Cargo não existe'));
    await expect(service.changeRole(5, 9)).rejects.toThrow('Cargo');
    expect(repo.changeRole).not.toHaveBeenCalled();
  });

  test('nao atualiza nem exclui usuario inexistente', async () => {
    repo.exists.mockResolvedValue(false);
    await expect(service.update(usuario, 9)).rejects.toThrow('Não existe este Usuario');
    await expect(service.delete(9)).rejects.toThrow('Não existe este Usuario');
  });

  test('changeRole valido altera o papel', async () => {
    repo.exists.mockResolvedValue(true);
    papeis.verifyExist.mockResolvedValue(undefined);
    repo.changeRole.mockResolvedValue(true);
    await expect(service.changeRole(5, 1)).resolves.toBe(true);
    expect(repo.changeRole).toHaveBeenCalledWith(5, 1);
  });

  test('verifyLogin com email inexistente lanca erro', async () => {
    repo.verifyLogin = jest.fn().mockResolvedValue(null);
    await expect(service.verifyLogin({ email: 'x@teste.com', password: 'ab' })).rejects.toThrow('User não encontrado');
  });

  test('demais operacoes delegam ao repositorio', async () => {
    Object.assign(repo, {
      getAll: jest.fn().mockResolvedValue([]), delete: jest.fn().mockResolvedValue(true),
      verifyAdm: jest.fn().mockResolvedValue(true), verifyFirstAdmExistence: jest.fn(),
      verifyLogin: jest.fn().mockResolvedValue({ id: 1 }),
    });
    repo.exists.mockResolvedValue(true);
    repo.get.mockResolvedValue({ id: 1 });
    await service.get(1);
    await service.getAll();
    await service.delete(1);
    await service.verifyAdm(1);
    await service.verifyFirstAdmExistence();
    await service.verifyLogin({ email: 'a@teste.com', password: 'ab' });
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(repo.verifyFirstAdmExistence).toHaveBeenCalled();
  });

  test('get de usuario inexistente lanca erro', async () => {
    repo.get.mockResolvedValue(null);
    await expect(service.get(99)).rejects.toThrow('Usuario não encontrado');
  });
});

describe('AuthService (login)', () => {
  const jwt = { sign: jest.fn().mockReturnValue('token-fake') };
  const usuarios = { verifyLogin: jest.fn() };
  const service = new AuthService(jwt as any, usuarios as any);
  const comSenha = (senha: string) => ({ id: 7, email: 'ana@teste.com', password: bcrypt.hashSync(senha, 4) });

  beforeEach(() => jest.clearAllMocks());

  test('CT-S01 login valido gera token com id e email', async () => {
    usuarios.verifyLogin.mockResolvedValue(comSenha('ab'));
    await expect(service.login({ email: 'ana@teste.com', password: 'ab' })).resolves.toEqual({ access_token: 'token-fake' });
    expect(jwt.sign).toHaveBeenCalledWith({ username: 'ana@teste.com', sub: 7 });
  });

  test('senha incorreta e recusada', async () => {
    usuarios.verifyLogin.mockResolvedValue(comSenha('ab'));
    await expect(service.login({ email: 'ana@teste.com', password: 'zz' })).rejects.toThrow();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test.failing('CT-S03 mesma mensagem para email inexistente e senha errada (DEF-08)', async () => {
    usuarios.verifyLogin.mockResolvedValueOnce(comSenha('ab'));
    const senhaErrada = await service.login({ email: 'ana@teste.com', password: 'zz' }).catch((e) => e.message);
    usuarios.verifyLogin.mockRejectedValueOnce(new Error('Erro, User não encontrado'));
    const emailInexistente = await service.login({ email: 'x@teste.com', password: 'zz' }).catch((e) => e.message);
    expect(senhaErrada).toBe(emailInexistente);
  });

  test.failing('CT-S04 AVL senha 73 bytes: o 73o caractere deve contar (DEF-07)', async () => {
    usuarios.verifyLogin.mockResolvedValue(comSenha('a'.repeat(72) + 'X'));
    await expect(service.login({ email: 'ana@teste.com', password: 'a'.repeat(72) + 'Y' })).rejects.toThrow();
  });
});
