process.env.NODE_ENV = 'test';
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server');
const { Product, User, sequelize } = require('../src/models');

let authToken;

describe('Product Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Criar usuário admin para testes com hash válido
    const hashedPassword = await bcrypt.hash('test123', 10);
    await User.create({
      firstname: 'Admin',
      surname: 'Test',
      email: 'admin@test.com',
      password: hashedPassword
    });

    // Obter token JWT
    const loginRes = await request(app)
      .post('/v1/user/token')
      .send({
        email: 'admin@test.com',
        password: 'test123'
      });

    authToken = loginRes.body.token;
    if (!authToken) {
      console.error('Falha ao obter token JWT:', loginRes.body);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /v1/product', () => {
    it('deve criar um novo produto', async () => {
      const response = await request(app)
        .post('/v1/product')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Produto Teste',
          slug: 'produto-teste',
          price: 100.50,
          price_with_discount: 90.50,
          enabled: true,
          use_in_menu: false,
          stock: 10,
          description: 'Descrição teste',
          category_ids: [],
          images: [],
          options: []
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/v1/product')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '', // Nome vazio inválido
          slug: '', // Slug vazio inválido
          price: 'abc', // Preço inválido
          price_with_discount: 'xyz' // Preço com desconto inválido
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /v1/product/search', () => {
    it('deve retornar lista de produtos', async () => {
      const response = await request(app)
        .get('/v1/product/search')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});
