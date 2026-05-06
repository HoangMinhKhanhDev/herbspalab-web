import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes, { getProductCount } from './routes/productRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/stats', (req, res) => {
  res.json({
    totalRevenue: 128500000,
    newOrders: 24,
    totalProducts: getProductCount(),
    activeUsers: 156
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
