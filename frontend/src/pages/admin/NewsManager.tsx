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
      const data = await adminFetchBlogs();
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-4">
        <div>
          <div className="flex items-center gap-3 text-gold font-bold text-[11px] uppercase tracking-[0.3em] mb-2">
            <Newspaper className="w-4 h-4" />
            Editorial Journal
          </div>
          <h1 className="text-5xl font-display italic text-sage leading-tight tracking-tight">Quản lý Tin tức</h1>
          <p className="text-sage/40 text-[12px] font-bold uppercase tracking-[0.2em] mt-2">Truyền tải tri thức thảo mộc & Cảm hứng sống xanh</p>
        </div>
        <button 
          onClick={() => navigate('/admin/news/new')}
          className="px-10 py-4 bg-ink text-white rounded-2xl flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-mint transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Viết bài mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col">
            <div className="aspect-[16/9] relative overflow-hidden">
              <img 
                src={blog.thumbnail || '/assets/images/blog_placeholder.png'} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
                <button 
                  onClick={() => navigate(`/admin/news/${blog.id}`)}
                  className="p-4 bg-white text-ink rounded-2xl shadow-xl hover:scale-110 hover:text-gold transition-all"
                  title="Biên tập"
                >
                  <Edit className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => handleDelete(blog.id)}
                  className="p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"
                  title="Xóa bài viết"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/95 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gold border border-black/5 shadow-sm">
                {blog.category || 'Beauty Tips'}
              </div>
            </div>
            
            <div className="p-10 flex-1 flex flex-col space-y-6">
              <div className="flex items-center gap-6 text-sage/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-gold/60" /> {formatDate(blog.createdAt)}</span>
                <span className="flex items-center gap-2.5"><User className="w-4 h-4 text-gold/60" /> {blog.author || 'Quản trị viên'}</span>
              </div>
              <h3 className="text-2xl font-bold text-sage line-clamp-2 leading-tight group-hover:text-gold transition-colors tracking-tight">{blog.title}</h3>
              <p className="text-sage/40 text-sm line-clamp-3 leading-relaxed font-medium">{blog.excerpt || 'Bài viết chưa có nội dung tóm tắt. Cập nhật ngay để tối ưu trải nghiệm người đọc trên trang chủ...'}</p>
              
              <div className="pt-8 mt-auto border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sage/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Eye className="w-4 h-4" /> {blog.views || 0} lượt xem
                </div>
                <a href={`/news/${blog.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-sage/40 hover:text-gold hover:bg-white rounded-xl transition-all border border-transparent hover:border-black/5 shadow-sm text-[10px] font-bold uppercase tracking-widest">
                  Xem bài đăng <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-black/5 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Newspaper className="w-12 h-12 text-sage/20" />
          </div>
          <h2 className="text-2xl font-bold text-sage mb-3">Chưa có bài viết nào được khởi tạo</h2>
          <p className="text-sage/40 text-sm font-medium uppercase tracking-widest max-w-md mx-auto leading-relaxed">Hãy bắt đầu hành trình truyền cảm hứng bằng những kiến thức thảo mộc quý giá đầu tiên của bạn</p>
          <button 
            onClick={() => navigate('/admin/news/new')}
            className="mt-10 px-12 py-4 bg-ink text-white rounded-2xl font-bold hover:bg-mint transition-all shadow-xl text-[12px] uppercase tracking-[0.2em]"
          >
            Tạo bài viết đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
