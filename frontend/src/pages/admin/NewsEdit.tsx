import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, Globe, Sparkles, ArrowLeft, Link as LinkIcon
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { adminCreateBlog, adminUpdateBlog, adminUploadSingle } from '../../api/adminApi';
import API from '../../api/axios'; // Direct API for details if needed

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
    } catch (error) {
      toast.error('Lỗi khi tải ảnh');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const { data } = await API.get(`/admin/blogs/${id}`);
          setFormData(data);
        } catch (error) {
          toast.error('Lỗi khi tải bài viết');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as any).checked : value
    }));
  };

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
    } catch (error) {
      toast.error('Lỗi khi lưu bài viết');
    }
  };

  if (loading) return <div className="p-20 text-center font-display italic text-sage/40">Đang khởi tạo trình soạn thảo tri thức...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-cream/80 backdrop-blur-xl py-6 z-30 border-b border-sage/5 -mx-4 px-4">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin/news')} className="w-12 h-12 rounded-2xl bg-white border border-sage/10 flex items-center justify-center text-sage hover:text-gold transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Journal Curation
            </div>
            <h1 className="text-3xl font-display font-bold text-sage leading-none">{isEdit ? 'Biên tập bài viết' : 'Khởi tạo nội dung'}</h1>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="px-10 py-3.5 rounded-2xl bg-sage text-white font-bold flex items-center gap-3 hover:bg-sage-dark shadow-xl shadow-sage/20 transition-all transform hover:-translate-y-1">
            <Save className="w-5 h-5 text-gold" />
            {isEdit ? 'Lưu thay đổi' : 'Đăng bài ngay'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 p-10 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Tiêu đề bài viết</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                className="w-full px-8 py-5 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none text-2xl font-display font-bold text-sage transition-all shadow-inner"
                placeholder="Vd: Bí quyết dưỡng da bằng thảo mộc mùa Thu..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Nội dung chuyên sâu</label>
              <div className="rounded-[2rem] overflow-hidden border border-sage/5 shadow-soft luxury-quill">
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

          {/* SEO Section */}
          <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 p-10 space-y-8">
            <h3 className="text-xl font-display font-bold text-sage flex items-center gap-3"><Globe className="w-5 h-5 text-gold" /> Tối ưu hóa SEO</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-sage/30 uppercase tracking-[0.2em] ml-2">Meta Title</label>
                <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full px-6 py-4 rounded-xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-sage/30 uppercase tracking-[0.2em] ml-2">Meta Description</label>
                <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={3} className="w-full px-6 py-4 rounded-xl bg-cream border border-sage/5 focus:border-gold outline-none font-medium text-sage resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 p-8 space-y-8 sticky top-36">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Ảnh đại diện (Thumbnail)</label>
                <div 
                  onClick={() => document.getElementById('news-thumbnail')?.click()}
                  className="aspect-[4/3] rounded-[2rem] bg-cream border-2 border-dashed border-sage/10 relative overflow-hidden group cursor-pointer hover:border-gold/30 transition-all"
                >
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-sage/20 group-hover:text-gold transition-colors">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Tải ảnh lên</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
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

              <div className="space-y-3">
                <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Đường dẫn tĩnh (Slug)</label>
                <div className="relative group">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                  <input name="slug" value={formData.slug} onChange={handleInputChange} className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none text-xs font-bold text-sage" placeholder="vd: bi-quyet-duong-da" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Chuyên mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-6 py-3.5 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage text-sm cursor-pointer">
                  <option>Beauty Tips</option>
                  <option>Knowledge</option>
                  <option>Herb Life</option>
                  <option>Spa News</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Tóm tắt (Excerpt)</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={4} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none text-xs font-medium text-sage leading-relaxed resize-none" placeholder="Viết một đoạn ngắn dẫn dắt độc giả..." />
              </div>
            </div>

            <div className="pt-6 border-t border-sage/5">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-bold text-sage">Công khai bài viết</span>
                <div className={`w-12 h-6 rounded-full transition-all relative ${formData.isPublished ? 'bg-sage' : 'bg-sage/10'}`}>
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
