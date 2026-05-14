import { Router } from 'express';
import { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, updateOrderStatus, getMyOrders, getOrders, deleteOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;

