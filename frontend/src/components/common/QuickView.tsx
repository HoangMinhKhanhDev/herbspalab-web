import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Product {
  name: string;
  price: string;
  img: string;
  tag?: string;
  description?: string;
}

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

const QuickView = ({ product, onClose }: QuickViewProps) => {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <div className="quickview-overlay" onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="quickview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={onClose}><X size={24} /></button>
            
            <div className="quickview-content">
              <div className="quickview-image">
                <img src={product.img} alt={product.name} />
                {product.tag && <span className="product-tag">{product.tag}</span>}
              </div>
              
              <div className="quickview-info">
                <div className="qv-rating">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#bca37f" stroke="none" />)}
                  <span>(48 nhận xét)</span>
                </div>
                <h2>{product.name}</h2>
                <div className="qv-price">{product.price}</div>
                <p className="qv-desc">
                  Sản phẩm được chiết xuất từ tinh hoa thảo mộc tự nhiên, giúp nuôi dưỡng làn da từ sâu bên trong, mang lại vẻ đẹp rạng rỡ và thuần khiết. Công thức độc quyền từ HerbSpa Lab.
                </p>
                
                <div className="qv-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      addToCart({ id: Math.random(), name: product.name, price: parseInt(product.price.replace(/\D/g, '')), image: product.img, quantity: 1 });
                      onClose();
                    }}
                  >
                    THÊM VÀO GIỎ HÀNG <ShoppingBag size={18} />
                  </button>
                  <button className="btn-wishlist-qv">
                    <Heart size={20} />
                  </button>
                </div>
                
                <div className="qv-meta">
                  <span>Mã: HSB-2026</span>
                  <span>Danh mục: Skincare, Serum</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickView;
