import { Router } from 'express';
import { getStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { 
  getAttributes, 
  createAttribute, 
  addAttributeValue, 
  deleteAttribute, 
  deleteAttributeValue 
} from '../controllers/attributeController.js';

const router = Router();

// Stats
router.get('/stats', protect, admin, getStats);

// Categories
router.route('/categories')
  .get(protect, admin, getCategories)
  .post(protect, admin, createCategory);
router.route('/categories/:id')
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

// Attributes
router.route('/attributes')
  .get(protect, admin, getAttributes)
  .post(protect, admin, createAttribute);
router.route('/attributes/:id')
  .delete(protect, admin, deleteAttribute);
router.post('/attributes/values', protect, admin, addAttributeValue);
router.delete('/attributes/values/:id', protect, admin, deleteAttributeValue);

export default router;
