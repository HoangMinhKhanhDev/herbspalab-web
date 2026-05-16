import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import prisma from './config/prisma.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import attributeRoutes from './routes/attributeRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for admin dashboard stability
  message: 'Quá nhiều yêu cầu từ địa chỉ IP này, vui lòng thử lại sau 15 phút',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);
app.use(helmet({
  contentSecurityPolicy: false, // Disable for easier serving of static assets if needed
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Swagger Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HerbSpaLab API',
      version: '1.0.0',
      description: 'Hệ thống API cho HerbSpaLab Fullstack',
    },
    servers: [{ url: '/api' }],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Simple in-memory cache for de-duplicating traffic logs (prevent double counting in dev/fast nav)
const trafficCache = new Map<string, number>();

app.use((req, res, next) => {
  // Only log non-admin GET requests as traffic/views
  if (req.method === 'GET' && req.path.startsWith('/api') && !req.path.startsWith('/api/admin')) {
    const cacheKey = `${req.ip}-${req.path}`;
    const now = Date.now();
    const lastLog = trafficCache.get(cacheKey) || 0;

    // Only log if it's been more than 5 seconds since the last identical request from this IP
    if (now - lastLog > 5000) {
      trafficCache.set(cacheKey, now);
      prisma.trafficLog.create({
        data: {
          path: req.path,
          ip: req.ip || null,
          referrer: req.get('referrer') || null,
          userAgent: req.get('user-agent') || null,
        }
      } as any).catch(() => {});
      
      // Cleanup cache periodically
      if (trafficCache.size > 1000) trafficCache.clear();
    }
  }
  next();
});

// API Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/attributes', attributeRoutes);
app.use('/api/consultations', consultationRoutes);

// Serving Static Files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Serving React Frontend
// In production (Hostinger): backend is at public_html/server/, frontend is at public_html/
// In development: backend/dist/ → ../../frontend/dist
const frontendPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '..')
  : path.join(__dirname, '../../frontend/dist');
// Cache assets (hashed filenames) for 1 year, but never cache index.html
app.use(express.static(frontendPath, {
  maxAge: '1y',
  etag: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

app.get(/(.*)/, (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`SQLite database is active via Prisma.`);
});
