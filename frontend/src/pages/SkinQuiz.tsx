import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: "Tình trạng da hiện tại của bạn như thế nào?",
    options: [
      { label: "Bóng dầu và lỗ chân lông to", value: "oily" },
      { label: "Khô, căng thẳng và bong tróc", value: "dry" },
      { label: "Dễ bị kích ứng và mẩn đỏ", value: "sensitive" },
      { label: "Vùng chữ T dầu nhưng vùng khác khô", value: "combination" }
    ]
  },
  {
    id: 2,
    question: "Vấn đề chính bạn muốn cải thiện là gì?",
    options: [
      { label: "Giảm mụn và thâm", value: "acne" },
      { label: "Cấp ẩm và căng bóng", value: "hydration" },
      { label: "Chống lão hóa và nếp nhăn", value: "aging" },
      { label: "Làm sáng và đều màu da", value: "brightening" }
    ]
  },
  {
    id: 3,
    question: "Bạn có thường xuyên tiếp xúc với ánh nắng mặt trời không?",
    options: [
      { label: "Rất thường xuyên", value: "high" },
      { label: "Thỉnh thoảng", value: "medium" },
      { label: "Ít khi", value: "low" }
    ]
  }
];

const SkinQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
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
      className="page container section"
    >
      <div className="quiz-container">
        {!showResult ? (
          <div className="quiz-box">
            <div className="quiz-progress">
              Bước {step + 1} / {questions.length}
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="quiz-content"
              >
                <h2 className="quiz-question">{questions[step].question}</h2>
                <div className="quiz-options">
                  {questions[step].options.map((opt) => (
                    <button 
                      key={opt.value} 
                      className="quiz-opt-btn"
                      onClick={() => handleAnswer(opt.value)}
                    >
                      {opt.label} <ChevronRight size={18} />
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {step > 0 && (
              <button className="quiz-back" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Quay lại
              </button>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="quiz-result"
          >
            <CheckCircle size={64} color="var(--secondary)" />
            <h1>Phân tích hoàn tất!</h1>
            <p>Dựa trên câu trả lời của bạn, chúng tôi đã tìm thấy lộ trình chăm sóc da hoàn hảo.</p>
            
            <div className="recommended-routine">
               <div className="routine-card">
                 <span>LÀM SẠCH</span>
                 <h4>Sữa rửa mặt Thảo mộc Dịu nhẹ</h4>
               </div>
               <div className="routine-card">
                 <span>TRỊ LIỆU</span>
                 <h4>Serum Cấp ẩm Sâu</h4>
               </div>
               <div className="routine-card">
                 <span>BẢO VỆ</span>
                 <h4>Kem chống nắng Vật lý</h4>
               </div>
            </div>

            <Link to="/products" className="btn btn-primary">
              XEM TẤT CẢ SẢN PHẨM GỢI Ý
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SkinQuiz;
