const express = require('express');
const router = express.Router();
const { 
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/search', listCategories);
router.get('/:id', getCategoryById);

// Rotas protegidas
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

module.exports = router;
