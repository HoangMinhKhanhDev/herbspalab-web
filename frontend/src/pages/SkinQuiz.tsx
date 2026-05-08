import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles, Droplets, ShieldAlert, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';

interface QuestionOption {
  label: string;
  desc: string;
  value: string;
  img?: string;
  icon?: React.ReactNode;
}

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Tình trạng da hiện tại của bạn như thế nào?",
    subtitle: "Chọn đặc điểm gần nhất với cảm giác trên da bạn hàng ngày.",
    options: [
      { label: "Bóng dầu", desc: "Da thường xuyên đổ dầu, lỗ chân lông to", value: "oily", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80" },
      { label: "Da Khô", desc: "Cảm giác căng, bong tróc và thiếu ẩm", value: "dry", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=300&q=80" },
      { label: "Nhạy cảm", desc: "Dễ mẩn đỏ, ngứa hoặc châm chích", value: "sensitive", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80" },
      { label: "Hỗn hợp", desc: "Dầu vùng T nhưng khô ở hai bên má", value: "combination", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80" }
    ]
  },
  {
    id: 2,
    question: "Mục tiêu lớn nhất bạn muốn đạt được?",
    subtitle: "Chúng tôi sẽ ưu tiên giải pháp cho vấn đề này.",
    options: [
      { label: "Trị Mụn", desc: "Làm sạch sâu và giảm viêm nhiễm", value: "acne", icon: <ShieldAlert className="qv-icon" /> },
      { label: "Căng Bóng", desc: "Cấp ẩm tầng sâu và tạo độ bóng khỏe", value: "hydration", icon: <Droplets className="qv-icon" /> },
      { label: "Trẻ Hóa", desc: "Giảm nếp nhăn và tăng độ đàn hồi", value: "aging", icon: <Sparkles className="qv-icon" /> },
      { label: "Sáng Da", desc: "Mờ thâm nám và đều màu da", value: "brightening", icon: <Sun className="qv-icon" /> }
    ]
  },
  {
    id: 3,
    question: "Bạn thường chăm sóc da vào lúc nào?",
    subtitle: "Điều này giúp chúng tôi tối ưu lộ trình sáng/tối.",
    options: [
      { label: "Chỉ buổi sáng", desc: "Bảo vệ da trước tác động môi trường", value: "morning", icon: <Sun /> },
      { label: "Chỉ buổi tối", desc: "Phục hồi da trong khi ngủ", value: "night", icon: <Moon /> },
      { label: "Cả hai", desc: "Lộ trình toàn diện 24/7", value: "both", icon: <Sparkles /> }
    ]
  }
];

const SkinQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[step].id]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page skin-quiz-2"
    >
      <SEO title="Skin Analysis 2.0" description="Trắc nghiệm phân tích da chuyên sâu để tìm ra liệu trình thảo mộc phù hợp nhất." />
      
      <div className="quiz-overlay-bg" />

      <div className="container quiz-wrapper">
        {!showResult ? (
          <div className="quiz-flow">
            <header className="quiz-header">
              <div className="step-indicator">BƯỚC {step + 1} / {questions.length}</div>
              <div className="quiz-progress-track">
                <motion.div 
                  className="quiz-progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="quiz-step"
              >
                <div className="question-text">
                  <h1>{questions[step].question}</h1>
                  <p>{questions[step].subtitle}</p>
                </div>

                <div className="visual-options">
                  {questions[step].options.map((opt) => (
                    <motion.button 
                      key={opt.value} 
                      className="visual-opt-card"
                      whileHover={{ y: -10, borderColor: "var(--secondary)" }}
                      onClick={() => handleAnswer(opt.value)}
                    >
                      {opt.img && <div className="opt-img"><LazyImage src={opt.img} alt={opt.label} /></div>}
                      {opt.icon && <div className="opt-icon">{opt.icon}</div>}
                      <div className="opt-content">
                        <h3>{opt.label}</h3>
                        <p>{opt.desc}</p>
                      </div>
                      <div className="select-circle"><CheckCircle size={20} /></div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="quiz-nav-footer">
              {step > 0 && (
                <button className="back-btn" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={18} /> QUAY LẠI
                </button>
              )}
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="quiz-result-v2"
          >
            <div className="result-header">
              <Sparkles className="spark-icon" />
              <h1>Kết quả Phân tích</h1>
              <p>Dựa trên câu trả lời, chúng tôi đã tìm thấy lộ trình hoàn hảo cho bạn.</p>
            </div>

            <div className="result-card">
              <div className="analysis-summary">
                <div className="analysis-item">
                  <span className="label">Loại da</span>
                  <span className="value">{answers[1].toUpperCase()}</span>
                </div>
                <div className="analysis-item">
                  <span className="label">Mục tiêu</span>
                  <span className="value">{answers[2].toUpperCase()}</span>
                </div>
              </div>

              <div className="suggested-routine">
                <h3>Lộ trình Đề xuất</h3>
                <div className="routine-grid">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="routine-step">
                      <div className="step-num">{i}</div>
                      <div className="step-info">
                        <h4>Bước {i === 1 ? 'Làm sạch' : i === 2 ? 'Điều trị' : 'Bảo vệ'}</h4>
                        <p>Sử dụng tinh chất thảo mộc để tối ưu hóa kết quả.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="result-actions">
                <Link to="/products" className="btn btn-primary">XEM BỘ SẢN PHẨM PHÙ HỢP</Link>
                <button className="btn btn-outline" onClick={() => window.print()}>TẢI BÁO CÁO PDF</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SkinQuiz;
