const { Op } = require('sequelize');
const { Product, ProductImage, ProductOption, ProductCategory, Category } = require('../models');

// Listar produtos com filtros
const listProducts = async (req, res) => {
  try {
    const { 
      limit = 12, 
      page = 1, 
      fields, 
      match, 
      category_ids, 
      price_range,
      option
    } = req.query;

    const options = {
      attributes: fields ? fields.split(',') : ['id', 'name', 'price', 'price_with_discount'],
      include: [
        {
          model: ProductImage,
          as: 'ProductImages',
          attributes: ['id', 'path']
        },
        {
          model: ProductOption,
          attributes: ['id', 'title', 'values']
        }
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    };

    // Aplicar filtros
    if (match) {
      options.where = {
        [Op.or]: [
          { name: { [Op.like]: `%${match}%` } },
          { description: { [Op.like]: `%${match}%` } }
        ]
      };
    }

    if (price_range) {
      const [min, max] = price_range.split('-').map(Number);
      options.where = {
        ...options.where,
        price: { [Op.between]: [min, max] }
      };
    }

    const { count, rows: products } = await Product.findAndCountAll(options);

    // Processar relacionamento com categorias usando associações
    const productsWithCategories = await Promise.all(
      products.map(async product => {
        const categories = await product.getCategories({
          attributes: ['id'],
          joinTableAttributes: []
        });
        return {
          ...product.get({ plain: true }),
          category_ids: categories.map(c => c.id)
        };
      })
    );

    return res.status(200).json({
      data: productsWithCategories,
      total: count,
      limit: parseInt(limit),
      page: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao listar produtos' });
  }
};

// Obter produto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: ProductImage,
          as: 'ProductImages',
          attributes: ['id', 'path']
        },
        {
          model: ProductOption,
          attributes: ['id', 'title', 'shape', 'radius', 'type', 'values']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Obter categorias relacionadas usando associação direta
    const categories = await product.getCategories({
      attributes: ['id', 'name'],
      joinTableAttributes: []
    });

    const productWithCategories = {
      ...product.get({ plain: true }),
      category_ids: categories.map(c => c.id)
    };

    return res.status(200).json(productWithCategories);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao buscar produto' });
  }
};

// Criar produto
const createProduct = async (req, res) => {
  try {
    const { 
      name,
      slug,
      enabled = false,
      use_in_menu = false,
      stock = 0,
      description,
      price,
      price_with_discount,
      category_ids = [],
      images = [],
      options = []
    } = req.body;

    // Validar campos obrigatórios
    if (!name || !slug || price === undefined || price_with_discount === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Validar tipos
    if (typeof price !== 'number' || typeof price_with_discount !== 'number') {
      return res.status(400).json({ error: 'Preços devem ser números' });
    }

    // Criar produto
    const product = await Product.create({
      name,
      slug,
      enabled,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount
    });

    // Adicionar imagens
    await Promise.all(images.map(image => 
      ProductImage.create({
        product_id: product.id,
        path: image.path
      })
    ));

    // Adicionar opções
    await Promise.all(options.map(option =>
      ProductOption.create({
        product_id: product.id,
        title: option.title,
        shape: option.shape || 'square',
        radius: option.radius || 0,
        type: option.type || 'text',
        values: option.values
      })
    ));

    // Adicionar categorias
    await Promise.all(category_ids.map(category_id =>
      ProductCategory.create({
        product_id: product.id,
        category_id
      })
    ));

    return res.status(201).json({
      id: product.id,
      name: product.name,
      slug: product.slug
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao criar produto' });
  }
};

// Atualizar produto
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const { 
      name,
      slug,
      enabled,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount,
      category_ids = [],
      images = [],
      options = []
    } = req.body;

    // Atualizar dados básicos
    await product.update({
      name,
      slug,
      enabled,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount
    });

    // Gerenciar imagens
    await Promise.all(images.map(async image => {
      if (image.deleted && image.id) {
        await ProductImage.destroy({ where: { id: image.id } });
      } else if (image.id) {
        await ProductImage.update(
          { path: image.path },
          { where: { id: image.id } }
        );
      } else {
        await ProductImage.create({
          product_id: product.id,
          path: image.path
        });
      }
    }));

    // Gerenciar opções
    await Promise.all(options.map(async option => {
      if (option.deleted && option.id) {
        await ProductOption.destroy({ where: { id: option.id } });
      } else if (option.id) {
        await ProductOption.update(
          {
            title: option.title,
            shape: option.shape,
            radius: option.radius,
            type: option.type,
            values: option.values
          },
          { where: { id: option.id } }
        );
      } else {
        await ProductOption.create({
          product_id: product.id,
          title: option.title,
          shape: option.shape || 'square',
          radius: option.radius || 0,
          type: option.type || 'text',
          values: option.values
        });
      }
    }));

    // Gerenciar categorias
    await ProductCategory.destroy({ where: { product_id: product.id } });
    await Promise.all(category_ids.map(category_id =>
      ProductCategory.create({
        product_id: product.id,
        category_id
      })
    ));

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao atualizar produto' });
  }
};

// Deletar produto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await product.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao deletar produto' });
  }
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
