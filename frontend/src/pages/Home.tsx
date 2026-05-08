import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, ArrowRight, Sparkles, ShieldCheck, Leaf, Droplets, FlaskConical, Globe } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import SEO from '../components/common/SEO';
import QuickView from '../components/common/QuickView';

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
  const petals = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      startX: ((i * 37) % 100) + "vw",
      scale: 0.6 + ((i * 13) % 40) / 100,
      endX: `calc(${((i * 23) % 100)}vw + ${Math.sin(i) * 150}px)`,
      rotate: i % 2 === 0 ? 360 : -360,
      duration: 12 + ((i * 7) % 15),
      delay: (i * 3) % 20,
    }));
  }, []);

  return (
    <div className="floating-petals">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className={`petal petal-${p.id % 3}`}
          initial={{ 
            x: p.startX, 
            y: -100, 
            rotate: 0,
            opacity: 0,
            scale: p.scale
          }}
          animate={{ 
            y: "110vh",
            x: p.endX,
            rotate: p.rotate,
            opacity: [0, 0.5, 0.5, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 4,10 4,16C4,18.21 5.79,20 8,20C9.66,20 11.1,18.9 11.66,17.38C12,17.13 12,17.13 12.34,17.38C12.9,18.9 14.34,20 16,20C18.21,20 20,18.21 20,16C20,10 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  img: string;
  tag?: string;
}

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);
  
  // Slider Logic
  const [[page, direction], setPage] = useState([0, 0]);
  const slides = [
    {
      id: 1,
      title: "The Art of Pure Beauty",
      subtitle: "AN TOÀN • MINH BẠCH • BỀN VỮNG",
      desc: "HerbSpaLab kết hợp tinh hoa thảo mộc ngàn năm cùng khoa học hiện đại để kiến tạo nên những liệu trình chăm sóc da thuần khiết nhất.",
      img: "/assets/images/hero_bg.png",
      tag: "EST. 2024"
    },
    {
      id: 2,
      title: "Botanical Laboratory",
      subtitle: "GIA CÔNG MỸ PHẨM CHUYÊN NGHIỆP",
      desc: "Cơ sở sản xuất đạt chuẩn Sở Y tế, dây chuyền hiện đại, nguyên liệu 100% minh bạch nguồn gốc.",
      img: "/assets/images/heritage_bg.png",
      tag: "BOTANICAL EXCELLENCE"
    },
    {
      id: 3,
      title: "Vua Trị Mụn",
      subtitle: "CAM KẾT DỨT ĐIỂM • BẢO HÀNH TRỌN ĐỜI",
      desc: "Liệu trình trị mụn chuyên sâu, không để lại sẹo, giúp bạn lấy lại sự tự tin tuyệt đối với làn da mịn màng.",
      img: "/assets/images/promo_img.png",
      tag: "SKINCARE SPECIALIST"
    }
  ];

  const slideIndex = Math.abs(page % slides.length);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 8000);
    return () => clearInterval(timer);
  }, [paginate]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Parallax Logic
  const { scrollY } = useScroll();
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.1]);

  const featuredProducts = [
    { id: 1, name: "Serum Phục Hồi Nhân Sâm", price: "1.250.000₫", img: "/assets/images/product_1.png", tag: "Best Seller" },
    { id: 2, name: "Kem Dưỡng Ẩm Da Ban Đêm", price: "850.000₫", img: "/assets/images/product_2.png", tag: "New Arrival" },
    { id: 3, name: "Sữa Rửa Mặt Thảo Mộc", price: "450.000₫", img: "/assets/images/product_3.png", tag: "Organic" },
    { id: 4, name: "Kem Trị Nám Da Thiên Nhiên", price: "680.000₫", img: "/assets/images/product_4.png", tag: "Popular" }
  ];

  const stats = [
    { value: 12, label: "Năm Kinh Nghiệm", suffix: "+" },
    { value: 300, label: "Công Thức Độc Quyền", suffix: "+" },
    { value: 50, label: "Chuyên Gia Đầu Ngành", suffix: "" },
    { value: 100, label: "Minh Bạch Pháp Lý", suffix: "%" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="home-wrapper"
    >
      <SEO 
        title="HerbSpaLab | Sản Xuất & Gia Công Mỹ Phẩm An Toàn" 
        description="HerbSpaLab – Đơn vị sản xuất và gia công mỹ phẩm với định hướng An toàn cho sức khỏe, Minh bạch pháp lý. Hotline: 0972 245 219." 
      />

      <QuickView 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <FloatingPetals />

      {/* --- FULL WIDTH HERO SLIDER --- */}
      <section className="hero-slider-container">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 }
            }}
            className="hero-slide"
          >
            <div className="slide-bg">
              <img 
                src={slides[slideIndex].img} 
                alt={slides[slideIndex].title} 
                width="1920"
                height="1080"
                fetchPriority={slideIndex === 0 ? "high" : "auto"}
                loading="eager"
              />
              <div className="slide-overlay"></div>
            </div>
            
            <div className="container slide-content-wrap">
              <motion.div 
                className="slide-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="slide-tag">{slides[slideIndex].tag}</span>
                <span className="slide-subtitle">{slides[slideIndex].subtitle}</span>
                <h1 className="slide-title">
                  {slides[slideIndex].title.split(' ').map((word, i) => (
                    <span key={i} className={i === 2 ? 'italic-text' : ''}>{word} </span>
                  ))}
                </h1>
                <p className="slide-desc">{slides[slideIndex].desc}</p>
                <div className="slide-btns">
                  <Link to="/products" className="btn-luxury interactive">
                    <span>KHÁM PHÁ NGAY</span>
                    <div className="btn-luxury-arrow">
                      <ArrowRight size={20} />
                    </div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <button className="slider-ctrl prev interactive" onClick={() => paginate(-1)}>
          <ChevronLeft size={32} />
        </button>
        <button className="slider-ctrl next interactive" onClick={() => paginate(1)}>
          <ChevronRight size={32} />
        </button>

        {/* Pagination Dots */}
        <div className="slider-pagination">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`pag-dot ${idx === slideIndex ? 'active' : ''}`}
              onClick={() => setPage([idx, idx > slideIndex ? 1 : -1])}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="slider-scroll-hint">
          <div className="hint-line">
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hint-dot"
            />
          </div>
          <span>SCROLL</span>
        </div>
      </section>

      {/* --- THE RITUAL SECTION --- */}
      <section className="section-ritual">
        <div className="container">
          <div className="ritual-header">
            <Reveal>
              <span className="subtitle">QUY TRÌNH CHUẨN KHOA HỌC</span>
              <h2 className="title">Liệu Pháp <span className="italic-text">Thanh Khiết</span></h2>
              <p className="ritual-intro">
                Mỗi sản phẩm và liệu trình tại HerbSpaLab đều tuân thủ 5 bước "Nghi thức" 
                nghiêm ngặt để đảm bảo hiệu quả tối ưu và sự an toàn tuyệt đối.
              </p>
            </Reveal>
          </div>
          
          <div className="ritual-journey-container">
            <div className="ritual-connecting-line"></div>
            <div className="ritual-steps-flex">
              {[
                { step: "01", title: "Phân Tích Da", desc: "Công nghệ AI thấu hiểu từng tế bào da.", icon: <Sparkles size={22}/> },
                { step: "02", title: "Thanh Lọc", desc: "Loại bỏ độc tố bằng thảo mộc dạng ướt.", icon: <Droplets size={22}/> },
                { step: "03", title: "Trị Liệu", desc: "Ứng dụng công thức độc quyền từ Lab.", icon: <FlaskConical size={22}/> },
                { step: "04", title: "Nuôi Dưỡng", desc: "Cấp ẩm bằng tinh chất nhân sâm quý.", icon: <Leaf size={22}/> },
                { step: "05", title: "Bảo Vệ", desc: "Xây dựng hàng rào bảo vệ da bền vững.", icon: <ShieldCheck size={22}/> }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="ritual-node interactive"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                >
                  <div className="node-marker">
                    <div className="marker-circle">
                      <div className="marker-inner">
                        {item.icon}
                      </div>
                    </div>
                    <div className="marker-num">{item.step}</div>
                  </div>
                  <div className="node-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PROFESSIONAL SPA SERVICES --- */}
      <section className="section section-treatments bg-accent">
        <div className="container">
          <div className="flex-header" style={{ marginBottom: '40px' }}>
            <Reveal>
              <span className="subtitle">DỊCH VỤ SPA CHUYÊN SÂU</span>
              <h2 className="title">Vua Trị Mụn & Chăm Sóc Da</h2>
            </Reveal>
          </div>

          <div className="treatment-grid">
            <div className="treatment-main-card">
              <Reveal>
                <div className="treatment-badge">CAM KẾT VÀNG</div>
                <h3>Trị Dứt Điểm Mụn - Bảo Hành Trọn Đời</h3>
                <p>Chúng tôi tự hào là đơn vị dẫn đầu trong việc điều trị các loại mụn cứng đầu nhất, mang lại làn da mịn màng và sự tự tin tuyệt đối cho khách hàng.</p>
                
                <div className="acne-types-tags">
                  <span>Mụn mủ</span>
                  <span>Mụn bọc</span>
                  <span>Mụn viêm lâu năm</span>
                  <span>Mụn đầu đen</span>
                  <span>Mụn trắng</span>
                  <span>Thâm mụn</span>
                </div>

                <div className="treatment-features">
                  <div className="t-feature">
                    <ShieldCheck size={20} />
                    <span>Không mọc lại - Bảo hành trọn đời</span>
                  </div>
                  <div className="t-feature">
                    <Sparkles size={20} />
                    <span>Không để lại sẹo - Da sáng mịn</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="treatment-sub-grid">
              <div className="treatment-sub-card">
                <div className="icon-wrap"><Sparkles size={24} /></div>
                <h4>Trẻ Hóa Da</h4>
                <p>Công nghệ tiên tiến giúp tái tạo cấu trúc da, xóa mờ nếp nhăn và lấy lại tuổi thanh xuân.</p>
              </div>
              <div className="treatment-sub-card">
                <div className="icon-wrap"><ShieldCheck size={24} /></div>
                <h4>Chăm Sóc Chuyên Sâu</h4>
                <p>Liệu trình cá nhân hóa giúp nuôi dưỡng da từ sâu bên trong, bảo vệ da khỏi tác động môi trường.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- INTERACTIVE STATS SECTION --- */}
      <section className="section-stats-parallax">
        <div className="container">
          <div className="stats-glass-grid">
            {stats.map((item, idx) => (
              <div key={idx} className="stat-item-premium">
                <Counter value={item.value} label={item.label} suffix={item.suffix} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CURATED PRODUCTS SECTION --- */}
      <section className="section section-curated-products">
        <div className="container">
          <div className="section-header-luxury">
            <Reveal>
              <span className="luxury-subtitle">COLLECTION 2024</span>
              <h2 className="luxury-title">Tinh Hoa <span className="gold-text">Thảo Mộc</span></h2>
              <div className="luxury-line"></div>
            </Reveal>
          </div>
          
          <div className="curated-grid">
            {featuredProducts.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 0.15}>
                <div className="luxury-card interactive">
                  <div className="luxury-card-img">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      width="400" 
                      height="500" 
                      loading="lazy" 
                    />
                    <div className="luxury-card-overlay">
                      <div className="luxury-action-group">
                        <button className="btn-luxury-icon" onClick={() => setSelectedProduct(product)}>
                          <Eye size={18} />
                        </button>
                        <button className="btn-luxury-icon">
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                    {product.tag && <div className="luxury-tag">{product.tag}</div>}
                  </div>
                  <div className="luxury-card-info">
                    <span className="card-cat">BOTANICAL CARE</span>
                    <h3>{product.name}</h3>
                    <div className="card-footer">
                      <span className="card-price">{product.price}</span>
                      <Link to={`/product/${product.id}`} className="card-link">
                        DETAIL <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="section-footer-action">
            <Link to="/products" className="btn-outline-luxury">XEM TẤT CẢ SẢN PHẨM</Link>
          </div>
        </div>
      </section>

      {/* --- BOTANICAL LABORATORY SECTION --- */}
      <section className="section-lab bg-creme">
        <div className="container lab-grid">
          <div className="lab-image-side">
            <Reveal>
              <div className="lab-img-container">
                <img src="/assets/images/heritage_bg.png" alt="Botanical Lab" className="lab-img-main" />
                <div className="lab-img-float">
                  <img src="/assets/images/product_4.png" alt="Scientific Process" />
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lab-text-side">
            <Reveal>
              <span className="subtitle">CÔNG NGHỆ & KHOA HỌC</span>
              <h2 className="title">Phòng Thí Nghiệm <br/><span className="italic-text">Thảo Mộc</span></h2>
              <p className="lab-desc">
                Cơ sở sản xuất của chúng tôi được Sở Y tế cấp Giấy chứng nhận đủ điều kiện sản xuất, 
                đáp ứng đầy đủ các quy định khắt khe nhất của pháp luật Việt Nam. 
                Với dây chuyền sản xuất dạng ướt cùng hệ thống máy móc, thiết bị hiện đại, 
                mỗi giọt sản phẩm đều là sự kết tinh của tri thức và trách nhiệm.
              </p>
              <div className="lab-features">
                <div className="lab-feature-item">
                  <div className="l-icon"><ShieldCheck size={20}/></div>
                  <div>
                    <h5>Kiểm soát 100%</h5>
                    <p>Từ nghiên cứu công thức đến đóng gói thành phẩm.</p>
                  </div>
                </div>
                <div className="lab-feature-item">
                  <div className="l-icon"><Sparkles size={20}/></div>
                  <div>
                    <h5>Nguyên liệu sạch</h5>
                    <p>Nguồn gốc rõ ràng, đầy đủ hồ sơ pháp lý (COA, MSDS).</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn-outline interactive">TÌM HIỂU QUY TRÌNH</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- HERITAGE & ORIGIN --- */}
      <section className="section-heritage">
        <div className="container">
          <div className="heritage-title-center">
            <Reveal>
              <span className="subtitle">NGUỒN GỐC TỰ NHIÊN</span>
              <h2 className="title">Di Sản <span className="italic-text">Từ Đất Mẹ</span></h2>
            </Reveal>
          </div>
          
          <div className="heritage-cards-grid">
            {[
              { title: "Nhân Sâm Quý", desc: "Được tuyển chọn từ những vùng nguyên liệu sạch, giàu dưỡng chất.", img: "/assets/images/heritage_bg.png" },
              { title: "Thảo Mộc Lành Tính", desc: "Sự kết hợp tinh túy của các loài hoa và lá thuốc dân gian.", img: "/assets/images/promo_img.png" },
              { title: "Tinh Hoa Nước", desc: "Nguồn nước tinh khiết được lọc qua hệ thống RO hiện đại.", img: "/assets/images/hero_bg.png" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="heritage-card interactive"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <div className="h-card-img">
                  <img src={item.img} alt={item.title} />
                  <div className="h-card-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
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
            style={{ y: y2, scale }}
            src="/assets/images/heritage_bg.png" 
            alt="Nature Heritage" 
          />
        </div>
        <div className="container heritage-content">
          <div className="heritage-text-box">
            <Reveal>
              <span className="subtitle-gold">CAM KẾT CHẤT LƯỢNG</span>
              <h2>Khắt Khe Trong Từng Sản Phẩm</h2>
              <p>
                Chúng tôi chú trọng kiểm soát chất lượng trong toàn bộ quy trình sản xuất, 
                từ nghiên cứu công thức, lựa chọn nguyên liệu đến đóng gói thành phẩm. 
                Nguyên liệu sử dụng có nguồn gốc rõ ràng, đầy đủ hồ sơ pháp lý.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <Sparkles size={20} />
                  <span>Nguyên liệu thiên nhiên lành tính</span>
                </div>
                <div className="feature-item">
                  <ShieldCheck size={20} />
                  <span>Sở Y tế cấp chứng nhận sản xuất</span>
                </div>
                <div className="feature-item">
                  <Globe size={20} />
                  <span>Hồ sơ pháp lý đầy đủ (COA, MSDS, TDS)</span>
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
                <h2>Gia Công Mỹ Phẩm Trọn Gói Cho Thương Hiệu Của Bạn</h2>
                <p>Từ tư vấn công thức, gia công đóng gói đến hỗ trợ hồ sơ công bố – chúng tôi đồng hành cùng bạn từ ý tưởng đến sản phẩm hoàn chỉnh.</p>
                <div className="promo-actions">
                  <Link to="/skin-quiz" className="btn-premium">TƯ VẤN MIỄN PHÍ</Link>
                  <Link to="/about" className="btn-outline">LIÊN HỆ: 0972 245 219</Link>
                </div>
              </Reveal>
            </div>
            <div className="promo-img-side">
              <img src="/assets/images/promo_img.png" alt="Consultation" />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
