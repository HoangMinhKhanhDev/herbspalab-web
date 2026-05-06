import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tất cả');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products?category=${category}&limit=12`)
      .then(res => res.json())
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page container section"
    >
      <div className="product-page-header">
        <h1>Bộ sưu tập sản phẩm</h1>
        <div className="product-category-filters">
          {['Tất cả', 'Serum', 'Kem dưỡng', 'Làm sạch', 'Mặt nạ'].map(cat => (
            <button 
              key={cat} 
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="product-catalog-grid">
            {products.map((p, i) => (
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
          <div className="pagination">
             <button className="btn btn-outline">Tải thêm sản phẩm</button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Products;
