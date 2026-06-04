const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(20000);

describe('Endpoint /api/v1/clima/:nome_cidade', () => {
  test('Retorna clima para cidade válida (Fortaleza)', async () => {
    const res = await request(app).get('/api/v1/clima/Fortaleza');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nome');
    expect(res.body).toHaveProperty('estado');
    expect(res.body).toHaveProperty('clima');
    expect(res.body.clima).toHaveProperty('unidades');
  });

  test('Retorna 404 para cidade inexistente', async () => {
    const res = await request(app).get('/api/v1/clima/CidadeInexistenteXYZ');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('erro', true);
    expect(res.body).toHaveProperty('codigo', 'CIDADE_NAO_ENCONTRADA');
  });

  test('Retorna 400 para nome inválido (1 caractere)', async () => {
    const res = await request(app).get('/api/v1/clima/X');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('codigo', 'NOME_INVALIDO');
  });
});
