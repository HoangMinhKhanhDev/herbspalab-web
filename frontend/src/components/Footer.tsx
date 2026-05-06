import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, ArrowRight } from 'lucide-react';

export const Footer = () => (
  <footer className="modern-footer">
    <div className="container footer-main">
      <div className="footer-intro">
        <h2 className="brand-logo">HERBSPA LAB</h2>
        <p>Kiến tạo vẻ đẹp bền vững từ lòng đất mẹ. Chúng tôi mang đến những giải pháp chăm sóc da thuần chay, an toàn và hiệu quả cao.</p>
        <div className="footer-social">
          <Globe size={20} />
          <Share2 size={20} />
          <Mail size={20} />
        </div>
      </div>
      <div className="footer-nav-col">
        <h4>CÔNG TY</h4>
        <Link to="/about">Câu chuyện thương hiệu</Link>
        <Link to="/news">Tạp chí làm đẹp</Link>
        <Link to="#">Tuyển dụng</Link>
        <Link to="#">Liên hệ</Link>
      </div>
      <div className="footer-nav-col">
        <h4>HỖ TRỢ</h4>
        <Link to="#">Chính sách đổi trả</Link>
        <Link to="#">Vận chuyển & Giao nhận</Link>
        <Link to="#">Điều khoản sử dụng</Link>
        <Link to="#">Bảo mật thông tin</Link>
      </div>
      <div className="footer-newsletter">
        <h4>NHẬN TIN TỨC</h4>
        <p>Đăng ký để nhận những cập nhật mới nhất về sản phẩm và ưu đãi.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Email của bạn" />
          <button><ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
    <div className="footer-copyright">
      <p>© 2026 Herbspa Lab. Thiết kế chuyên nghiệp cho làn da của bạn.</p>
    </div>
  </footer>
);
