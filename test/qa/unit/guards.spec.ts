// Tabelas de decisao dos Guards de permissao (dependencias mockadas).
import 'reflect-metadata';
import { ForbiddenException } from '@nestjs/common';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { AdmPermissionGuard } from 'src/App/guards/AdmPermission.Guard';
import { UserIdguard } from 'src/App/guards/UserId.Guard';
import { GameController } from 'src/App/classes/Games/Game.Controller';

const contexto = (req: object) => ({ switchToHttp: () => ({ getRequest: () => req }) }) as any;

function jwtFake(tokenValido: boolean, sub = 1) {
  return {
    verify: jest.fn(() => {
      if (!tokenValido) throw new Error('jwt malformed');
      return { sub };
    }),
  };
}

// C1 header enviado | C2 token valido | C3 usuario ADM -> efeito
describe('AdmPermissionGuard - tabela de decisao', () => {
  test.each([
    { regra: 'R1', header: false, tokenValido: false, adm: false, efeito: 'Token não enviado.' },
    { regra: 'R2', header: true, tokenValido: false, adm: false, efeito: 'Token inválido ou expirado.' },
    { regra: 'R3', header: true, tokenValido: true, adm: false, efeito: 'Você não tem permissão para acessar este recurso.' },
    { regra: 'R4', header: true, tokenValido: true, adm: true, efeito: 'permite' },
  ])('$regra header=$header token=$tokenValido adm=$adm -> $efeito', async ({ header, tokenValido, adm, efeito }) => {
    const usuarios = { verifyAdm: jest.fn().mockResolvedValue(adm) };
    const guard = new AdmPermissionGuard(jwtFake(tokenValido) as any, usuarios as any);
    const req = { headers: header ? { authorization: 'Bearer abc' } : {} };

    const resultado = guard.canActivate(contexto(req));
    if (efeito === 'permite') await expect(resultado).resolves.toBe(true);
    else await expect(resultado).rejects.toThrow(new ForbiddenException(efeito));
  });
});

// C1 header | C2 token valido | C3 id numerico | C4 dono do recurso (sub == id) | C5 ADM -> efeito
describe('UserIdguard - tabela de decisao', () => {
  test.each([
    { regra: 'R1', header: false, token: true, id: '1', sub: 1, adm: false, permite: false },
    { regra: 'R2', header: true, token: false, id: '1', sub: 1, adm: false, permite: false },
    { regra: 'R3', header: true, token: true, id: 'abc', sub: 1, adm: false, permite: false },
    { regra: 'R4', header: true, token: true, id: '1', sub: 1, adm: false, permite: true },
    { regra: 'R5', header: true, token: true, id: '2', sub: 1, adm: false, permite: false },
    { regra: 'R6', header: true, token: true, id: '2', sub: 1, adm: true, permite: true },
  ])('$regra header=$header token=$token id=$id sub=$sub adm=$adm -> permite=$permite', async ({ header, token, id, sub, adm, permite }) => {
    const usuarios = { get: jest.fn().mockResolvedValue({ id: Number(id) }), verifyAdm: jest.fn().mockResolvedValue(adm) };
    const guard = new UserIdguard(jwtFake(token, sub) as any, usuarios as any);
    const req = { headers: header ? { authorization: 'Bearer abc' } : {}, params: { id } };

    const resultado = guard.canActivate(contexto(req));
    if (permite) await expect(resultado).resolves.toBe(true);
    else await expect(resultado).rejects.toBeInstanceOf(ForbiddenException);
  });

  test.failing('CT-S07 usuario da rota inexistente deve gerar ForbiddenException, hoje vira HTTP 500 (DEF-10)', async () => {
    const usuarios = { get: jest.fn().mockRejectedValue(new Error('Usuario não encontrado')), verifyAdm: jest.fn() };
    const guard = new UserIdguard(jwtFake(true, 1) as any, usuarios as any);
    const req = { headers: { authorization: 'Bearer abc' }, params: { id: '9999' } };
    await expect(guard.canActivate(contexto(req))).rejects.toBeInstanceOf(ForbiddenException);
  });
});

describe('GameController - guards por rota (caixa-branca)', () => {
  const guardsDa = (rota: keyof GameController) => Reflect.getMetadata(GUARDS_METADATA, GameController.prototype[rota]) ?? [];

  test('POST /Game exige ADM', () => {
    expect(guardsDa('insert')).toContain(AdmPermissionGuard);
  });

  test.failing('CT-S06 DELETE /Game/:id deve exigir ADM (DEF-03)', () => {
    expect(guardsDa('delete')).toContain(AdmPermissionGuard);
  });
});
