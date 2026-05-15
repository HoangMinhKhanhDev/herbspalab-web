import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Newspaper, Calendar, User, Eye, ExternalLink, ArrowRight, Search, Filter } from 'lucide-react';
import { adminFetchBlogs, adminDeleteBlog } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

const NewsManager: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.tags?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="w-12 h-12 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Đang tải tin tức...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Quản lý Tin tức</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Cập nhật những kiến thức và tin tức mới nhất từ HerbSpaLab.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/news/new')}
          className="flex items-center gap-2 px-6 py-3 bg-[#1a2420] text-white rounded-2xl hover:bg-[#2c3b2e] transition-all font-bold text-sm shadow-xl shadow-[#1a2420]/10 group"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
          Viết bài mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sage w-4 h-4 transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border-none rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all placeholder:text-gray-400"
            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc thẻ..."
          />
        </div>
        <div className="flex items-center gap-2 px-4 text-xs font-bold text-gray-400 bg-gray-50 rounded-xl border border-gray-100 uppercase tracking-widest">
          <Filter size={14} /> Lọc kết quả
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group">
            <div className="aspect-[1.4] relative overflow-hidden bg-gray-100">
              <img 
                src={blog.image || '/assets/images/blog_placeholder.png'} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-sage border border-white/50 shadow-sm">
                {blog.tags?.split(',')[0] || 'Tin tức'}
              </div>
              
              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <a href={`/news/${blog.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-sage transition-colors">
                  Xem bài đăng <ExternalLink size={12} />
                </a>
              </div>
            </div>
            
            <div className="p-7 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-sage" /> {formatDate(blog.createdAt)}</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                <span className="flex items-center gap-1.5"><User size={12} className="text-sage" /> {blog.author || 'Admin'}</span>
              </div>
              
              <h3 className="text-xl font-black text-[#1a2420] tracking-tight line-clamp-2 leading-[1.2] mb-3 group-hover:text-sage transition-colors">{blog.title}</h3>
              <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 flex-1 leading-relaxed">
                {blog.summary || 'Chưa có nội dung tóm tắt cho bài viết này...'}
              </p>
              
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  <Eye size={14} className="text-gray-200" /> {blog.views || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => navigate(`/admin/news/${blog.id}`)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-sage hover:bg-sage/5 rounded-xl transition-all"
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Xóa bỏ"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-dashed border-gray-200 shadow-inner">
          <div className="w-24 h-24 bg-sage/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Newspaper className="w-10 h-10 text-sage/30" />
          </div>
          <h2 className="text-2xl font-black text-[#1a2420] tracking-tight mb-2">Khoảng trống bình yên</h2>
          <p className="text-gray-400 font-medium text-sm mb-10 max-w-sm mx-auto leading-relaxed">Dường như chưa có bài viết nào ở đây hoặc từ khóa tìm kiếm không khớp. Hãy bắt đầu chia sẻ kiến thức của bạn ngay hôm nay!</p>
          <button 
            onClick={() => navigate('/admin/news/new')}
            className="px-8 py-3.5 bg-sage text-white rounded-2xl font-black text-sm hover:bg-sage-dark transition-all shadow-xl shadow-sage/20 flex items-center gap-2 mx-auto"
          >
            Viết bài đầu tiên <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
