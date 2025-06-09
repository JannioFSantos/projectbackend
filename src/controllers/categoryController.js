'use strict';
const { Category } = require('../models');

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

// Listar categorias
const listCategories = async (req, res) => {
  try {
    const { limit = 12, page = 1, fields, use_in_menu } = req.query;
    const options = {
      attributes: fields ? fields.split(',') : ['id', 'name', 'slug', 'use_in_menu'],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    };

    if (use_in_menu) {
      options.where = { use_in_menu: use_in_menu === 'true' };
    }

    const { count, rows } = await Category.findAndCountAll(options);

    return res.status(200).json({
      data: rows,
      total: count,
      limit: parseInt(limit),
      page: parseInt(page)
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
  }
};

// Obter categoria por ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      attributes: ['id', 'name', 'slug', 'use_in_menu']
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
  }
};

// Criar categoria
const createCategory = async (req, res) => {
  try {
    const { name, slug, use_in_menu = false } = req.body;
    
    // Validações básicas
    if (!name || !slug) {
      return res.status(400).json({ 
        errors: [{ 
          field: !name ? 'name' : 'slug', 
          message: 'Campo obrigatório' 
        }] 
      });
    }

    const category = await Category.create({ name, slug, use_in_menu });
    
    return res.status(201).json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      use_in_menu: category.use_in_menu
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || 
        error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        errors: formatSequelizeErrors(error) 
      });
    }
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
  }
};

// Atualizar categoria
const updateCategory = async (req, res) => {
  try {
    const { name, slug, use_in_menu } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await category.update({ name, slug, use_in_menu });
    return res.status(204).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        errors: formatSequelizeErrors(error) 
      });
    }
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
  }
};

// Deletar categoria
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await category.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua solicitação' 
    });
  }
};

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
