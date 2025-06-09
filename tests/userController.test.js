process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');
const { User, sequelize } = require('../src/models');

let server;

describe('User Controller', () => {
  beforeAll(async () => {
    // Sincronizar modelos e limpar dados
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Fechar conexão com o banco de dados
    await sequelize.close();
    if (server) await server.close();
  });

  describe('POST /v1/user', () => {
    it('deve criar um novo usuário', async () => {
      const response = await request(app)
        .post('/v1/user')
        .send({
          firstname: 'Teste',
          surname: 'Usuario',
          email: 'teste@email.com',
          password: 'senha123',
          confirmPassword: 'senha123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('deve retornar erro 400 se senhas não coincidirem', async () => {
      const response = await request(app)
        .post('/v1/user')
        .send({
          firstname: 'Teste',
          surname: 'Usuario',
          email: 'teste2@email.com',
          password: 'senha123',
          confirmPassword: 'senha456'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /v1/user/token', () => {
    it('deve gerar token JWT para login válido', async () => {
      const response = await request(app)
        .post('/v1/user/token')
        .send({
          email: 'teste@email.com',
          password: 'senha123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('deve retornar erro 400 para credenciais inválidas', async () => {
      const response = await request(app)
        .post('/v1/user/token')
        .send({
          email: 'teste@email.com',
          password: 'senhaerrada'
        });

      expect(response.status).toBe(400);
    });
  });
});
