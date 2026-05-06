import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_URL = 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
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

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (!product) return <div className="container section"><h1>Không tìm thấy sản phẩm</h1></div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page container section"
    >
      <Link to="/products" className="btn-link" style={{ color: 'var(--primary)', marginBottom: '40px' }}>
        <ArrowLeft size={20} /> Quay lại cửa hàng
      </Link>

      <div className="product-detail-layout">
        <div className="product-detail-image">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={product.image} 
            alt={product.name} 
          />
        </div>

        <div className="product-detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          
          <div className="detail-rating">
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
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="btn btn-primary" onClick={() => addToCart(product, quantity)}>
              <ShoppingBag size={18} /> Thêm vào giỏ hàng
            </button>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <ShieldCheck size={20} />
              <span>Cam kết 100% thảo mộc tự nhiên</span>
            </div>
            <div className="meta-item">
              <Truck size={20} />
              <span>Giao hàng nhanh toàn quốc (2-4 ngày)</span>
            </div>
            <div className="meta-item">
              <RefreshCw size={20} />
              <span>Đổi trả trong vòng 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
