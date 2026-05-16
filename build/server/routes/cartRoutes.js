import { Router } from 'express';
import { getCart, updateCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.route('/')
    .get(protect, getCart)
    .post(protect, updateCart)
    .delete(protect, clearCart);
export default router;
//# sourceMappingURL=cartRoutes.js.map