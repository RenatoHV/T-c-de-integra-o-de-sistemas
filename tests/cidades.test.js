const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(20000);

describe('Endpoint /api/v1/cidades/:sigla_uf', () => {
  test('Retorna lista de cidades para UF válida (CE) com limite 5', async () => {
    const res = await request(app).get('/api/v1/cidades/CE?limite=5');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('uf', 'CE');
    expect(res.body).toHaveProperty('cidades');
    expect(Array.isArray(res.body.cidades)).toBe(true);
    expect(res.body.cidades.length).toBeLessThanOrEqual(5);
  });

  test('Retorna 400 para sigla inválida', async () => {
    const res = await request(app).get('/api/v1/cidades/ceara');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('codigo', 'SIGLA_UF_INVALIDA');
  });
});
