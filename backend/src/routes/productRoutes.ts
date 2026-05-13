import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, exportProductsCSV, importProductsCSV } from '../controllers/productController.js';
import { createProductReview, getProductReviews } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.route('/:id/reviews').get(getProductReviews).post(protect, createProductReview);

// Admin Routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

router.get('/export/csv', protect, admin, exportProductsCSV);
router.post('/import/csv', protect, admin, upload.single('file'), importProductsCSV);

export default router;
