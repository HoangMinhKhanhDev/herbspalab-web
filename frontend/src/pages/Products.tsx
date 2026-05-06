import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [activeSkinType, setActiveSkinType] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState(2000000);

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
      <div className="section-header">
        <h1 className="section-title">Cửa hàng</h1>
      </div>

      <div className="products-layout">
        <aside className="filter-sidebar">
          <div className="filter-group">
            <h4>DANH MỤC</h4>
            <div className="filter-list">
              {categories.map(c => (
                <button 
                  key={c} 
                  className={`filter-btn ${activeCategory === c ? 'active' : ''}`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>LOẠI DA</h4>
            <div className="filter-list">
              {skinTypes.map(s => (
                <button 
                  key={s} 
                  className={`filter-btn ${activeSkinType === s ? 'active' : ''}`}
                  onClick={() => setActiveSkinType(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>GIÁ (DƯỚI {priceRange.toLocaleString()}₫)</h4>
            <input 
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

        <main className="products-main">
          <div className="products-grid-premium">
            {filteredProducts.map((p, i) => (
              <motion.div 
                key={p.id} 
                className="product-card-premium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 4) * 0.1 }}
              >
                <Link to={`/product/${p.id}`} className="card-link-wrapper">
                  <div className="card-img-wrapper">
                    <img src={p.image} alt={p.name} />
                    <span className="card-tag">{p.category}</span>
                  </div>
                </Link>
                <div className="card-body">
                  <div className="card-rating">
                    {"★".repeat(Math.round(Number(p.rating)))}
                    <span className="stock-info">({p.stock} còn lại)</span>
                  </div>
                  <h3>{p.name}</h3>
                  <div className="card-footer">
                    <span className="price">{p.price.toLocaleString()}₫</span>
                    <button className="cart-icon-btn"><ShoppingBag size={18} /></button>
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
