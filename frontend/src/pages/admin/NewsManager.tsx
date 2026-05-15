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

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tức</h1>
          <p className="text-sm text-gray-500">Danh sách các bài viết, tin tức trên hệ thống</p>
        </div>
        <button 
          onClick={() => navigate('/admin/news/new')}
          className="px-4 py-2 bg-sage text-white rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-sage/90 transition-colors"
        >
          <Plus size={16} />
          Viết bài mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
              <img 
                src={blog.image || '/assets/images/blog_placeholder.png'} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-[10px] font-bold uppercase text-sage border border-gray-200">
                {blog.tags?.split(',')[0] || 'Tin tức'}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-gray-500 text-xs mb-3">
                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(blog.createdAt)}</span>
                <span className="flex items-center gap-1"><User size={12} /> {blog.author || 'Admin'}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-sage transition-colors">{blog.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                {blog.summary || 'Chưa có nội dung tóm tắt...'}
              </p>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Eye size={14} /> {blog.views || 0} lượt xem
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/news/${blog.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-sage hover:bg-sage/10 rounded transition-colors" title="Xem bài">
                    <ExternalLink size={16} />
                  </a>
                  <button 
                    onClick={() => navigate(`/admin/news/${blog.id}`)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="bg-white rounded-xl p-20 text-center border border-gray-200 shadow-sm">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Chưa có bài viết nào</h2>
          <p className="text-gray-500 text-sm mb-6">Hãy tạo bài viết đầu tiên để chia sẻ thông tin với khách hàng.</p>
          <button 
            onClick={() => navigate('/admin/news/new')}
            className="px-6 py-2 bg-sage text-white rounded-lg text-sm font-bold hover:bg-sage/90 transition-colors"
          >
            Tạo bài viết
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
