import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';

const API_URL = 'http://localhost:5000/api';

interface ProductDetailData {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader-container"><div className="loader" role="status"></div></div>;
  if (!product) return <div className="container section"><h1>Không tìm thấy sản phẩm</h1></div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page container section"
    >
      <SEO 
        title={`${product.name} | HerbSpa Lab`} 
        description={product.description?.substring(0, 160)} 
      />

      <Link to="/products" className="btn-link" style={{ color: 'var(--primary)', marginBottom: '40px' }} aria-label="Quay lại danh sách sản phẩm">
        <ArrowLeft size={20} /> Quay lại cửa hàng
      </Link>

      <div className="product-detail-layout" aria-labelledby="product-name">
        <div className="product-detail-image">
          <LazyImage 
            src={product.image} 
            alt={`Hình ảnh sản phẩm ${product.name}`} 
          />
        </div>

        <div className="product-detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 id="product-name" className="detail-title">{product.name}</h1>
          
          <div className="detail-rating" aria-label={`Đánh giá ${product.rating} trên 5 sao`}>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.round(product.rating) ? "var(--secondary)" : "none"} color="var(--secondary)" />
              ))}
            </div>
            <span>({product.rating} đánh giá)</span>
          </div>

          <div className="detail-price">{product.price?.toLocaleString()}₫</div>
          
          <p className="detail-desc">{product.description}</p>

          <div className="detail-actions">
            <div className="quantity-selector" role="group" aria-label="Chọn số lượng">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Giảm số lượng">-</button>
              <span aria-live="polite">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Tăng số lượng">+</button>
            </div>
            <button className="btn btn-primary" onClick={() => addToCart(product, quantity)} aria-label="Thêm vào giỏ hàng">
              <ShoppingBag size={18} /> Thêm vào giỏ hàng
            </button>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <ShieldCheck size={20} aria-hidden="true" />
              <span>Cam kết 100% thảo mộc tự nhiên</span>
            </div>
            <div className="meta-item">
              <Truck size={20} aria-hidden="true" />
              <span>Giao hàng nhanh toàn quốc (2-4 ngày)</span>
            </div>
            <div className="meta-item">
              <RefreshCw size={20} aria-hidden="true" />
              <span>Đổi trả trong vòng 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
