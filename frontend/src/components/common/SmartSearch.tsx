import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../api/productApi';

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
}

const SmartSearch = ({ isOpen, onClose }: SmartSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetchProducts({ search: query.trim() });
        const data = res.data?.data ?? res.data;
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const searchByTag = (tag: string) => {
    setQuery(tag);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="smart-search-overlay"
        >
          <button className="close-search" onClick={onClose}><X size={32} /></button>
          
          <div className="search-content container">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="search-input-wrap"
            >
              <Search size={32} />
              <input 
                type="text" 
                placeholder="TÌM KIẾM SẢN PHẨM..." 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {loading && <Loader2 size={24} className="spin-icon" />}
            </motion.div>

            <div className="search-results-grid">
              <div className="search-column">
                <h3>GỢI Ý TÌM KIẾM</h3>
                <div className="search-tags">
                  {['Serum', 'Kem dưỡng', 'Mặt nạ', 'Trị mụn', 'Tẩy tế bào chết', 'Dầu tẩy trang'].map(tag => (
                    <button key={tag} onClick={() => searchByTag(tag)}>{tag}</button>
                  ))}
                </div>
              </div>

              <div className="search-column">
                <h3>{query ? `KẾT QUẢ (${results.length})` : 'SẢN PHẨM PHỔ BIẾN'}</h3>
                <div className="search-suggestions">
                  {loading && (
                    <div className="search-loading">Đang tìm kiếm...</div>
                  )}
                  {!loading && searched && results.length === 0 && (
                    <div className="search-loading">Không tìm thấy sản phẩm phù hợp</div>
                  )}
                  {!loading && results.map((item, i) => (
                    <Link
                      to={`/product/${item.id}`}
                      key={item.id}
                      onClick={onClose}
                    >
                      <motion.div 
                        className="suggestion-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <img src={item.images?.[0]?.url || ''} alt={item.name} />
                        <div className="sug-info">
                          <h4>{item.name}</h4>
                          <span>{item.price.toLocaleString()}₫</span>
                        </div>
                        <ArrowRight size={18} />
                      </motion.div>
                    </Link>
                  ))}
                  {!query && !loading && (
                    <>
                      {[{ name: "Serum Phục Hồi", price: "1.250.000₫", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=100&q=80" },
                        { name: "Kem Dưỡng Thảo Mộc", price: "850.000₫", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=100&q=80" },
                        { name: "Mặt Nạ Thải Độc", price: "320.000₫", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=100&q=80" }].map((item, i) => (
                        <motion.div 
                          key={i} 
                          className="suggestion-item"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <img src={item.img} alt={item.name} />
                          <div className="sug-info">
                            <h4>{item.name}</h4>
                            <span>{item.price}</span>
                          </div>
                          <Link to="/products" onClick={onClose}><ArrowRight size={18} /></Link>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartSearch;
