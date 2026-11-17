// Caixa-preta sobre os DTOs reais: mesma validacao do ValidationPipe global (main.ts).
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserDto } from 'src/App/classes/User/dto/User.dto';
import { GameDto } from 'src/App/classes/Games/dto/GameDto';
import { CASOS_JOGO_DTO, CASOS_USUARIO_DTO, CasoDto, comDefeito, semDefeito } from '../casos';

async function ehValido(classe: new () => object, dados: object): Promise<boolean> {
  const erros = await validate(plainToInstance(classe, dados), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  return erros.length === 0;
}

describe('UserDto - Cadastro de Usuario (CE + AVL)', () => {
  test.each(semDefeito(CASOS_USUARIO_DTO))('$id $tecnica', async ({ dados, valido }: CasoDto) => {
    expect(await ehValido(UserDto, dados)).toBe(valido);
  });

  test.failing.each(comDefeito(CASOS_USUARIO_DTO))('$id $tecnica ($defeito)', async ({ dados, valido }: CasoDto) => {
    expect(await ehValido(UserDto, dados)).toBe(valido);
  });
});

describe('GameDto - Cadastro de Jogo (CE + AVL)', () => {
  test.each(semDefeito(CASOS_JOGO_DTO))('$id $tecnica', async ({ dados, valido }: CasoDto) => {
    expect(await ehValido(GameDto, dados)).toBe(valido);
  });

  test.failing.each(comDefeito(CASOS_JOGO_DTO))('$id $tecnica ($defeito)', async ({ dados, valido }: CasoDto) => {
    expect(await ehValido(GameDto, dados)).toBe(valido);
  });

  test('genreId em texto e convertido para numero', () => {
    const dto = plainToInstance(GameDto, { name: 'Zelda', firstReleaseDate: '2017-03-03', genreId: '7' });
    expect(dto.genreId).toBe(7);
  });
});
