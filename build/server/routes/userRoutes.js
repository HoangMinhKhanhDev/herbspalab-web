import { Router } from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile, logoutUser, getUsers, deleteUser, updateUserRole, verifyEmail } from '../controllers/userController.js';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/addressController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validatorMiddleware.js';
const router = Router();
router.post('/login', validateLogin, authUser);
router.post('/register', validateRegister, registerUser);
router.post('/logout', logoutUser);
router.get('/verify-email/:token', verifyEmail);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUserRole);
// Address routes
router.route('/addresses')
    .get(protect, getAddresses)
    .post(protect, addAddress);
router.route('/addresses/:id')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);
export default router;
//# sourceMappingURL=userRoutes.js.map