import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';

const News = () => {
  const articles = [
    {
      id: 1,
      title: "Nghệ thuật xông hơi thảo mộc: Hành trình tìm lại sự tĩnh lặng",
      category: "LIFESTYLE",
      date: "08/05/2026",
      author: "Hana Nguyễn",
      excerpt: "Khám phá bí mật đằng sau những liệu trình xông hơi cổ truyền và cách chúng giúp giải tỏa căng thẳng trong cuộc sống hiện đại.",
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
      featured: true
    },
    {
      id: 2,
      title: "5 Loại thảo mộc giúp trắng da tự nhiên",
      category: "BEAUTY",
      date: "07/05/2026",
      author: "Dr. Lê Minh",
      excerpt: "Nhân sâm, linh chi và những dược liệu quý trong việc nuôi dưỡng làn da trắng hồng rạng rỡ.",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Chế độ ăn uống cho làn da nhạy cảm",
      category: "HEALTH",
      date: "06/05/2026",
      author: "Minh Anh",
      excerpt: "Ăn gì và kiêng gì để bảo vệ hàng rào bảo vệ da khỏi những kích ứng từ môi trường.",
      img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Xu hướng Skincare tối giản năm 2026",
      category: "TRENDS",
      date: "05/05/2026",
      author: "Thảo Vy",
      excerpt: "Tại sao 'Less is More' đang trở thành triết lý sống mới của những tín đồ làm đẹp toàn cầu.",
      img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page editorial-news"
    >
      <SEO title="Editorial Magazine" description="Tạp chí phong cách sống và kiến thức chăm sóc da chuyên sâu từ HerbSpa Lab." />
      
      <div className="container">
        <header className="editorial-header">
          <span className="editorial-subtitle">SINCE 1992</span>
          <h1 className="editorial-title">THE HERB JOURNAL</h1>
          <div className="editorial-divider"></div>
        </header>

        {/* Featured Article */}
        <section className="featured-section">
          {articles.filter(a => a.featured).map(article => (
            <motion.div 
              key={article.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="featured-article"
            >
              <div className="featured-img-wrap">
                <LazyImage src={article.img} alt={article.title} />
              </div>
              <div className="featured-content">
                <span className="cat-tag">{article.category}</span>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <div className="article-meta">
                  <span><User size={14} /> {article.author}</span>
                  <span><Clock size={14} /> {article.date}</span>
                </div>
                <Link to="#" className="read-more-btn">Đọc bài viết <ArrowRight size={18} /></Link>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Article Grid */}
        <div className="editorial-grid">
          {articles.filter(a => !a.featured).map((article, i) => (
            <motion.div 
              key={article.id}
              className={`editorial-card ${i === 1 ? 'large' : ''}`}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="card-img-wrap">
                <LazyImage src={article.img} alt={article.title} />
              </div>
              <div className="card-content">
                <span className="cat-tag">{article.category}</span>
                <h3>{article.title}</h3>
                <Link to="#" className="simple-link">Tiếp tục đọc</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default News;
