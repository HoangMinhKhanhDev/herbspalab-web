import { motion } from 'framer-motion';
import { ShoppingBag, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page container section"
    >
      <div className="section-header">
        <h1 className="section-title">Sản phẩm yêu thích</h1>
        <p>{wishlist.length} sản phẩm đã lưu</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <Heart size={64} color="var(--border)" />
          <h2>Danh sách trống</h2>
          <p>Hãy lưu lại những sản phẩm bạn yêu thích để xem sau nhé!</p>
          <Link to="/products" className="btn btn-primary">KHÁM PHÁ CỬA HÀNG</Link>
        </div>
      ) : (
        <div className="products-grid-premium">
          {wishlist.map((p) => (
            <motion.div 
              key={p.id} 
              className="product-card-premium"
              layout
            >
              <button 
                className="remove-wishlist-btn"
                onClick={() => removeFromWishlist(p.id)}
              >
                <X size={16} />
              </button>
              <Link to={`/product/${p.id}`} className="card-link-wrapper">
                <div className="card-img-wrapper">
                  <img src={p.image} alt={p.name} />
                  <span className="card-tag">{p.category}</span>
                </div>
              </Link>
              <div className="card-body">
                <h3>{p.name}</h3>
                <div className="card-footer">
                  <span className="price">{p.price.toLocaleString()}₫</span>
                  <button className="cart-icon-btn"><ShoppingBag size={18} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Wishlist;
