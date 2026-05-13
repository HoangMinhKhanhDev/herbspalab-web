import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Newspaper, Calendar, User, Eye, ExternalLink } from 'lucide-react';
import { adminFetchBlogs, adminDeleteBlog } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

const NewsManager: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const { data } = await adminFetchBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await adminDeleteBlog(id);
      toast.success('Đã xóa bài viết');
      loadBlogs();
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết');
    }
  };

  if (loading) return <div className="p-20 text-center font-display italic text-sage/40">Đang chuẩn bị thư viện tri thức...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Newspaper className="w-4 h-4" />
            Botanical Journal
          </div>
          <h1 className="text-4xl font-display font-bold text-sage">Quản lý Tin tức</h1>
          <p className="text-sage/60 text-lg italic mt-1">Chia sẻ kiến thức làm đẹp và câu chuyện về thảo mộc tự nhiên.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/news/new')}
          className="px-8 py-3.5 bg-sage text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-sage-dark shadow-xl shadow-sage/20 transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5 text-gold" />
          Viết bài mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-[2.5rem] shadow-premium border border-sage/5 overflow-hidden group hover:shadow-2xl transition-all duration-700">
            <div className="aspect-[16/10] relative overflow-hidden">
              <img 
                src={blog.thumbnail || '/assets/images/blog_placeholder.png'} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => navigate(`/admin/news/${blog.id}`)}
                    className="flex-1 py-3 bg-white text-sage rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold hover:text-sage-dark transition-all"
                  >
                    <Edit className="w-4 h-4" /> Biên tập
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="w-12 h-12 bg-red-500/20 backdrop-blur-md text-red-100 rounded-xl flex items-center justify-center hover:bg-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-sage border border-white/20">
                {blog.category || 'Beauty Tips'}
              </div>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4 text-sage/30 text-[10px] font-bold uppercase tracking-[0.15em]">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gold/60" /> {formatDate(blog.createdAt)}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gold/60" /> {blog.author || 'Admin'}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-sage line-clamp-2 leading-tight group-hover:text-gold transition-colors">{blog.title}</h3>
              <p className="text-sage/60 text-sm line-clamp-3 italic leading-relaxed">{blog.excerpt || 'Đang cập nhật nội dung tóm tắt cho bài viết này...'}</p>
              
              <div className="pt-4 border-t border-sage/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sage/40 text-[10px] font-black uppercase tracking-widest">
                  <Eye className="w-4 h-4" /> {blog.views || 0} lượt xem
                </div>
                <a href={`/news/${blog.slug}`} target="_blank" rel="noreferrer" className="text-gold hover:text-sage transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="bg-white rounded-[3.5rem] p-32 text-center border border-sage/5 shadow-soft">
          <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Newspaper className="w-12 h-12 text-sage/10" />
          </div>
          <h2 className="text-2xl font-display font-bold text-sage mb-2">Thư viện tin tức còn trống</h2>
          <p className="text-sage/40 italic">Bắt đầu hành trình truyền cảm hứng bằng cách viết bài đầu tiên của bạn.</p>
          <button 
            onClick={() => navigate('/admin/news/new')}
            className="mt-8 px-10 py-4 bg-sage text-white rounded-2xl font-bold hover:bg-sage-dark transition-all shadow-xl shadow-sage/20"
          >
            Tạo bài viết ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
