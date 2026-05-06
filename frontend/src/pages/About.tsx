import { motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';

const About = () => {
  const features = [
    { title: "Thuần Khiết", desc: "100% nguyên liệu từ thảo mộc tự nhiên, không chứa hóa chất độc hại, cam kết mang lại sự an toàn tuyệt đối cho mọi loại da." },
    { title: "Hiệu Quả", desc: "Công thức được nghiên cứu lâm sàng bởi các chuyên gia da liễu hàng đầu để mang lại kết quả rõ rệt và bền vững." },
    { title: "Bền Vững", desc: "Quy trình sản xuất thân thiện với môi trường, từ việc thu hoạch thảo mộc đến bao bì có thể tái chế hoàn toàn." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page page-transition"
    >
      <section className="section container">
        <div className="about-hero-layout">
          <div className="about-text-content">
            <Reveal>
              <span className="hero-subtitle" style={{ color: 'var(--secondary)' }}>VỀ CHÚNG TÔI</span>
            </Reveal>
            <Reveal>
              <h1 className="section-title">Triết lý Herbspa Lab</h1>
            </Reveal>
            <div className="divider"></div>
            <p className="about-intro">
              Chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ sự cân bằng giữa con người và thiên nhiên. 
              Mọi sản phẩm của Herbspa Lab đều là sự kết tinh của tinh hoa thảo dược cổ truyền và khoa học da liễu hiện đại.
            </p>
            <p className="about-desc">
              Được thành lập với sứ mệnh mang lại những giải pháp chăm sóc da thuần khiết nhất, 
              Herbspa Lab không ngừng tìm kiếm và chắt lọc những gì tinh túy nhất từ lòng đất mẹ để nuôi dưỡng làn da của bạn.
            </p>
          </div>
          <div className="about-image-collage">
             <div className="img-main">
               <img src="https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80" alt="Herbs" />
             </div>
             <div className="img-sub">
               <img src="https://images.unsplash.com/photo-1540555700478-4be289aefec9?auto=format&fit=crop&w=600&q=80" alt="Spa" />
             </div>
          </div>
        </div>
      </section>

      <section className="section bg-accent">
        <div className="container">
          <div className="about-features-grid">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                className="about-feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="feature-num">0{i + 1}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="mission-statement">
          <Reveal>
            <h2 className="statement-text">"Vẻ đẹp bền vững bắt nguồn từ sự thấu hiểu và tôn trọng thiên nhiên."</h2>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
