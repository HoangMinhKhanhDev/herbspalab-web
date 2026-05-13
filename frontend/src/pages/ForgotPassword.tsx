import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call for now
      // In a real app, this would call your backend to send a reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err: any) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="auth-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <Link to="/login" className="back-link">
          <ChevronLeft size={18} /> Quay lại đăng nhập
        </Link>

        <div className="auth-header">
          <h2>Quên mật khẩu?</h2>
          <p>Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu</p>
        </div>

        {success ? (
          <motion.div 
            className="auth-success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} color="var(--secondary)" />
            </div>
            <h3>Kiểm tra email của bạn</h3>
            <p>Chúng tôi đã gửi link khôi phục mật khẩu tới <strong>{email}</strong></p>
            <button 
              className="auth-submit-btn" 
              onClick={() => setSuccess(false)}
              style={{ marginTop: '2rem' }}
            >
              Gửi lại email
            </button>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="auth-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    Gửi yêu cầu <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
    </motion.div>
  );
};

export default ForgotPassword;
