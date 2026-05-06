import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="auth-page"
    >
      <div className="auth-container">
        <div className="auth-header">
          <h1>Chào mừng trở lại</h1>
          <p>Đăng nhập để tiếp tục hành trình chăm sóc da cùng Herbspa Lab</p>
        </div>
        <form className="auth-form">
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
          <div className="form-utils">
            <label className="checkbox-label">
              <input type="checkbox" /> Ghi nhớ đăng nhập
            </label>
            <Link to="#" className="forgot-link">Quên mật khẩu?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Đăng nhập <ArrowRight size={18} />
          </button>
        </form>
        <div className="auth-footer">
          <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
