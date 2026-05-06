import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const News = () => {
  const articles = [1, 2, 3, 4, 5, 6];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page container section"
    >
      <div className="section-header">
        <h1 className="news-title">Tạp chí Da liễu</h1>
      </div>
      <div className="news-layout">
        {articles.map((i) => (
          <motion.div 
            key={i} 
            className="news-article"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.1 }}
          >
            <div className="article-img"></div>
            <div className="article-info">
              <span className="article-meta">KIẾN THỨC • 05/05/2026</span>
              <h3>Cách phục hồi hàng rào bảo vệ da tự nhiên</h3>
              <p>Hàng rào bảo vệ da là yếu tố then chốt để duy trì độ ẩm và ngăn ngừa các tác nhân gây hại từ môi trường...</p>
              <Link to="#" className="article-link">Đọc bài viết <ArrowRight size={16} /></Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default News;
