import { Router } from 'express';
import { 
  getAttributes, 
  createAttribute, 
  addAttributeValue, 
  deleteAttribute, 
  deleteAttributeValue 
} from '../controllers/attributeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getAttributes).post(protect, admin, createAttribute);
router.post('/values', protect, admin, addAttributeValue);
router.delete('/:id', protect, admin, deleteAttribute);
router.delete('/values/:id', protect, admin, deleteAttributeValue);

export default router;
