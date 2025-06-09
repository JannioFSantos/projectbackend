process.env.NODE_ENV = 'test';
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server');
const { Product, User, sequelize } = require('../src/models');

let authToken;

describe('Product Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Criar usuário para testes
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await User.create({
      firstname: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: hashedPassword
    });

    // Obter token JWT
    const loginRes = await request(app)
      .post('/v1/user/token')
      .send({
        email: 'test@example.com',
        password: testPassword
      });

    authToken = loginRes.body.token;
    if (!authToken) {
      console.error('Falha ao obter token JWT:', loginRes.body);
      console.log('Response status:', loginRes.status);
      console.log('Response headers:', loginRes.headers);
      console.log('Request body sent:', {
        email: 'test@example.com',
        password: 'test123'
      });
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

  describe('GET /v1/product/:id', () => {
    let productId;

    beforeAll(async () => {
      // Criar produto para teste
      const product = await Product.create({
        name: 'Produto para Get',
        slug: 'produto-get',
        price: 50.00,
        price_with_discount: 45.00,
        enabled: true
      });
      productId = product.id;
    });

    it('deve retornar um produto pelo ID', async () => {
      const response = await request(app)
        .get(`/v1/product/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(productId);
    });

    it('deve retornar 404 para produto não encontrado', async () => {
      const response = await request(app)
        .get('/v1/product/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /v1/product/:id', () => {
    let productId;

    beforeAll(async () => {
      // Criar produto para teste
      const product = await Product.create({
        name: 'Produto para Update',
        slug: 'produto-update',
        price: 100.00,
        price_with_discount: 90.00,
        enabled: true
      });
      productId = product.id;
    });

    it('deve atualizar um produto', async () => {
      const response = await request(app)
        .put(`/v1/product/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Produto Atualizado',
          price: 120.00,
          price_with_discount: 110.00
        });

      expect(response.status).toBe(204);
    });

    it('deve retornar 404 para produto não encontrado', async () => {
      const response = await request(app)
        .put('/v1/product/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Produto Inexistente'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /v1/product/:id', () => {
    let productId;

    beforeEach(async () => {
      // Criar produto para teste
      const product = await Product.create({
        name: 'Produto para Delete',
        slug: 'produto-delete',
        price: 30.00,
        price_with_discount: 25.00,
        enabled: true
      });
      productId = product.id;
    });

    it('deve deletar um produto', async () => {
      const response = await request(app)
        .delete(`/v1/product/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('deve retornar 404 para produto não encontrado', async () => {
      const response = await request(app)
        .delete('/v1/product/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
