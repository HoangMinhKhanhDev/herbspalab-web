import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, X, ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';

import { fetchProducts } from '../api/productApi';
import { fetchCategories } from '../api/categoryApi';

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  categoryId?: string;
  category?: { name: string };
  description?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [activeSkinType, setActiveSkinType] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState(3000000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const skinTypes = ['Tất cả', 'Da dầu', 'Da khô', 'Da nhạy cảm', 'Da hỗn hợp'];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        // API returns array directly, not wrapped
        const cats = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (activeCategoryId !== 'all') params.categoryId = activeCategoryId;
    
    fetchProducts(params)
      .then(res => {
        const data = res.data?.data ?? res.data;
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, [activeCategoryId]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchPrice = p.price <= priceRange;
      const matchSkin = activeSkinType === 'Tất cả' || (p.description && p.description.includes(activeSkinType));
      return matchPrice && matchSkin;
    });
  }, [priceRange, products, activeSkinType]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return (
    <div className="loader-container" style={{flexDirection:'column',gap:'1rem',color:'var(--secondary)'}}>
      <p>{error}</p>
      <button className="btn-outline" onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  );

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
                <button 
                  className={`pill-filter ${activeCategoryId === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategoryId('all')}
                >
                  Tất cả
                </button>
                {categories.map(c => (
                  <button 
                    key={c.id} 
                    className={`pill-filter ${activeCategoryId === c.id ? 'active' : ''}`}
                    onClick={() => setActiveCategoryId(c.id)}
                  >
                    {c.name}
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
                      <LazyImage 
                        src={p.images?.[0]?.url || 'https://via.placeholder.com/300x400'} 
                        alt={p.name} 
                        width={300} 
                        height={400} 
                      />
                    </Link>
                    <span className="card-tag">{p.category?.name || 'Thảo mộc'}</span>
                    <button 
                      className="wishlist-btn-premium"
                      onClick={() => isInWishlist(p.id) ? removeFromWishlist(p.id) : addToWishlist({ 
                        id: p.id, 
                        name: p.name, 
                        price: p.price, 
                        image: p.images?.[0]?.url || '',
                        category: p.category?.name
                      })}
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
              <button className="btn-outline" onClick={() => {setActiveCategoryId('all'); setPriceRange(3000000);}}>
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
