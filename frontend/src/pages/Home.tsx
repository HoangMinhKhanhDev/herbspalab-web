import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronRight, Play, Eye, ShoppingCart } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import SEO from '../components/common/SEO';
import QuickView from '../components/common/QuickView';
import LazyImage from '../components/common/LazyImage';

const FloatingPetals = () => {
  return (
    <div className="floating-petals">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="petal"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -100, 
            rotate: 0,
            opacity: 0 
          }}
          animate={{ 
            y: window.innerHeight + 100,
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 50}px)`,
            rotate: 360,
            opacity: [0, 0.4, 0.4, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 2 
          }}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });

  const featuredProducts = [
    { name: "Serum Phục Hồi", price: "1.250.000₫", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", tag: "Best Seller" },
    { name: "Kem Dưỡng Thảo Mộc", price: "850.000₫", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80", tag: "New" },
    { name: "Sữa Rửa Mặt Tự Nhiên", price: "450.000₫", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", tag: "Popular" },
    { name: "Mặt Nạ Thải Độc", price: "320.000₫", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", tag: "Must Have" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page page-transition"
    >
      <SEO 
        title="Luxury Skincare & Spa" 
        description="Trải nghiệm dòng mỹ phẩm thảo mộc cao cấp và liệu trình spa chuyên sâu tại HerbSpa Lab." 
      />

      <QuickView 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <FloatingPetals />

      <section className="hero-section">
        <motion.div 
          className="hero-parallax-bg"
          style={{ scale }}
        />
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.div
            style={{ y: springY1 }}
            className="hero-text-wrap"
          >
            <motion.span 
              initial={{ opacity: 0, letterSpacing: "10px" }}
              animate={{ opacity: 1, letterSpacing: "4px" }}
              transition={{ duration: 1.5 }}
              className="hero-subtitle"
            >
              SINCE 1992 • ORGANIC HERITAGE
            </motion.span>
            <h1 className="hero-title">
              Vẻ Đẹp <br /> <span>Thuần Khiết</span>
            </h1>
            <p className="hero-desc">
              Hành trình đánh thức làn da bằng tinh hoa thảo mộc tự nhiên và nghệ thuật chăm sóc spa đẳng cấp quốc tế.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">Khám phá ngay</Link>
              <button className="btn-video">
                <div className="play-icon"><Play size={16} fill="white" /></div>
                Xem phim ngắn
              </button>
            </div>
          </motion.div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="mouse"></div>
          <span>CUỘN ĐỂ KHÁM PHÁ</span>
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <Reveal>
            <h2 className="section-title">Sản phẩm tiêu biểu</h2>
          </Reveal>
          <Link to="/products" className="view-all">Tất cả sản phẩm <ChevronRight size={18} /></Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((p, i) => (
            <motion.div 
              key={i} 
              className="product-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="product-image-container">
                <LazyImage src={p.img} alt={p.name} className="product-image" />
                {p.tag && <span className="product-badge">{p.tag}</span>}
                <div className="product-actions">
                  <button className="action-btn" onClick={() => setSelectedProduct(p)}>
                    <Eye size={20} />
                  </button>
                  <button className="action-btn">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
              <Link to={`/product/${i + 1}`} className="product-info">
                <h3>{p.name}</h3>
                <div className="product-price">{p.price}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section bg-dark ingredients-section">
        <div className="container">
          <Reveal>
            <span className="section-subtitle">THE ART OF BOTANICALS</span>
            <h2 className="section-title text-white">Tinh Hoa Thảo Mộc</h2>
          </Reveal>
          
          <div className="ingredients-scroll">
            {[
              { name: "Nhân Sâm Đỏ", desc: "Phục hồi sinh khí và chống lão hóa tầng sâu.", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" },
              { name: "Linh Chi Tuyết", desc: "Làm dịu và tăng cường hàng rào bảo vệ da.", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80" },
              { name: "Nhụy Hoa Nghệ Tây", desc: "Làm sáng da tự nhiên và mờ thâm nám.", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
              { name: "Trà Xanh Cổ Thụ", desc: "Thải độc và se khít lỗ chân lông tức thì.", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" }
            ].map((ing, i) => (
              <motion.div 
                key={i} 
                className="ingredient-card"
                whileHover={{ y: -20 }}
              >
                <div className="ing-img-wrap">
                  <LazyImage src={ing.img} alt={ing.name} />
                </div>
                <div className="ing-info">
                  <h3>{ing.name}</h3>
                  <p>{ing.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-accent">
        <div className="container promo-banner">
          <div className="promo-text">
            <h2 className="promo-title">Chăm sóc da toàn diện</h2>
            <p>Nhận ngay ưu đãi 20% cho lần đầu trải nghiệm dịch vụ Spa thảo mộc tại trung tâm của chúng tôi.</p>
            <button className="btn btn-primary">Đặt lịch hẹn</button>
          </div>
          <div className="promo-image"></div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
