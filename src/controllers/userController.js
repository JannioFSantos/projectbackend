const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Criar novo usuário
const createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao criar usuário' });
  }
};

// Obter usuário por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'firstname', 'surname', 'email']
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao buscar usuário' });
  }
};

// Atualizar usuário
const updateUser = async (req, res) => {
  try {
    const { firstname, surname, email } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.update({ firstname, surname, email });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Deletar usuário
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao deletar usuário' });
  }
};

// Gerar token JWT
const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao gerar token' });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  generateToken
};
