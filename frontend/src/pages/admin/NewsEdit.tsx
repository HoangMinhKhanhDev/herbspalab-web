import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, ArrowLeft, Globe, Link as LinkIcon, ChevronDown, ChevronUp
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
      
      // Auto-generate slug from title only for new posts or if slug is empty
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
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/news')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
            </h1>
            <p className="text-sm text-gray-500">Quản lý nội dung tạp chí thảo mộc</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/news')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors shadow-sm text-sm font-bold"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Lưu thay đổi' : 'Đăng bài viết'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Tiêu đề bài viết
              </label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                className="w-full text-2xl font-bold border-none focus:ring-0 placeholder-gray-300"
                placeholder="Nhập tiêu đề tại đây..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Nội dung chi tiết
              </label>
              <div className="prose-editor">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData((prev: any) => ({ ...prev, content }))}
                  className="min-h-[400px]"
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
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status & Options */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Trạng thái bài viết
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative inline-flex items-center">
                  <input 
                    type="checkbox" 
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formData.isPublished ? 'Đang xuất bản' : 'Lưu nháp'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Ảnh đại diện (Thumbnail)
              </label>
              <div 
                onClick={() => document.getElementById('thumbnail-input')?.click()}
                className="aspect-video rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors group"
              >
                {formData.image ? (
                  <img src={formData.image} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Tải ảnh lên</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage"></div>
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

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Chuyên mục
              </label>
              <select 
                name="tags" 
                value={formData.tags} 
                onChange={handleInputChange}
                className="w-full border-gray-200 rounded-lg text-sm focus:border-sage focus:ring-sage"
              >
                <option>Beauty Tips</option>
                <option>Knowledge</option>
                <option>Herb Life</option>
                <option>Spa News</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Đường dẫn tĩnh (Slug)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 group-focus-within:border-sage transition-colors">
                <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                <input 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleInputChange} 
                  className="bg-transparent border-none focus:ring-0 text-xs text-gray-600 w-full"
                  placeholder="slug-bai-viet"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Tóm tắt ngắn (Excerpt)
              </label>
              <textarea 
                name="summary" 
                value={formData.summary} 
                onChange={handleInputChange}
                rows={4}
                className="w-full border-gray-200 rounded-lg text-sm focus:border-sage focus:ring-sage placeholder-gray-300"
                placeholder="Một vài câu tóm tắt bài viết..."
              />
            </div>
          </div>

          {/* SEO Collapsible Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button 
              onClick={() => setShowSEO(!showSEO)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cấu hình SEO</span>
              </div>
              {showSEO ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showSEO && (
              <div className="p-6 pt-0 space-y-4 border-t border-gray-100">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Meta Title
                  </label>
                  <input 
                    name="metaTitle" 
                    value={formData.metaTitle} 
                    onChange={handleInputChange}
                    className="w-full border-gray-200 rounded-lg text-xs"
                    placeholder="Tiêu đề hiển thị trên Google..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Meta Description
                  </label>
                  <textarea 
                    name="metaDescription" 
                    value={formData.metaDescription} 
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border-gray-200 rounded-lg text-xs"
                    placeholder="Mô tả ngắn hiển thị trên Google..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEdit;
