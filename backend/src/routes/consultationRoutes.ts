import { Router } from 'express';
import { 
  getConsultations, 
  createConsultation, 
  deleteConsultation 
} from '../controllers/consultationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(protect, admin, getConsultations).post(createConsultation);
router.delete('/:id', protect, admin, deleteConsultation);

export default router;
