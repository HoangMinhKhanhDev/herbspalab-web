import { Router } from 'express';
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile,
  logoutUser,
  getUsers,
  deleteUser,
  updateUserRole
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validatorMiddleware.js';

const router = Router();

router.post('/login', validateLogin, authUser);
router.post('/register', validateRegister, registerUser);
router.post('/logout', logoutUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUserRole);

export default router;
