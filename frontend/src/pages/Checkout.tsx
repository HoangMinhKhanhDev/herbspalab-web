import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ChevronRight, MapPin, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = ['Thông tin', 'Thanh toán', 'Hoàn tất'];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { cart, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  if (cart.length === 0 && currentStep < 2) {
    return (
      <div className="container section text-center">
        <h2>Giỏ hàng của bạn đang trống</h2>
        <Link to="/products" className="btn btn-primary mt-20">QUAY LẠI CỬA HÀNG</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="page container section"
    >
      <div className="checkout-container">
        {/* Progress Stepper */}
        <div className="checkout-stepper">
          {steps.map((step, i) => (
            <div key={step} className={`step-item ${i <= currentStep ? 'active' : ''}`}>
              <div className="step-number">{i + 1}</div>
              <span className="step-label">{step}</span>
              {i < steps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="checkout-form"
                >
                  <h3><MapPin size={20} /> Thông tin giao hàng</h3>
                  <div className="form-grid">
                    <input type="text" placeholder="Họ và tên" className="premium-input" />
                    <input type="text" placeholder="Số điện thoại" className="premium-input" />
                    <input type="text" placeholder="Địa chỉ chi tiết" className="premium-input full" />
                    <select className="premium-input">
                      <option>Thành phố / Tỉnh</option>
                      <option>Hà Nội</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                  <button className="btn btn-primary w-full mt-30" onClick={nextStep}>
                    TIẾP TỤC THANH TOÁN <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="checkout-form"
                >
                  <h3><CreditCard size={20} /> Phương thức thanh toán</h3>
                  <div className="payment-options">
                    <label className={`payment-card ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData({...formData, paymentMethod: 'cod'})} />
                      <div className="payment-info">
                        <strong>Thanh toán khi nhận hàng (COD)</strong>
                        <span>Thanh toán bằng tiền mặt khi giao hàng</span>
                      </div>
                    </label>
                    <label className={`payment-card ${formData.paymentMethod === 'bank' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="bank" checked={formData.paymentMethod === 'bank'} onChange={() => setFormData({...formData, paymentMethod: 'bank'})} />
                      <div className="payment-info">
                        <strong>Chuyển khoản ngân hàng</strong>
                        <span>Chuyển khoản qua ứng dụng ngân hàng hoặc Momo</span>
                      </div>
                    </label>
                  </div>
                  <div className="checkout-actions">
                    <button className="btn-back" onClick={prevStep}><ArrowLeft size={16} /> Quay lại</button>
                    <button className="btn btn-primary" onClick={nextStep}>XÁC NHẬN ĐẶT HÀNG</button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="order-success"
                >
                  <CheckCircle size={80} color="var(--secondary)" />
                  <h1>Đặt hàng thành công!</h1>
                  <p>Mã đơn hàng của bạn là <strong>#HSB-9921</strong>. Chúng tôi sẽ sớm liên hệ để xác nhận.</p>
                  <Link to="/products" className="btn btn-primary mt-30">TIẾP TỤC MUA SẮM</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentStep < 2 && (
            <aside className="checkout-summary">
              <h3>Đơn hàng của bạn</h3>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <p>{item.name}</p>
                      <span>x{item.quantity}</span>
                    </div>
                    <p className="item-price">{(item.price * item.quantity).toLocaleString()}₫</p>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="total-row">
                  <span>Tạm tính</span>
                  <span>{cartTotal.toLocaleString()}₫</span>
                </div>
                <div className="total-row">
                  <span>Phí vận chuyển</span>
                  <span>30.000₫</span>
                </div>
                <div className="total-row grand-total">
                  <span>TỔNG CỘNG</span>
                  <span>{(cartTotal + 30000).toLocaleString()}₫</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
