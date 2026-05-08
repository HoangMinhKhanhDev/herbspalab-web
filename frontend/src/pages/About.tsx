import { motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import { ShieldCheck, Leaf, FlaskConical, Handshake, Award, FileCheck, Sparkles, Factory, Heart } from 'lucide-react';

const About = () => {
  const coreValues = [
    { 
      icon: ShieldCheck,
      title: "An Toàn Cho Sức Khỏe", 
      desc: "Nguyên liệu có nguồn gốc rõ ràng, đầy đủ hồ sơ pháp lý (COA, MSDS, TDS), đảm bảo an toàn và phù hợp với tiêu chuẩn mỹ phẩm hiện hành." 
    },
    { 
      icon: FileCheck,
      title: "Minh Bạch Pháp Lý", 
      desc: "Cơ sở sản xuất được Sở Y tế cấp Giấy chứng nhận đủ điều kiện sản xuất, đáp ứng đầy đủ các quy định hiện hành của pháp luật Việt Nam." 
    },
    { 
      icon: Handshake,
      title: "Đồng Hành Thương Hiệu Việt", 
      desc: "Đặc biệt phù hợp với thương hiệu spa và các doanh nghiệp vừa & nhỏ, cam kết chất lượng ổn định – quy trình rõ ràng – hợp tác lâu dài." 
    }
  ];

  const services = [
    { icon: FlaskConical, title: "Tư vấn công thức", desc: "Tư vấn công thức theo định hướng thương hiệu, phù hợp với từng phân khúc thị trường." },
    { icon: Factory, title: "Gia công – Đóng gói", desc: "Gia công và đóng gói theo yêu cầu với dây chuyền sản xuất dạng ướt cùng hệ thống máy móc hiện đại." },
    { icon: FileCheck, title: "Hồ sơ công bố", desc: "Hỗ trợ toàn bộ hồ sơ công bố mỹ phẩm, đồng hành cùng khách hàng từ ý tưởng đến sản phẩm hoàn chỉnh." },
    { icon: Award, title: "Kiểm soát chất lượng", desc: "Kiểm soát chất lượng toàn bộ quy trình từ nghiên cứu công thức, lựa chọn nguyên liệu đến đóng gói thành phẩm." }
  ];

  const products = [
    "Kem nám da", "Kem dưỡng ẩm da", "Kem chống nắng", 
    "Sữa rửa mặt", "Serum", "Dầu gội", 
    "Sữa tắm", "Dung dịch vệ sinh phụ nữ"
  ];

  const missionPoints = [
    { icon: Leaf, text: "Lựa chọn nguyên liệu có nguồn gốc rõ ràng, được phép sử dụng trong mỹ phẩm theo quy định hiện hành." },
    { icon: ShieldCheck, text: "Kiểm soát chặt chẽ công thức, quy trình sản xuất và chỉ tiêu chất lượng, đảm bảo sản phẩm ổn định và an toàn khi lưu hành." },
    { icon: FileCheck, text: "Minh bạch trong hồ sơ công bố, nhãn mác và thông tin sản phẩm, giúp đối tác và người tiêu dùng an tâm khi sử dụng." },
    { icon: Handshake, text: "Đồng hành cùng đối tác và thương hiệu trong việc phát triển các dòng mỹ phẩm bền vững và có trách nhiệm với người tiêu dùng." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page page-transition"
    >
      <SEO 
        title="Về Chúng Tôi | HerbSpaLab" 
        description="HerbSpaLab – Đơn vị sản xuất và gia công Mỹ phẩm với định hướng An toàn cho sức khỏe, Minh bạch pháp lý, Đồng hành cùng thương hiệu Việt." 
      />

      {/* --- HERO SECTION --- */}
      <section className="section container" aria-labelledby="about-title">
        <div className="about-hero-layout">
          <div className="about-text-content">
            <Reveal>
              <span className="hero-subtitle" style={{ color: 'var(--secondary)' }}>VỀ CHÚNG TÔI</span>
            </Reveal>
            <Reveal>
              <h1 id="about-title" className="section-title">HerbSpaLab</h1>
            </Reveal>
            <div className="divider" role="presentation"></div>
            <p className="about-intro">
              Chúng tôi là đơn vị sản xuất và gia công Mỹ phẩm với định hướng <strong>An toàn cho sức khỏe – Minh bạch pháp lý – Đồng hành cùng thương hiệu Việt</strong>. Hướng tới những sản phẩm có nguồn gốc thiên nhiên lành tính được kết hợp cùng tinh hoa hiện đại của khoa học.
            </p>
            <p className="about-desc">
              Công ty sở hữu cơ sở sản xuất Mỹ phẩm được Sở Y tế cấp Giấy chứng nhận đủ điều kiện sản xuất, 
              đáp ứng đầy đủ các quy định hiện hành của pháp luật Việt Nam. Với dây chuyền sản xuất dạng ướt 
              cùng hệ thống máy móc, thiết bị hiện đại, chúng tôi chuyên sản xuất và gia công các dòng sản phẩm 
              chăm sóc và làm sạch da, tóc cho cá nhân, gia đình, spa nhỏ và chuỗi spa lớn.
            </p>
          </div>
          <div className="about-image-collage">
             <div className="img-main">
               <LazyImage src="/assets/images/hero_bg.png" alt="Cơ sở sản xuất HerbSpaLab" />
             </div>
             <div className="img-sub">
               <LazyImage src="/assets/images/promo_img.png" alt="Không gian spa chăm sóc da" />
             </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="section bg-accent">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="subtitle">GIÁ TRỊ CỐT LÕI</span>
              <h2 className="title">Ba Trụ Cột Phát Triển</h2>
            </div>
          </Reveal>
          <div className="about-features-grid">
            {coreValues.map((f, i) => (
              <motion.div 
                key={i} 
                className="about-feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="feature-num"><f.icon size={32} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="section container">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="subtitle">DỊCH VỤ</span>
            <h2 className="title">Gia Công Mỹ Phẩm Trọn Gói</h2>
            <p style={{ maxWidth: '600px', margin: '20px auto 0', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
              Đồng hành cùng khách hàng từ ý tưởng đến sản phẩm hoàn chỉnh
            </p>
          </div>
        </Reveal>
        <div className="about-features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              className="about-feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="feature-num" style={{ color: 'var(--primary-light)' }}><s.icon size={28} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PRODUCT RANGE --- */}
      <section className="section bg-accent">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="subtitle">SẢN PHẨM</span>
              <h2 className="title">Dòng Sản Phẩm Chúng Tôi Sản Xuất</h2>
            </div>
          </Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {products.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: '16px 32px',
                  background: 'white',
                  borderRadius: '100px',
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  cursor: 'default',
                  transition: 'var(--transition)',
                }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VISION SECTION --- */}
      <section className="section container">
        <div className="about-hero-layout" style={{ gap: '80px' }}>
          <div className="about-text-content">
            <Reveal>
              <span className="hero-subtitle" style={{ color: 'var(--secondary)' }}>TẦM NHÌN</span>
              <h2 className="section-title" style={{ fontSize: '2.8rem' }}>Nâng Tầm Chuẩn Mực Mỹ Phẩm An Toàn</h2>
            </Reveal>
            <p className="about-desc">
              Chúng tôi hướng đến sản xuất các sản phẩm mỹ phẩm <strong>An toàn – Minh bạch</strong> góp phần 
              nâng tầm chuẩn mực mỹ phẩm an toàn tại Việt Nam. Nơi mỗi sản phẩm không chỉ làm đẹp bề mặt 
              mà còn tôn trọng, bảo vệ làn da, mái tóc và sức khỏe người tiêu dùng một cách bền vững.
            </p>
            <p className="about-desc">
              Trong một thị trường nhiều lựa chọn, chúng tôi lựa chọn con đường khắt khe hơn: 
              <em> Khắt khe trong nguyên liệu, nghiêm ngặt trong quy trình và minh bạch trong từng thông tin sản phẩm. </em>
              Với định hướng phát triển lâu dài, chúng tôi không chạy theo xu hướng ngắn hạn, mà kiên định xây dựng giá trị cốt lõi dựa trên sự trung thực và trách nhiệm.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
              {[
                { icon: Heart, text: "An toàn cho da, tóc và sức khỏe" },
                { icon: ShieldCheck, text: "Tuân thủ nghiêm ngặt các quy định pháp luật về mỹ phẩm" },
                { icon: Sparkles, text: "Chất lượng ổn định – rõ ràng nguồn gốc – trung thực trong công bố" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--primary)' }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <item.icon size={20} style={{ flexShrink: 0, color: 'var(--secondary)' }} />
                  <span style={{ fontWeight: 600 }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="about-image-collage">
            <div className="img-main">
              <LazyImage src="/assets/images/heritage_bg.png" alt="Tầm nhìn HerbSpaLab" />
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="section bg-accent">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="subtitle">SỨ MỆNH</span>
              <h2 className="title">Xây Dựng Niềm Tin Mỹ Phẩm Việt</h2>
              <p style={{ maxWidth: '700px', margin: '20px auto 0', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Chúng tôi không chỉ tạo ra mỹ phẩm, mà còn góp phần xây dựng niềm tin 
                cho thị trường mỹ phẩm an toàn, hiệu quả và phù hợp với thể trạng người Việt.
              </p>
            </div>
          </Reveal>
          <div className="about-features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {missionPoints.map((m, i) => (
              <motion.div 
                key={i} 
                className="about-feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="feature-num" style={{ color: 'var(--secondary)' }}><m.icon size={28} /></div>
                <p style={{ fontSize: '1rem', lineHeight: 1.8 }}>{m.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COMPANY INFO --- */}
      <section className="section container">
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="subtitle">THÔNG TIN</span>
            <h2 className="title">Thông Tin Doanh Nghiệp</h2>
          </div>
        </Reveal>
        <motion.div 
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '40px',
            padding: '60px',
            border: '1px solid var(--border)',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.06)'
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ display: 'grid', gap: '24px' }}>
            {[
              { label: "Thương hiệu", value: "HerbSpaLab" },
              { label: "Tên quốc tế", value: "THU HUYEN SMILE SPA COMPANY LIMITED" },
              { label: "Mã số thuế", value: "2500712979" },
              { label: "Ngày thành lập", value: "09/01/2024" },
              { label: "Giám đốc", value: "Nguyễn Thị Thu Huyền" },
              { label: "Lĩnh vực", value: "Sản xuất & gia công mỹ phẩm, Spa, Chăm sóc da" },
              { label: "Hotline", value: "0972 245 219" },
              { label: "Địa chỉ ĐKKD", value: "Thôn Phú Ninh, Xã Thanh Vân, Huyện Tam Dương, Tỉnh Vĩnh Phúc" },
              { label: "Cơ sở hoạt động", value: "Ngách 6, ngõ 23, đường Đầm Vạc, Khu 7, Đống Đa, Vĩnh Yên, Vĩnh Phúc" },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                <span style={{ 
                  minWidth: '160px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '1.5px', 
                  color: 'var(--text-muted)', 
                  textTransform: 'uppercase',
                  paddingTop: '2px'
                }}>
                  {row.label}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- CLOSING QUOTE --- */}
      <section className="section container">
        <div className="mission-statement">
          <Reveal>
            <h2 className="statement-text">
              "Một sản phẩm tốt không chỉ nằm ở công thức, mà còn ở sự nghiêm túc trong quy trình sản xuất và trách nhiệm với người tiêu dùng."
            </h2>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
