import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const featuredProducts = [
    { name: "Serum Phục Hồi", price: "1.250.000₫", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
    { name: "Kem Dưỡng Thảo Mộc", price: "850.000₫", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80" },
    { name: "Sữa Rửa Mặt Tự Nhiên", price: "450.000₫", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" },
    { name: "Mặt Nạ Thải Độc", price: "320.000₫", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page page-transition"
    >
      <section className="hero-section">
        <motion.div 
          className="hero-parallax-bg"
          style={{ y: y2 }}
        />
        <div className="container hero-content">
          <motion.div
            style={{ y: y1, opacity }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <span className="hero-subtitle">HERITAGE OF NATURE</span>
            <h1 className="hero-title">Herbspa Lab</h1>
            <p className="hero-desc">
              Nơi vẻ đẹp tự nhiên được đánh thức bởi những phương thức thảo mộc thuần khiết và công nghệ chăm sóc da tiên tiến nhất.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">Mua sắm ngay</Link>
              <Link to="/about" className="btn btn-link">Tìm hiểu thêm <ArrowRight size={20} /></Link>
            </div>
          </motion.div>
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
              <Link to={`/product/${i + 1}`}>
                <div className="product-image-container">
                  <img src={p.img} alt={p.name} className="product-image" />
                  <div className="product-overlay">
                    <button className="add-to-cart-quick">Thêm vào giỏ</button>
                  </div>
                </div>
              </Link>
              <div className="product-info">
                <h3>{p.name}</h3>
                <div className="product-price">{p.price}</div>
              </div>
            </motion.div>
          ))}
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
