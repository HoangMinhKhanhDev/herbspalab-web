import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
      const matchSkin = activeSkinType === 'Tất cả' || (p.description && p.description.includes(activeSkinType));
      return matchCategory && matchPrice && matchSkin;
    });
    setFilteredProducts(filtered);
  }, [activeCategory, priceRange, products, activeSkinType]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="products-page-wrapper"
    >
      <SEO 
        title="Bộ Sưu Tập Thảo Mộc Cao Cấp | HerbSpa Lab" 
        description="Trải nghiệm các dòng sản phẩm chăm sóc da thảo dược thượng hạng. Giải pháp cá nhân hóa cho làn da của bạn." 
      />

      {/* Hero Header */}
      <section className="products-hero">
        <div className="container">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="hero-content-center"
          >
            <span className="hero-tag">THE COLLECTION</span>
            <h1 className="hero-display-sm">Tinh Hoa <span className="italic-text">Thảo Mộc</span></h1>
            <p>Khám phá bí mật đằng sau làn da rạng rỡ từ những nguyên liệu quý hiếm nhất của tự nhiên.</p>
          </motion.div>
        </div>
      </section>

      <div className="container products-layout-new">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <span>{filteredProducts.length} sản phẩm</span>
          <button className="btn-filter-mobile" onClick={() => setIsFilterOpen(true)}>
            <SlidersHorizontal size={18} />
            Lọc & Sắp xếp
          </button>
        </div>

        {/* Filter Sidebar - Glassmorphism */}
        <aside className={`filter-sidebar-premium ${isFilterOpen ? 'open' : ''}`}>
          <div className="sidebar-inner">
            <div className="sidebar-header">
              <h3>BỘ LỌC</h3>
              <button className="close-filter" onClick={() => setIsFilterOpen(false)}><X size={20} /></button>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">DANH MỤC</h4>
              <div className="filter-options">
                {categories.map(c => (
                  <button 
                    key={c} 
                    className={`pill-filter ${activeCategory === c ? 'active' : ''}`}
                    onClick={() => setActiveCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">LOẠI DA</h4>
              <div className="filter-options">
                {skinTypes.map(s => (
                  <button 
                    key={s} 
                    className={`pill-filter ${activeSkinType === s ? 'active' : ''}`}
                    onClick={() => setActiveSkinType(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">MỨC GIÁ</h4>
              <div className="price-slider-container">
                <input 
                  type="range" 
                  min="100000" 
                  max="3000000" 
                  step="50000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="luxury-slider"
                />
                <div className="price-labels">
                  <span>Dưới {priceRange.toLocaleString()}₫</span>
                </div>
              </div>
            </div>

            <button className="btn-apply-filters" onClick={() => setIsFilterOpen(false)}>
              XEM {filteredProducts.length} SẢN PHẨM
            </button>
          </div>
        </aside>

        {/* Products Main */}
        <main className="products-main-new">
          <div className="results-header">
            <span className="results-count">Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm</span>
            <div className="sort-dropdown">
              <span>Sắp xếp: <strong>Mặc định</strong></span>
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="product-catalog-grid">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, i) => (
                <motion.div 
                  layout
                  key={p.id} 
                  className="product-card-premium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="card-img-wrapper">
                    <Link to={`/product/${p.id}`}>
                      <LazyImage src={p.image} alt={p.name} />
                    </Link>
                    <span className="card-tag">{p.category}</span>
                    <button 
                      className="wishlist-btn-premium"
                      onClick={() => isInWishlist(p.id) ? removeFromWishlist(p.id) : addToWishlist(p)}
                    >
                      <Heart 
                        size={18} 
                        fill={isInWishlist(p.id) ? "var(--secondary)" : "none"} 
                        stroke={isInWishlist(p.id) ? "var(--secondary)" : "white"} 
                      />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="card-rating">★★★★★</div>
                    <h3>{p.name}</h3>
                  </div>
                  <div className="card-footer">
                    <span className="price">{p.price.toLocaleString()}₫</span>
                    <button className="cart-add-btn">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-results-premium"
            >
              <Search size={48} />
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm theo từ khóa khác.</p>
              <button className="btn-outline" onClick={() => {setActiveCategory('Tất cả'); setPriceRange(3000000);}}>
                XÓA TẤT CẢ BỘ LỌC
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default Products;
