import { Router } from 'express';
import { getStats, getTrafficReport, getCustomerReport } from '../controllers/adminController.js';
import { 
  getAdminBlogs, 
  getBlogById, 
  getAdminComments, 
  updateCommentStatus, 
  deleteComment 
} from '../controllers/blogController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
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

// Reports
router.get('/reports/traffic', protect, admin, getTrafficReport);
router.get('/reports/customers', protect, admin, getCustomerReport);

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

// Blogs (Admin)
router.get('/blogs', protect, admin, getAdminBlogs);
router.get('/blogs/:id', protect, admin, getBlogById);

// Comments (Admin)
router.get('/comments', protect, admin, getAdminComments);
router.put('/comments/:id', protect, admin, updateCommentStatus);
router.delete('/comments/:id', protect, admin, deleteComment);

// Settings
router.route('/settings')
  .get(protect, admin, getSettings)
  .put(protect, admin, updateSettings);

export default router;
