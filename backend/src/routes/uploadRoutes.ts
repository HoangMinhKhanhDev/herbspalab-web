import { Router } from 'express';
import { upload, processImage } from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// @desc    Upload multiple files
router.post('/', protect, admin, upload.array('files', 10), processImage, (req: any, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Vui lòng chọn file để tải lên');
  }

  const urls = req.files.map((file: any) => `/uploads/${file.filename}`);
  res.status(201).json({
    message: 'Tải lên thành công',
    urls: urls,
  });
});

// @desc    Upload single file
router.post('/single', protect, admin, upload.single('file'), processImage, (req: any, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Vui lòng chọn file để tải lên');
  }

  res.status(201).json({
    message: 'Tải lên thành công',
    url: `/uploads/${req.file.filename}`,
  });
});

export default router;
