import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ChevronRight, Play, Eye, ShoppingCart, ArrowRight, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SEO from '../components/common/SEO';
import QuickView from '../components/common/QuickView';
import LazyImage from '../components/common/LazyImage';

const Counter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-num">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const FloatingPetals = () => {
  return (
    <div className="floating-petals">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="petal"
          initial={{ 
            x: Math.random() * 100 + "vw", 
            y: -100, 
            rotate: 0,
            opacity: 0 
          }}
          animate={{ 
            y: "110vh",
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`,
            rotate: 720,
            opacity: [0, 0.4, 0.4, 0]
          }}
          transition={{ 
            duration: 15 + Math.random() * 15, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 3 
          }}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.2]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });

  const featuredProducts = [
    { id: 1, name: "Serum Phục Hồi Nhân Sâm", price: "1.250.000₫", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", tag: "Best Seller" },
    { id: 2, name: "Kem Dưỡng Thảo Mộc Ban Đêm", price: "850.000₫", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80", tag: "New Arrival" },
    { id: 3, name: "Sữa Rửa Mặt Tảo Biển", price: "450.000₫", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", tag: "Organic" },
    { id: 4, name: "Mặt Nạ Thải Độc Trà Xanh", price: "320.000₫", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", tag: "Popular" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="home-wrapper"
    >
      <SEO 
        title="Luxury Skincare & Spa Heritage" 
        description="Khám phá tinh hoa thảo mộc kết hợp công nghệ hiện đại tại HerbSpa Lab. Giải pháp chăm sóc da toàn diện từ thiên nhiên." 
      />

      <QuickView 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <FloatingPetals />

      {/* --- SPLIT HERO SECTION --- */}
      <section className="hero-split">
        <div className="hero-left">
          <motion.div 
            className="hero-text-container"
            style={{ y: springY1, opacity }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="hero-tag">THE ART OF BOTANICALS</span>
              <h1 className="hero-display">
                Đánh Thức <br />
                <span className="italic-text">Vẻ Đẹp</span> <br />
                Huyền Bí
              </h1>
              <p className="hero-lead">
                Hành trình từ vườn dược liệu cổ truyền đến công nghệ sinh học hiện đại, 
                mang lại sự thảnh thơi tuyệt đối cho làn da của bạn.
              </p>
              <div className="hero-btns">
                <Link to="/products" className="btn-premium">
                  <span>KHÁM PHÁ BỘ SƯU TẬP</span>
                  <ArrowRight size={18} />
                </Link>
                <button className="btn-circle-play">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="hero-right">
          <motion.div 
            className="hero-image-parallax"
            style={{ scale }}
          >
            <img src="https://images.unsplash.com/photo-1570172619380-4101750c58e4?auto=format&fit=crop&w=1200&q=90" alt="Luxury Spa" />
          </motion.div>
          <div className="hero-glass-card">
            <div className="glass-content">
              <h3>Signature Treatment</h3>
              <p>Liệu pháp phục hồi tầng sâu bằng Nhụy hoa nghệ tây và Nhân sâm đỏ.</p>
              <Link to="/skin-quiz" className="glass-link">TƯ VẤN NGAY</Link>
            </div>
          </div>
        </div>

        <motion.div 
          className="hero-scroll-down"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="scroll-line"></div>
          <span>SCROLL</span>
        </motion.div>
      </section>

      {/* --- STATS COUNTER SECTION --- */}
      <section className="section-stats">
        <div className="container stats-grid">
          <Counter value={32} label="Năm Kinh Nghiệm" suffix="+" />
          <Counter value={150} label="Sản Phẩm Hữu Cơ" suffix="+" />
          <Counter value={98} label="Khách Hàng Hài Lòng" suffix="%" />
          <Counter value={12} label="Giải Thưởng Quốc Tế" />
        </div>
      </section>

      {/* --- FEATURED COLLECTION --- */}
      <section className="section section-featured">
        <div className="container">
          <div className="flex-header">
            <Reveal>
              <span className="subtitle">COLLECTIONS</span>
              <h2 className="title">Sản Phẩm Tiêu Biểu</h2>
            </Reveal>
            <Link to="/products" className="link-arrow">
              Xem tất cả <ChevronRight size={18} />
            </Link>
          </div>

          <div className="product-catalog-grid">
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                className="product-card-premium"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
              >
                <div className="card-img-wrapper">
                  <img src={product.img} alt={product.name} />
                  <span className="card-tag">{product.tag}</span>
                  <div className="card-overlay">
                    <button className="overlay-btn" onClick={() => setSelectedProduct(product)}>
                      <Eye size={20} />
                    </button>
                    <button className="overlay-btn">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-rating">★★★★★</div>
                  <h3>{product.name}</h3>
                </div>
                <div className="card-footer">
                  <span className="price">{product.price}</span>
                  <button className="cart-icon-btn">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HERITAGE ZONE (VISUAL ZONE) --- */}
      <section className="heritage-zone">
        <div className="heritage-bg">
          <motion.img 
            style={{ y: y2 }}
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80" 
            alt="Nature Heritage" 
          />
        </div>
        <div className="container heritage-content">
          <div className="heritage-text-box">
            <Reveal>
              <span className="subtitle-gold">BOTANICAL HERITAGE</span>
              <h2>Nguồn Gốc Của Sự Thảnh Thơi</h2>
              <p>
                Tại HerbSpa Lab, chúng tôi tin rằng làn da phản chiếu tâm hồn. 
                Mỗi sản phẩm là một bản giao hưởng giữa tinh hoa thảo dược ngàn năm 
                và những nghiên cứu đột phá về tế bào gốc thực vật.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <Sparkles size={20} />
                  <span>100% Nguyên liệu hữu cơ</span>
                </div>
                <div className="feature-item">
                  <ShieldCheck size={20} />
                  <span>Đã kiểm nghiệm lâm sàng</span>
                </div>
                <div className="feature-item">
                  <Globe size={20} />
                  <span>Chứng nhận quốc tế EcoCert</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- PROMO SECTION --- */}
      <section className="section section-promo">
        <div className="container">
          <div className="promo-glass-wrap">
            <div className="promo-content">
              <Reveal>
                <h2>Tham Gia Liệu Trình Tư Vấn Cá Nhân</h2>
                <p>Mỗi làn da là một câu chuyện riêng. Hãy để chuyên gia của chúng tôi giúp bạn viết tiếp chương rạng rỡ nhất.</p>
                <div className="promo-actions">
                  <Link to="/skin-quiz" className="btn-premium">BẮT ĐẦU QUIZ DA</Link>
                  <Link to="/consultation" className="btn-outline">ĐẶT LỊCH SPA</Link>
                </div>
              </Reveal>
            </div>
            <div className="promo-img-side">
              <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&w=800&q=80" alt="Consultation" />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
ủa chúng tôi.</p>
            <button className="btn btn-primary">Đặt lịch hẹn</button>
          </div>
          <div className="promo-image"></div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
