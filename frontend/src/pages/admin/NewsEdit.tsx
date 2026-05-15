import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, Globe, Link as LinkIcon, 
  FileText, Send, Eye, CheckCircle2, 
  AlertCircle, User, Tag, Sparkles, Loader2, Info, Upload, Trash2, Globe2
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
    if (!formData.title) return toast.error('Vui lòng nhập tiêu đề bài viết');
    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateBlog(id!, formData);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await adminCreateBlog(formData);
        toast.success('Đã đăng bài viết mới thành công');
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
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Triệu hồi nội dung bài viết...</p>
    </div>
  );

  const inp = "w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/5 outline-none font-bold text-gray-900 transition-all text-[13px] placeholder:text-gray-400";
  const lbl = "block text-[12px] font-black text-gray-800 tracking-wide mb-2";
  const card = "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8";
  const cardH = "px-6 py-5 border-b border-gray-50 bg-white flex items-center justify-between";

  return (
    <div className="pb-32 max-w-6xl mx-auto">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-4 z-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-[#1a2420] text-[#bca37f] text-[10px] font-black uppercase tracking-widest rounded-full">Blog Editor</span>
            {isEdit && <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Post ID: #{id?.slice(-6)}</span>}
          </div>
          <h1 className="text-2xl font-black text-[#1a2420] tracking-tight">{isEdit ? 'Chỉnh sửa Bài viết' : 'Tạo Bài viết Mới'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/news')} className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-black text-xs hover:bg-gray-50 hover:border-gray-300 transition-all uppercase tracking-widest shadow-sm">Hủy bỏ</button>
          <button onClick={handleSave} disabled={saving} className="btn-admin-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={3} />}
            {saving ? 'Đang lưu...' : 'Lưu & Đăng bài'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main 1-Column Content Flow */}
        <div className="col-span-1 lg:col-span-3">

          {/* 1. THÔNG TIN CƠ BẢN */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Info size={18} className="text-[#bca37f]"/> 1. Thông tin cơ bản</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className={lbl}>Tiêu đề bài viết <span className="text-red-500">*</span></label>
                <input name="title" value={formData.title} onChange={handleInputChange} className={inp} placeholder="VD: 5 Cách chăm sóc da thảo mộc tự nhiên tại nhà..." />
              </div>

              <div>
                <label className={lbl}>Đường dẫn tĩnh (Slug)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input name="slug" value={formData.slug} onChange={handleInputChange} className={`${inp} pl-11 font-mono text-[12px]`} placeholder="duong-dan-bai-viet" />
                </div>
              </div>

              <div>
                <label className={lbl}>Tóm tắt ngắn (Excerpt)</label>
                <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows={3} className={`${inp} resize-none`} placeholder="Mô tả ngắn gọn nội dung bài viết để thu hút người đọc..." />
              </div>
            </div>
          </div>

          {/* 2. NỘI DUNG CHI TIẾT */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><FileText size={18} className="text-[#bca37f]"/> 2. Nội dung chi tiết</p>
            </div>
            <div className="p-8">
               <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                 <ReactQuill theme="snow" value={formData.content} onChange={(content) => setFormData((prev: any) => ({ ...prev, content }))} className="news-editor h-80"
                   modules={{ toolbar: [[{ header: [1,2,3,false] }],['bold','italic','underline','strike'],[{list:'ordered'},{list:'bullet'}],[{align:[]}],['link','image','video'],['clean']] }} />
               </div>
            </div>
          </div>

          {/* 3. HÌNH ẢNH & PHÂN LOẠI */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><ImageIcon size={18} className="text-[#bca37f]"/> 3. Hình ảnh & Phân loại</p>
            </div>
            <div className="p-8 space-y-8 bg-[#fafafa]">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={lbl}>Ảnh bìa bài viết</label>
                    <div onClick={() => document.getElementById('news-thumb')?.click()} className="aspect-video rounded-xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all overflow-hidden relative group">
                       {formData.image ? (
                          <>
                            <img src={formData.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-black uppercase tracking-widest">Thay đổi ảnh</div>
                          </>
                       ) : (
                          <div className="text-center text-gray-400">
                             <Upload size={32} className="mx-auto mb-2 opacity-20"/>
                             <span className="text-[10px] font-bold uppercase">Tải ảnh đại diện</span>
                          </div>
                       )}
                       {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-sage" size={24}/></div>}
                    </div>
                    <input id="news-thumb" type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                  </div>

                  <div className="space-y-6">
                     <div>
                        <label className={lbl}>Chuyên mục</label>
                        <select name="tags" value={formData.tags} onChange={handleInputChange} className={`${inp} appearance-none cursor-pointer border-gray-200`}>
                           <option>Beauty Tips</option>
                           <option>Knowledge</option>
                           <option>Herb Life</option>
                           <option>Spa News</option>
                        </select>
                     </div>
                     <div>
                        <label className={lbl}>Tác giả</label>
                        <div className="relative">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input name="author" value={formData.author} onChange={handleInputChange} className={`${inp} pl-11`} placeholder="Administrator" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* 4. CẤU HÌNH SEO */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Globe2 size={18} className="text-[#bca37f]"/> 4. Cấu hình SEO</p>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className={lbl}>Meta Title <span className={`ml-2 ${(formData.metaTitle?.length||0)>60?'text-red-500':'text-sage'}`}>{formData.metaTitle?.length||0}/60</span></label>
                     <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className={inp} placeholder="Tiêu đề hiển thị trên Google..." />
                  </div>
                  <div>
                     <label className={lbl}>Meta Description <span className={`ml-2 ${(formData.metaDescription?.length||0)>160?'text-red-500':'text-sage'}`}>{formData.metaDescription?.length||0}/160</span></label>
                     <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={3} className={`${inp} resize-none`} placeholder="Mô tả thu hút nhấp chuột..." />
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Xem trước kết quả tìm kiếm</p>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 max-w-2xl">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold">H</div>
                        <div className="text-[12px] text-gray-600">herbspalab.vn <span className="text-gray-400">› tap-chi › {formData.slug || 'slug'}</span></div>
                     </div>
                     <h3 className="text-[18px] text-[#1a0dab] font-medium hover:underline cursor-pointer mb-1 leading-tight">{formData.metaTitle || formData.title || 'Tiêu đề bài viết'}</h3>
                     <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">{formData.metaDescription || formData.summary || 'Nội dung mô tả SEO sẽ xuất hiện tại đây giúp bài viết của bạn trông chuyên nghiệp hơn trên kết quả tìm kiếm Google.'}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* 5. TRẠNG THÁI */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Send size={18} className="text-[#bca37f]"/> 5. Trạng thái phát hành</p>
            </div>
            <div className="p-8">
               <label className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.isPublished ? 'border-sage bg-sage/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${formData.isPublished ? 'bg-sage text-white' : 'bg-white text-gray-300 border border-gray-100 shadow-sm'}`}>
                    {formData.isPublished ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <FileText size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-black text-gray-800">{formData.isPublished ? 'Đang sẵn sàng xuất bản' : 'Lưu dưới dạng bản nháp'}</div>
                    <div className="text-[12px] text-gray-500 font-medium">{formData.isPublished ? 'Bài viết sẽ hiển thị công khai trên website ngay sau khi lưu.' : 'Bài viết sẽ không hiển thị với khách hàng.'}</div>
                  </div>
                  <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} className="hidden" />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${formData.isPublished ? 'border-sage bg-sage' : 'border-gray-300'}`}>
                    {formData.isPublished && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                  </div>
               </label>
            </div>
          </div>

        </div>

        {/* Checklist Sidebar */}
        <div className="hidden lg:block col-span-1">
          <div className="sticky top-28 space-y-4">
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[12px] font-black text-gray-800 mb-3 uppercase tracking-widest">Tiến độ nội dung</p>
                <ul className="space-y-3">
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.title ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Tiêu đề bài viết</li>
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.content.length > 50 ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Nội dung chi tiết</li>
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.image ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Ảnh đại diện</li>
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.summary ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Tóm tắt bài viết</li>
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.metaTitle && formData.metaDescription ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Cấu hình SEO</li>
                </ul>
             </div>
             
             <div className="bg-[#1a2420] p-5 rounded-2xl text-white shadow-xl shadow-sage/10">
                <p className="text-[10px] font-black text-[#bca37f] mb-2 uppercase tracking-widest">Mẹo viết bài</p>
                <p className="text-[12px] leading-relaxed opacity-80 italic">"Sử dụng hình ảnh chất lượng cao và tiêu đề chứa từ khóa để cải thiện thứ hạng tìm kiếm tự nhiên."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEdit;
