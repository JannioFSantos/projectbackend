process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

// Garantir que JWT_SECRET esteja definido
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_secret_123';
}

// Mock do bcrypt para testes - sempre retorna true na comparação
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('mocked_hash'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('mocked_salt')
}));

// Limpar e sincronizar banco de dados antes dos testes
beforeAll(async () => {
  const { sequelize } = require('../src/models');
  await sequelize.sync({ force: true });
});

// Configurar timeout maior para testes
jest.setTimeout(10000);
