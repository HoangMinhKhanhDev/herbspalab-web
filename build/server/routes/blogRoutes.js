import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, addComment } from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(getBlogs).post(protect, admin, createBlog);
router.route('/:id/comments').post(addComment);
router.route('/:slug').get(getBlogBySlug);
router.route('/:id').put(protect, admin, updateBlog).delete(protect, admin, deleteBlog);
export default router;
//# sourceMappingURL=blogRoutes.js.map