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

// Rotas públicas
router.get('/search', listProducts);
router.get('/:id', getProductById);

// Rotas protegidas
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
