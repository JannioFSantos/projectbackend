const { User, sequelize } = require('../src/models');
const bcrypt = require('bcrypt');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Validações', () => {
    it('deve lançar erro se email for inválido', async () => {
      await expect(User.create({
        firstname: 'Teste',
        surname: 'Usuario',
        email: 'email-invalido',
        password: 'senha123'
      })).rejects.toThrow();
    });

    it('deve lançar erro se senha for muito curta', async () => {
      await expect(User.create({
        firstname: 'Teste',
        surname: 'Usuario',
        email: 'teste@email.com',
        password: '123'
      })).rejects.toThrow();
    });
  });

  describe('Hooks', () => {
    it('deve fazer hash da senha antes de criar', async () => {
      const user = await User.create({
        firstname: 'Teste',
        surname: 'Usuario',
        email: 'teste@email.com',
        password: 'senha123'
      });

      expect(user.password).not.toBe('senha123');
      expect(await bcrypt.compare('senha123', user.password)).toBe(true);
    });

    it('deve fazer hash da senha quando atualizada', async () => {
      const user = await User.create({
        firstname: 'Teste',
        surname: 'Usuario',
        email: 'teste2@email.com',
        password: 'senha123'
      });

      const oldHash = user.password;
      user.password = 'novaSenha123';
      await user.save();

      expect(user.password).not.toBe(oldHash);
      expect(await bcrypt.compare('novaSenha123', user.password)).toBe(true);
    });
  });

  describe('Métodos', () => {
    it('deve validar senha corretamente', async () => {
      const user = await User.create({
        firstname: 'Teste',
        surname: 'Usuario',
        email: 'teste3@email.com',
        password: 'senha123'
      });

      expect(await user.validPassword('senha123')).toBe(true);
      expect(await user.validPassword('senhaErrada')).toBe(false);
    });
  });
});
