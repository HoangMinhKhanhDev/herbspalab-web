import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import LazyImage from './LazyImage';

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  badge?: string | null;
  category?: { name: string } | null;
  shortDescription?: string | null;
  description?: string;
}

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

const QuickView = ({ product, onClose }: QuickViewProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const imgUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400x500';

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imgUrl,
      category: product.category?.name,
    }, 1);
    onClose();
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imgUrl,
        category: product.category?.name,
      });
    }
  };

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
                <LazyImage src={imgUrl} alt={product.name} />
                {product.badge && <span className="product-tag">{product.badge}</span>}
              </div>

              <div className="quickview-info">
                {product.category && (
                  <span style={{ color: 'var(--secondary)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
                    {product.category.name}
                  </span>
                )}

                <div className="qv-rating">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#bca37f" stroke="none" />)}
                  <span>(đánh giá)</span>
                </div>

                <h2>{product.name}</h2>
                <div className="qv-price">{product.price.toLocaleString()}₫</div>

                <p className="qv-desc">
                  {product.shortDescription || product.description?.substring(0, 160) || 'Sản phẩm được chiết xuất từ tinh hoa thảo mộc tự nhiên, giúp nuôi dưỡng làn da từ sâu bên trong.'}
                </p>

                <div className="qv-actions">
                  <button className="btn btn-primary" onClick={handleAddToCart}>
                    THÊM VÀO GIỎ HÀNG <ShoppingBag size={18} />
                  </button>
                  <button
                    className="btn-wishlist-qv"
                    onClick={handleWishlist}
                    title={isInWishlist(product.id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? 'var(--secondary)' : 'none'} color="var(--secondary)" />
                  </button>
                </div>

                <div className="qv-meta" style={{ marginTop: '1rem' }}>
                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    style={{ color: 'var(--secondary)', textDecoration: 'underline', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ExternalLink size={14} /> Xem chi tiết sản phẩm
                  </Link>
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
