const request = require('supertest');
const app = require('../server');
const { Category } = require('../src/models');

describe('Category Controller', () => {
  beforeAll(async () => {
    await Category.sync({ force: true });
  });

  afterEach(async () => {
    await Category.destroy({ where: {} });
  });

  describe('POST /v1/category', () => {
    it('deve criar uma nova categoria', async () => {
      const response = await request(app)
        .post('/v1/category')
        .send({
          name: 'Eletrônicos',
          slug: 'eletronicos',
          use_in_menu: true
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Eletrônicos');
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/v1/category')
        .send({
          name: '', // Nome vazio
          slug: 'eletronicos'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /v1/category/search', () => {
    it('deve listar categorias', async () => {
      await Category.create({
        name: 'Roupas',
        slug: 'roupas',
        use_in_menu: true
      });

      const response = await request(app)
        .get('/v1/category/search');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Roupas');
    });
  });

  describe('GET /v1/category/:id', () => {
    it('deve retornar uma categoria por ID', async () => {
      const category = await Category.create({
        name: 'Calçados',
        slug: 'calcados',
        use_in_menu: false
      });

      const response = await request(app)
        .get(`/v1/category/${category.id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Calçados');
    });

    it('deve retornar erro 404 para categoria não encontrada', async () => {
      const response = await request(app)
        .get('/v1/category/9999');

      expect(response.status).toBe(404);
    });
  });
});
