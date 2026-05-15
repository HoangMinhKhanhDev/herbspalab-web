import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, ArrowLeft, Globe, Link as LinkIcon, 
  ChevronDown, ChevronUp, FileText, Send, Eye, CheckCircle2, 
  AlertCircle, User, Tag, Sparkles
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { adminFetchBlogById, adminCreateBlog, adminUpdateBlog, adminUploadSingle } from '../../api/adminApi';

const NewsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== 'new';

  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    tags: 'Beauty Tips',
    image: '',
    summary: '',
    content: '',
    author: 'Administrator',
    metaTitle: '',
    metaDescription: '',
    isPublished: true
  });

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

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await adminUploadSingle(file);
      setFormData((prev: any) => ({ ...prev, image: data.url }));
      toast.success('Tải ảnh đại diện thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev: any) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as any).checked : value
      };
      
      if (name === 'title' && (!isEdit || !prev.slug)) {
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

  const handleSave = async () => {
    if (!formData.title) return toast.error('Vui lòng nhập tiêu đề');
    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateBlog(id!, formData);
        toast.success('Cập nhật thành công');
      } else {
        await adminCreateBlog(formData);
        toast.success('Đã tạo bài viết mới');
        navigate('/admin/news');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="w-14 h-14 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto mb-6 shadow-xl shadow-sage/10"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Đang nạp dữ liệu nội dung...</p>
    </div>
  );

  const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3";
  const inputCls = "w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-sage focus:ring-4 focus:ring-sage/5 outline-none font-bold text-gray-900 transition-all text-[13px] shadow-sm placeholder:text-gray-300";

  return (
    <div className="max-w-[1400px] mx-auto pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/admin/news')}
            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-white border border-gray-100 text-gray-400 hover:text-sage hover:bg-white hover:border-sage transition-all shadow-sm group"
          >
            <ArrowLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
             <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#1a2420] text-[#bca37f] text-[9px] font-black uppercase tracking-widest rounded-full">Journal Editor</span>
                {isEdit && <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Post ID: #{id?.slice(-6)}</span>}
             </div>
            <h1 className="text-3xl font-black text-[#1a2420] tracking-tight mt-1">
              {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo nội dung mới'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/news')}
            className="px-6 py-4 rounded-[1.25rem] border border-gray-100 bg-white text-gray-500 font-black text-xs hover:bg-gray-50 transition-all tracking-widest uppercase"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-4 rounded-[1.5rem] bg-[#1a2420] text-white font-black text-xs flex items-center gap-2 hover:bg-[#2c3b2e] transition-all disabled:opacity-50 shadow-2xl shadow-[#1a2420]/20 tracking-widest uppercase"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} strokeWidth={3} />}
            {isEdit ? 'Cập nhật nội dung' : 'Đăng bài viết'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-gray-50 shadow-sm space-y-10">
            <div>
              <label className={labelCls}>Tiêu đề bài viết định danh</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                className="w-full text-4xl font-black text-[#1a2420] border-none focus:ring-0 placeholder:text-gray-100 p-0 leading-tight"
                placeholder="Nhập tiêu đề thu hút tại đây..."
              />
            </div>

            <div>
              <label className={labelCls}>Nội dung bài viết chi tiết</label>
              <div className="prose-editor border border-gray-100 rounded-[2.5rem] overflow-hidden bg-gray-50/30">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData((prev: any) => ({ ...prev, content }))}
                  className="news-quill-editor"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ],
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Bottom SEO Section */}
          <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-gray-50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Globe size={150} strokeWidth={1} />
             </div>
             
             <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-[#1a2420] tracking-tight">Cấu hình SEO & Truyền thông</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Tối ưu hóa hiển thị trên các công cụ tìm kiếm</p>
                </div>
                <button 
                  onClick={() => setShowSEO(!showSEO)}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${showSEO ? 'bg-sage text-white shadow-lg shadow-sage/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  {showSEO ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
                </button>
             </div>

             <div className={`space-y-8 relative z-10 transition-all duration-500 overflow-hidden ${showSEO ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <label className={labelCls}>Tiêu đề SEO (Meta Title)</label>
                      <input 
                        name="metaTitle" 
                        value={formData.metaTitle} 
                        onChange={handleInputChange}
                        className={inputCls}
                        placeholder="Tiêu đề hiển thị trên Google..."
                      />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2 px-2">Tối ưu từ 50-60 ký tự.</p>
                   </div>
                   <div>
                      <label className={labelCls}>Đường dẫn tĩnh (Permalink Slug)</label>
                      <div className="relative group">
                         <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sage transition-colors" size={16} />
                         <input 
                           name="slug" 
                           value={formData.slug} 
                           onChange={handleInputChange} 
                           className={`${inputCls} pl-14 font-mono text-[11px]`}
                           placeholder="slug-bai-viet-tu-dong"
                         />
                      </div>
                   </div>
                   <div className="md:col-span-2">
                      <label className={labelCls}>Mô tả SEO (Meta Description)</label>
                      <textarea 
                        name="metaDescription" 
                        value={formData.metaDescription} 
                        onChange={handleInputChange}
                        rows={3}
                        className={`${inputCls} h-32 resize-none leading-relaxed`}
                        placeholder="Tóm tắt nội dung thu hút người dùng nhấp chuột từ kết quả tìm kiếm..."
                      />
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-[#f8f9f8] rounded-lg flex items-center justify-center text-sage">
                         <Eye size={16} strokeWidth={2.5} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Xem trước kết quả tìm kiếm (Google Preview)</p>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-500/5 max-w-2xl">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            <img src="/logo-small.png" alt="" className="w-3 h-3 grayscale opacity-50" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[11px] text-gray-900 font-medium">HerbSpaLab Journal</span>
                            <span className="text-[9px] text-gray-400 font-medium -mt-1">herbspalab.com › tap-chi › {formData.slug || 'bai-viet'}</span>
                         </div>
                      </div>
                      <h4 className="text-[20px] text-[#1a0dab] font-medium hover:underline cursor-pointer mb-1 leading-tight line-clamp-1">{formData.metaTitle || formData.title || 'Tiêu đề bài viết hiển thị tại đây'}</h4>
                      <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                        {formData.metaDescription || formData.summary || 'Mô tả SEO sẽ xuất hiện ở đây để thu hút độc giả từ kết quả tìm kiếm Google...'}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="lg:col-span-1 space-y-8">
          {/* Publish Options */}
          <div className="bg-[#1a2420] p-10 rounded-[2.5rem] shadow-2xl shadow-[#1a2420]/20 space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-[#bca37f] pointer-events-none">
                <Send size={100} strokeWidth={1} />
             </div>
             
             <div className="relative z-10">
              <label className="block text-[10px] font-black text-[#bca37f] uppercase tracking-[0.2em] mb-6">Trạng thái phát hành</label>
              <label className={`flex items-center gap-4 p-5 rounded-[1.5rem] border cursor-pointer transition-all ${formData.isPublished ? 'bg-[#bca37f]/10 border-[#bca37f]/30' : 'bg-white/5 border-white/10'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.isPublished ? 'bg-[#bca37f] text-[#1a2420]' : 'bg-white/10 text-white/30'}`}>
                   {formData.isPublished ? <CheckCircle2 size={20} strokeWidth={3} /> : <FileText size={20} />}
                </div>
                <div className="flex-1">
                   <div className={`text-[13px] font-black leading-tight ${formData.isPublished ? 'text-white' : 'text-white/40'}`}>
                      {formData.isPublished ? 'Đang xuất bản' : 'Bản nháp (Draft)'}
                   </div>
                   <p className="text-[9px] font-bold text-white/30 uppercase mt-1 tracking-wider">Hiển thị trên website</p>
                </div>
                <input 
                  type="checkbox" 
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.isPublished ? 'border-[#bca37f] bg-[#bca37f]' : 'border-white/10'}`}>
                   {formData.isPublished && <div className="w-2 h-2 rounded-full bg-[#1a2420]"></div>}
                </div>
              </label>
            </div>

            <div className="relative z-10">
              <label className="block text-[10px] font-black text-[#bca37f] uppercase tracking-[0.2em] mb-4">Ảnh bìa (Thumbnail)</label>
              <div 
                onClick={() => document.getElementById('thumbnail-input')?.click()}
                className="aspect-[4/3] rounded-[2rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-[#bca37f]/50 hover:bg-white/10 transition-all group/thumb shadow-inner"
              >
                {formData.image ? (
                  <img src={formData.image} alt="Thumbnail" className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-10 h-10 text-white/10 mx-auto mb-3 group-hover/thumb:text-[#bca37f] transition-colors" strokeWidth={1} />
                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Tải ảnh định danh</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-[#1a2420]/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#bca37f]/20 border-t-[#bca37f] rounded-full animate-spin"></div>
                  </div>
                )}
                {formData.image && (
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-[#bca37f] text-[#1a2420] rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">Thay đổi</span>
                   </div>
                )}
              </div>
              <input 
                id="thumbnail-input" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleThumbnailUpload} 
              />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-10">
            <div>
              <label className={labelCls}>Chuyên mục (Category)</label>
              <div className="relative group">
                 <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sage transition-colors" size={16} />
                 <select 
                   name="tags" 
                   value={formData.tags} 
                   onChange={handleInputChange}
                   className={`${inputCls} pl-14 appearance-none cursor-pointer`}
                 >
                   <option>Beauty Tips</option>
                   <option>Knowledge</option>
                   <option>Herb Life</option>
                   <option>Spa News</option>
                 </select>
                 <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Tác giả hệ thống</label>
              <div className="relative group">
                 <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                 <input 
                   name="author" 
                   value={formData.author} 
                   onChange={handleInputChange}
                   className={`${inputCls} pl-14`}
                   placeholder="Tên tác giả..."
                 />
              </div>
            </div>

            <div>
              <label className={labelCls}>Tóm tắt nội dung (Excerpt)</label>
              <textarea 
                name="summary" 
                value={formData.summary} 
                onChange={handleInputChange}
                rows={6}
                className={`${inputCls} h-40 resize-none leading-relaxed`}
                placeholder="Viết một vài câu tóm tắt nội dung để hiển thị ở danh sách bài viết..."
              />
              <div className="flex items-center gap-2 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <AlertCircle size={14} className="text-gray-400" />
                 <p className="text-[10px] text-gray-400 font-bold leading-tight uppercase tracking-widest">Tóm tắt giúp tăng tỷ lệ nhấp chuột (CTR) của độc giả.</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-sage/5 rounded-[2.5rem] border border-sage/10 space-y-4">
             <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-sage" />
                <span className="text-[10px] font-black text-sage uppercase tracking-widest">Writing Tips</span>
             </div>
             <p className="text-[11px] text-sage/70 font-bold leading-relaxed">Sử dụng các thẻ tiêu đề (H1, H2, H3) trong nội dung để cải thiện SEO và giúp bài viết dễ đọc hơn.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEdit;
