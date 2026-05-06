import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="auth-page"
    >
      <div className="auth-container">
        <div className="auth-header">
          <h1>Tham gia Herbspa Lab</h1>
          <p>Bắt đầu hành trình nuôi dưỡng làn da thuần khiết cùng chúng tôi</p>
        </div>
        <form className="auth-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <div className="input-wrapper">
              <User size={18} />
              <input type="text" placeholder="Nguyễn Văn A" />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input type="email" placeholder="email@example.com" />
            </div>
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input type="password" placeholder="••••••••" />
            </div>
          </div>
          <p className="terms-text">
            Bằng cách đăng ký, bạn đồng ý với <Link to="#">Điều khoản sử dụng</Link> và <Link to="#">Chính sách bảo mật</Link> của chúng tôi.
          </p>
          <button type="submit" className="btn btn-primary btn-block">
            Đăng ký tài khoản <ArrowRight size={18} />
          </button>
        </form>
        <div className="auth-footer">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
