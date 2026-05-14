import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, Newspaper, Sparkles, ArrowLeft, Loader2, Globe, FileText, CheckCircle, Link as LinkIcon
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { adminFetchBlogById, adminCreateBlog, adminUpdateBlog, adminUploadSingle } from '../../api/adminApi';
import API from '../../api/axios';

const NewsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== 'new';

  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    category: 'Beauty Tips',
    thumbnail: '',
    excerpt: '',
    content: '',
    author: 'Administrator',
    metaTitle: '',
    metaDescription: '',
    isPublished: true
  });

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await adminUploadSingle(file);
      setFormData((prev: any) => ({ ...prev, thumbnail: data.url }));
      toast.success('Tải ảnh đại diện thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải ảnh');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const data = await adminFetchBlogById(id!);
          setFormData(data);
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Lỗi khi tải bài viết');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev: any) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as any).checked : value
      };
      if (name === 'title' && !isEdit) {
        newData.slug = String(value).toLowerCase()
          .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
          .replace(/[èéẹẻẽêềếệểễ]/g, "e")
          .replace(/[ìíịỉĩ]/g, "i")
          .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
          .replace(/[ùúụủũưừứựửữ]/g, "u")
          .replace(/[ỳýỵỷỹ]/g, "y")
          .replace(/đ/g, "d")
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-");
      }
      return newData;
    });
  };

  const calculateReadTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return time;
  };

  const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;

  const handleSave = async () => {
    try {
      if (isEdit) {
        await adminUpdateBlog(id!, formData);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await adminCreateBlog(formData);
        toast.success('Đăng bài viết thành công');
        navigate('/admin/news');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu bài viết');
    }
  };

  if (loading) return <div className="p-20 text-center font-display italic text-sage/60">Đang khởi tạo trình soạn thảo tri thức...</div>;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-48 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Enhanced Header - High Visibility */}
      <div className="flex flex-col xl:flex-row items-center justify-between sticky top-0 bg-cream/95 backdrop-blur-xl py-8 z-40 border-b border-black/5 -mx-4 px-12 gap-8 shadow-sm">
        <div className="flex items-center gap-8 w-full xl:w-auto">
          <button onClick={() => navigate('/admin/news')} className="p-4 rounded-2xl bg-white border border-black/5 text-sage/20 hover:text-gold hover:shadow-md transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-3 text-gold font-bold text-[11px] uppercase tracking-[0.3em] mb-2">
              <Sparkles className="w-4 h-4" />
              Knowledge Content Editor
            </div>
            <h1 className="text-4xl font-display italic text-sage leading-tight tracking-tight">{isEdit ? 'Biên tập Bài viết' : 'Sáng tạo Nội dung mới'}</h1>
            <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-sage/30 uppercase tracking-widest">
              <span>{wordCount} từ</span>
              <span className="w-1 h-1 bg-sage/20 rounded-full" />
              <span>~{calculateReadTime(formData.content)} phút đọc</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 w-full xl:w-auto justify-end">
          <button onClick={() => navigate('/admin/news')} className="px-8 py-4 rounded-2xl border border-black/5 text-sage/40 text-[12px] font-bold uppercase tracking-widest hover:text-sage hover:bg-white transition-all">Hủy bỏ</button>
          <button onClick={handleSave} className="px-12 py-4 rounded-2xl bg-ink text-white text-[12px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-mint transition-all shadow-xl">
            <Save className="w-5 h-5" />
            {isEdit ? 'Cập nhật hệ thống' : 'Xuất bản bài viết'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white rounded-[3rem] border border-black/5 p-12 sm:p-16 space-y-10 shadow-sm">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">Tiêu đề nội dung</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                className="w-full px-10 py-6 rounded-3xl bg-gray-50 border border-black/5 focus:border-gold outline-none text-3xl font-bold text-sage transition-all shadow-inner placeholder:text-sage/10"
                placeholder="Nhập tiêu đề thu hút khách hàng..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">Nội dung chi tiết (Rich Text)</label>
              <div className="rounded-[2.5rem] overflow-hidden border border-black/5 luxury-quill shadow-sm">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData((prev: any) => ({ ...prev, content }))}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
              </div>
            </div>
          </div>

          {/* SEO Optimization Area */}
          <div className="bg-white rounded-[3rem] border border-black/5 p-12 sm:p-16 space-y-10 shadow-sm">
            <h3 className="text-xl font-black text-sage flex items-center gap-3 uppercase tracking-[0.2em]"><Globe className="w-6 h-6 text-gold" /> Tối ưu hóa tìm kiếm (SEO)</h3>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">SEO Meta Title</label>
                <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-black/5 focus:border-gold outline-none font-bold text-sage text-lg shadow-inner" placeholder="Tiêu đề chuẩn SEO (Dưới 60 ký tự)..." />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">SEO Meta Description</label>
                <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={4} className="w-full px-8 py-6 rounded-3xl bg-gray-50 border border-black/5 focus:border-gold outline-none font-medium text-sage text-base resize-none shadow-inner leading-relaxed" placeholder="Mô tả tóm tắt cho công cụ tìm kiếm..." />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings - High Visibility */}
        <div className="space-y-10">
          <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 space-y-10 sticky top-40 shadow-sm">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">Hình ảnh đại diện bài viết</label>
                <div 
                  onClick={() => document.getElementById('news-thumbnail')?.click()}
                  className="aspect-[4/3] rounded-[2rem] bg-gray-50 border-2 border-dashed border-black/5 relative overflow-hidden group cursor-pointer hover:border-gold/30 hover:bg-white transition-all shadow-inner"
                >
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-sage/10 group-hover:text-gold transition-all">
                      <ImageIcon className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tải ảnh lên</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-mint border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <input 
                  id="news-thumbnail" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleThumbnailUpload} 
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">Đường dẫn tĩnh (Slug)</label>
                <div className="relative group">
                  <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/30 group-focus-within:text-gold transition-colors" />
                  <input name="slug" value={formData.slug} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-gold outline-none text-sm font-bold text-sage transition-all shadow-inner" placeholder="vd: xu-huong-lam-dep-2024" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">Phân loại chuyên mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-gold outline-none font-bold text-sage text-sm cursor-pointer transition-all shadow-inner appearance-none">
                  <option>Beauty Tips</option>
                  <option>Knowledge</option>
                  <option>Herb Life</option>
                  <option>Spa News</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gold uppercase tracking-[0.3em] ml-1">Dẫn dắt ngắn (Excerpt)</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={5} className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-black/5 focus:border-gold outline-none text-sm font-medium text-sage leading-relaxed resize-none transition-all shadow-inner" placeholder="Tóm tắt nội dung để thu hút người đọc..." />
              </div>
            </div>

            <div className="pt-8 border-t border-black/5">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[11px] font-black text-sage uppercase tracking-[0.2em]">Trạng thái xuất bản</span>
                <div className={`w-12 h-6 rounded-full transition-all relative ${formData.isPublished ? 'bg-mint' : 'bg-gray-200 shadow-inner'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPublished ? 'right-1 shadow-md' : 'left-1'}`} />
                </div>
                <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEdit;
