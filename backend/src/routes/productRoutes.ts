import { Router } from 'express';

const router = Router();

// Mock Data for 300 products
const generateProducts = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Sản phẩm Thảo mộc Cao cấp #${i + 1}`,
    description: 'Chiết xuất từ các loại thảo dược thiên nhiên, giúp nuôi dưỡng và tái tạo làn da từ sâu bên trong.',
    price: Math.floor(Math.random() * (2500000 - 350000 + 1)) + 350000,
    category: ['Serum', 'Kem dưỡng', 'Làm sạch', 'Mặt nạ'][Math.floor(Math.random() * 4)],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    stock: Math.floor(Math.random() * 100),
    rating: (Math.random() * (5 - 4) + 4).toFixed(1)
  }));
};

const products = generateProducts(300);

router.get('/', (req, res) => {
  const { category, page = 1, limit = 12 } = req.query;
  let filteredProducts = products;

  if (category && category !== 'Tất cả') {
    filteredProducts = products.filter(p => p.category === category);
  }

  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    total: filteredProducts.length,
    page: Number(page),
    limit: Number(limit),
    data: paginatedProducts
  });
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  res.json(product);
});

export const getProductCount = () => products.length;
export default router;
