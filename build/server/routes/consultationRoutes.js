import { Router } from 'express';
import { getConsultations, createConsultation, deleteConsultation, updateConsultationStatus } from '../controllers/consultationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = Router();
router.route('/')
    .get(protect, admin, getConsultations)
    .post(createConsultation);
router.route('/:id')
    .delete(protect, admin, deleteConsultation);
router.route('/:id/status')
    .put(protect, admin, updateConsultationStatus);
export default router;
//# sourceMappingURL=consultationRoutes.js.map