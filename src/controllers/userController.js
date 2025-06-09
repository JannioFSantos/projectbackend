'use strict';
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Helper para formatar erros do Sequelize
const formatSequelizeErrors = (error) => {
  if (error.errors) {
    return error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
  }
  return [{ message: error.message }];
};

// Criar novo usuário
const createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        errors: [{ field: 'password', message: 'As senhas não coincidem' }] 
      });
    }

    const user = await User.create({
      firstname,
      surname,
      email,
      password // O hash é feito automaticamente pelo modelo
    });

    return res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || 
        error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        errors: formatSequelizeErrors(error) 
      });
    }
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
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
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
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
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        errors: formatSequelizeErrors(error) 
      });
    }
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
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
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
  }
};

// Gerar token JWT
const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ 
        error: 'Email ou senha incorretos' 
      });
    }

    const isValidPassword = await user.validPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ 
        error: 'Email ou senha incorretos' 
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'secret_key_fallback',
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
      }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  generateToken
};
