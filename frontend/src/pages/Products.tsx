import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';

const API_URL = 'http://localhost:5000/api';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [activeSkinType, setActiveSkinType] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState(2000000);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categories = ['Tất cả', 'Làm sạch', 'Dưỡng ẩm', 'Trị liệu', 'Chống nắng'];
  const skinTypes = ['Tất cả', 'Da dầu', 'Da khô', 'Da nhạy cảm', 'Da hỗn hợp'];

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const productList = Array.isArray(data) ? data : (data.data || []);
        setProducts(productList);
        setFilteredProducts(productList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => {
      const matchCategory = activeCategory === 'Tất cả' || p.category === activeCategory;
      const matchPrice = p.price <= priceRange;
      return matchCategory && matchPrice;
    });
    setFilteredProducts(filtered);
  }, [activeCategory, priceRange, products]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page container section"
    >
      <SEO 
        title="Bộ Sưu Tập Thảo Mộc Cao Cấp | Cửa Hàng HerbSpa Lab" 
        description="Khám phá các dòng sản phẩm chăm sóc da từ thiên nhiên: Serum, Kem dưỡng, Mặt nạ thảo mộc. Phù hợp cho mọi tình trạng da." 
      />
      <div className="section-header">
        <h1 className="section-title">Tinh Hoa Thảo Mộc</h1>
      </div>

      <div className="products-layout">
        <aside className="filter-sidebar" aria-label="Bộ lọc sản phẩm">
          <div className="filter-group">
            <h4>DANH MỤC</h4>
            <div className="filter-list" role="group" aria-label="Lọc theo danh mục">
              {categories.map(c => (
                <button 
                  key={c} 
                  className={`filter-btn ${activeCategory === c ? 'active' : ''}`}
                  onClick={() => setActiveCategory(c)}
                  aria-pressed={activeCategory === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>LOẠI DA</h4>
            <div className="filter-list" role="group" aria-label="Lọc theo loại da">
              {skinTypes.map(s => (
                <button 
                  key={s} 
                  className={`filter-btn ${activeSkinType === s ? 'active' : ''}`}
                  onClick={() => setActiveSkinType(s)}
                  aria-pressed={activeSkinType === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="price-range"><h4>GIÁ (DƯỚI {priceRange.toLocaleString()}₫)</h4></label>
            <input 
              id="price-range"
              type="range" 
              min="100000" 
              max="3000000" 
              step="50000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
          </div>
        </aside>

        <main className="products-main" aria-label="Danh sách sản phẩm">
          <div className="products-grid-premium">
            {filteredProducts.map((p, i) => (
              <motion.div 
                key={p.id} 
                className="product-card-premium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 4) * 0.1 }}
              >
                <div className="card-link-wrapper">
                  <div className="card-img-wrapper">
                    <Link to={`/product/${p.id}`} aria-label={`Xem chi tiết ${p.name}`}>
                      <LazyImage src={p.image} alt={p.name} className="product-image" />
                    </Link>
                    <span className="card-tag">{p.category}</span>
                    <button 
                      className="wishlist-toggle-btn"
                      aria-label={isInWishlist(p.id) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                      onClick={(e) => {
                        e.preventDefault();
                        isInWishlist(p.id) ? removeFromWishlist(p.id) : addToWishlist(p);
                      }}
                    >
                      <Heart 
                        size={20} 
                        fill={isInWishlist(p.id) ? "var(--secondary)" : "none"} 
                        stroke={isInWishlist(p.id) ? "var(--secondary)" : "white"} 
                      />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-rating" aria-label={`Đánh giá ${p.rating} trên 5 sao`}>
                    {"★".repeat(Math.round(Number(p.rating)))}
                    <span className="stock-info" aria-label={`Còn lại ${p.stock} sản phẩm`}>({p.stock} còn lại)</span>
                  </div>
                  <h3>{p.name}</h3>
                  <div className="card-footer">
                    <span className="price">{p.price.toLocaleString()}₫</span>
                    <button className="cart-icon-btn" aria-label="Thêm vào giỏ hàng"><ShoppingBag size={18} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="no-results">
              <p>Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.</p>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default Products;
