import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ChevronRight, MapPin, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { createOrder } from '../api/orderApi';
import toast from 'react-hot-toast';

const steps = ['Thông tin', 'Thanh toán', 'Hoàn tất'];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Hà Nội',
    paymentMethod: 'Stripe'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) {
      setCurrentStep(0);
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    try {
      setLoading(true);
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
          name: formData.name
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: cartTotal + 30000,
      };

      const { data } = await createOrder(orderData);
      
      if (data.stripeUrl) {
        window.location.href = data.stripeUrl;
      } else {
        setOrderId(data.id);
        clearCart();
        nextStep();
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

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
      <SEO title="Thanh toán an toàn" />
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
                    <div className="input-wrap">
                      <input type="text" placeholder="Họ và tên" className={`premium-input ${errors.name ? 'input-error' : ''}`} value={formData.name} onChange={(e) => { setFormData({...formData, name: e.target.value}); setErrors({...errors, name: ''}); }} />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>
                    <div className="input-wrap">
                      <input type="text" placeholder="Số điện thoại" className={`premium-input ${errors.phone ? 'input-error' : ''}`} value={formData.phone} onChange={(e) => { setFormData({...formData, phone: e.target.value}); setErrors({...errors, phone: ''}); }} />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                    <div className="input-wrap full">
                      <input type="text" placeholder="Địa chỉ chi tiết" className={`premium-input ${errors.address ? 'input-error' : ''}`} value={formData.address} onChange={(e) => { setFormData({...formData, address: e.target.value}); setErrors({...errors, address: ''}); }} />
                      {errors.address && <span className="field-error">{errors.address}</span>}
                    </div>
                    <select className="premium-input" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}>
                      <option>Hà Nội</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                  <button className="btn btn-primary w-full mt-30" onClick={() => { if (validateShipping()) nextStep(); }}>
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
                    <label className={`payment-card ${formData.paymentMethod === 'Stripe' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="Stripe" checked={formData.paymentMethod === 'Stripe'} onChange={() => setFormData({...formData, paymentMethod: 'Stripe'})} />
                      <div className="payment-info">
                        <strong>Thanh toán trực tuyến (Stripe)</strong>
                        <span>Thanh toán an toàn qua thẻ Quốc tế/Nội địa</span>
                      </div>
                    </label>
                    <label className={`payment-card ${formData.paymentMethod === 'COD' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="COD" checked={formData.paymentMethod === 'COD'} onChange={() => setFormData({...formData, paymentMethod: 'COD'})} />
                      <div className="payment-info">
                        <strong>Thanh toán khi nhận hàng (COD)</strong>
                        <span>Trả tiền mặt cho người giao hàng</span>
                      </div>
                    </label>
                  </div>
                  <div className="checkout-actions">
                    <button className="btn-back" onClick={prevStep}><ArrowLeft size={16} /> Quay lại</button>
                    <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>
                      {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                    </button>
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
                  <p>Mã đơn hàng của bạn là <strong>#{orderId.slice(-8).toUpperCase()}</strong>. Chúng tôi sẽ sớm liên hệ để xác nhận.</p>
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
