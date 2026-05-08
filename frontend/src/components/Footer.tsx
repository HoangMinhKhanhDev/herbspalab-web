import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, ArrowRight, Phone, MapPin } from 'lucide-react';

export const Footer = () => (
  <footer className="modern-footer" role="contentinfo" aria-label="Chân trang">
    <div className="container footer-main">
      <div className="footer-intro">
        <div className="footer-logo-wrap">
          <img src="/assets/images/logo.svg" alt="HerbSpaLab Logo" className="footer-logo-img" />
          <h2 className="brand-logo">HERBSPALAB</h2>
        </div>
        <p>Sản xuất và gia công Mỹ phẩm với định hướng An toàn cho sức khỏe – Minh bạch pháp lý – Đồng hành cùng thương hiệu Việt.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={14} /> <span>Hotline: <strong>0972 245 219</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Ngách 6, ngõ 23, đường Đầm Vạc, Khu 7, Đống Đa, Vĩnh Yên, Vĩnh Phúc</span>
          </div>
        </div>
        <div className="footer-social" aria-label="Liên kết mạng xã hội">
          <a href="https://www.facebook.com/profile.php?id=100063609218498" target="_blank" rel="noopener noreferrer" aria-label="Facebook Fanpage"><Globe size={20} aria-hidden="true" /></a>
          <a href="#" aria-label="Chia sẻ qua mạng xã hội"><Share2 size={20} aria-hidden="true" /></a>
          <a href="mailto:contact@thuhuyen-smilespa.com" aria-label="Gửi email cho chúng tôi"><Mail size={20} aria-hidden="true" /></a>
        </div>
      </div>
      <nav className="footer-nav-col" aria-label="Liên kết công ty">
        <h4>CÔNG TY</h4>
        <Link to="/about">Giới thiệu công ty</Link>
        <Link to="/about">Tầm nhìn & Sứ mệnh</Link>
        <Link to="/products">Sản phẩm</Link>
        <Link to="/news">Tin tức</Link>
      </nav>
      <nav className="footer-nav-col" aria-label="Liên kết dịch vụ">
        <h4>DỊCH VỤ</h4>
        <Link to="/about">Gia công mỹ phẩm</Link>
        <Link to="/skin-quiz">Tư vấn công thức</Link>
        <Link to="/about">Trị mụn chuyên sâu</Link>
        <Link to="/about">Chăm sóc da</Link>
      </nav>
      <div className="footer-newsletter">
        <h4>NHẬN TIN TỨC</h4>
        <p>Đăng ký để nhận những cập nhật mới nhất về sản phẩm và ưu đãi.</p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="newsletter-email" className="sr-only">Địa chỉ Email của bạn</label>
          <input 
            id="newsletter-email"
            type="email" 
            placeholder="Email của bạn" 
            required 
            aria-required="true"
          />
          <button type="submit" aria-label="Đăng ký nhận tin"><ArrowRight size={18} aria-hidden="true" /></button>
        </form>
      </div>
    </div>
    <div className="footer-copyright">
      <p>© 2024 HerbSpaLab. MST: 2500712979. Giám đốc: Nguyễn Thị Thu Huyền.</p>
    </div>
  </footer>
);
