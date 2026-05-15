import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ hỗ trợ định dạng ảnh (JPG, PNG, WebP) và video (MP4)!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: fileFilter,
});

// Optimization middleware for images
export const processImage = async (req: any, res: any, next: any) => {
  if (!req.file && (!req.files || req.files.length === 0)) return next();

  const processFile = async (file: any) => {
    if (!file.mimetype.startsWith('image/')) return;

    const originalPath = file.path;
    const outputFilename = file.filename.split('.')[0] + '.webp';
    const outputPath = path.join(uploadDir, outputFilename);

    try {
      await sharp(originalPath)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Remove original file if it's different from the new one
      if (originalPath !== outputPath) {
        fs.unlinkSync(originalPath);
      }

      // Update file info for the request
      file.path = outputPath;
      file.filename = outputFilename;
      file.mimetype = 'image/webp';
    } catch (err) {
      console.error('Sharp error:', err);
    }
  };

  if (req.file) {
    await processFile(req.file);
  } else if (req.files) {
    await Promise.all(req.files.map(processFile));
  }

  next();
};
