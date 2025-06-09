const express = require('express');
const router = express.Router();
const { 
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     summary: Lista produtos com filtros
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do produto para filtrar
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/search', listProducts);

/**
 * @swagger
 * /v1/product/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /v1/product:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authenticateToken, createProduct);

/**
 * @swagger
 * /v1/product/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       204:
 *         description: Produto atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', authenticateToken, updateProduct);

/**
 * @swagger
 * /v1/product/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', authenticateToken, deleteProduct);

// Esquemas Swagger
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         stock:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductCreate:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - price
 *         - price_with_discount
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         price_with_discount:
 *           type: number
 *           format: float
 *         stock:
 *           type: integer
 *         enabled:
 *           type: boolean
 *         use_in_menu:
 *           type: boolean
 *         category_ids:
 *           type: array
 *           items:
 *             type: integer
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               shape:
 *                 type: string
 *               radius:
 *                 type: number
 *               type:
 *                 type: string
 *               values:
 *                 type: array
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         stock:
 *           type: integer
 */

module.exports = router;
