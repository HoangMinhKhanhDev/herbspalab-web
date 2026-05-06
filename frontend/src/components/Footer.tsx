import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, ArrowRight } from 'lucide-react';

export const Footer = () => (
  <footer className="modern-footer" role="contentinfo" aria-label="Chân trang">
    <div className="container footer-main">
      <div className="footer-intro">
        <h2 className="brand-logo">HERBSPA LAB</h2>
        <p>Kiến tạo vẻ đẹp bền vững từ lòng đất mẹ. Chúng tôi mang đến những giải pháp chăm sóc da thuần chay, an toàn và hiệu quả cao.</p>
        <div className="footer-social" aria-label="Liên kết mạng xã hội">
          <a href="#" aria-label="Website chính thức"><Globe size={20} aria-hidden="true" /></a>
          <a href="#" aria-label="Chia sẻ qua mạng xã hội"><Share2 size={20} aria-hidden="true" /></a>
          <a href="mailto:contact@herbspalab.com" aria-label="Gửi email cho chúng tôi"><Mail size={20} aria-hidden="true" /></a>
        </div>
      </div>
      <nav className="footer-nav-col" aria-label="Liên kết công ty">
        <h4>CÔNG TY</h4>
        <Link to="/about">Câu chuyện thương hiệu</Link>
        <Link to="/news">Tạp chí làm đẹp</Link>
        <Link to="#">Tuyển dụng</Link>
        <Link to="#">Liên hệ</Link>
      </nav>
      <nav className="footer-nav-col" aria-label="Liên kết hỗ trợ">
        <h4>HỖ TRỢ</h4>
        <Link to="#">Chính sách đổi trả</Link>
        <Link to="#">Vận chuyển & Giao nhận</Link>
        <Link to="#">Điều khoản sử dụng</Link>
        <Link to="#">Bảo mật thông tin</Link>
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
      <p>© 2026 Herbspa Lab. Thiết kế chuyên nghiệp cho làn da của bạn.</p>
    </div>
  </footer>
);
