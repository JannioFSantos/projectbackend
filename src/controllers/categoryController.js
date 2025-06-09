const { Category } = require('../models');

// Listar categorias (com paginação)
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
    console.error(error);
    return res.status(400).json({ error: 'Erro ao listar categorias' });
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
    console.error(error);
    return res.status(400).json({ error: 'Erro ao buscar categoria' });
  }
};

// Criar categoria
const createCategory = async (req, res) => {
  try {
    const { name, slug, use_in_menu = false } = req.body;
    const category = await Category.create({ name, slug, use_in_menu });
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao criar categoria' });
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
    console.error(error);
    return res.status(400).json({ error: 'Erro ao atualizar categoria' });
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
    console.error(error);
    return res.status(400).json({ error: 'Erro ao deletar categoria' });
  }
};

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
