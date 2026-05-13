import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, Layout, FileText, Database, Plus, Trash2, Video, Globe, Sparkles, Check, ArrowLeft, ChevronRight
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { getProductDetails, updateProduct, createProduct } from '../../api/productApi';
import { getCategories, adminUploadSingle, adminUploadMultiple } from '../../api/adminApi';

const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== 'new';

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: '',
    sku: '',
    categoryId: '',
    price: 0,
    salePrice: '',
    stock: 0,
    badge: '',
    isPreorder: false,
    isNew: false,
    description: '',
    shortDescription: '',
    videoUrl: '',
    metaTitle: '',
    metaDescription: '',
    tags: '',
    images: [],
    variants: [],
    thumbnail: ''
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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { data } = await adminUploadMultiple(files);
      setFormData((prev: any) => ({ 
        ...prev, 
        images: [...(prev.images || []), ...data.urls] 
      }));
      toast.success(`Đã tải lên ${data.urls.length} ảnh`);
    } catch (error) {
      toast.error('Lỗi khi tải ảnh thư viện');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData);

        if (isEdit) {
          const product = await getProductDetails(id!);
          setFormData({
            ...product,
            images: product.images?.map((img: any) => img.url) || [],
            salePrice: product.salePrice || '',
            tags: product.tags || ''
          });
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        await updateProduct(id!, formData);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await createProduct(formData);
        toast.success('Tạo sản phẩm thành công');
        navigate('/admin/products');
      }
    } catch (error) {
      toast.error('Lỗi khi lưu sản phẩm');
    }
  };

  if (loading) return <div className="p-20 text-center font-display italic text-sage/40">Đang thiết lập dữ liệu sản phẩm...</div>;

  const tabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: Layout },
    { id: 'content', label: 'Nội dung chi tiết', icon: FileText },
    { id: 'media', label: 'Hình ảnh & Video', icon: ImageIcon },
    { id: 'seo', label: 'Tiêu chuẩn SEO', icon: Globe },
    { id: 'variants', label: 'Quản lý Biến thể', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Premium Header - Optimized Spacing */}
      <div className="flex flex-col md:flex-row items-center justify-between sticky top-0 bg-cream/90 backdrop-blur-2xl py-6 z-30 border-b border-sage/5 -mx-4 px-8 gap-6 shadow-sm">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button onClick={() => navigate('/admin/products')} className="w-12 h-12 rounded-2xl bg-white border border-sage/10 flex items-center justify-center text-sage hover:text-gold transition-all shadow-sm hover:shadow-md">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-1 opacity-80">
              <Sparkles className="w-3.5 h-3.5" />
              Product Curating
            </div>
            <h1 className="text-3xl font-display font-black text-sage leading-none tracking-tight">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button onClick={() => navigate('/admin/products')} className="px-6 py-3.5 rounded-2xl border border-sage/10 text-sage/40 text-sm font-black uppercase tracking-widest hover:bg-white hover:text-sage transition-all">Hủy bỏ</button>
          <button onClick={handleSave} className="px-10 py-3.5 rounded-2xl bg-sage text-white text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:bg-sage-dark shadow-xl shadow-sage/20 transition-all transform hover:-translate-y-1 active:scale-95">
            <Save className="w-5 h-5 text-gold" />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Premium Tabs - Improved Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 bg-white/60 backdrop-blur-md p-2 rounded-[2.5rem] shadow-soft border border-sage/5 sticky top-32 z-20 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-3 py-4 px-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-sage text-white shadow-xl shadow-sage/20 scale-[1.02]' 
                : 'text-sage/30 hover:bg-white hover:text-sage'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gold' : 'text-sage/20'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Luxury Form Area */}
      <div className="bg-white rounded-[3.5rem] shadow-premium border border-sage/5 p-12 min-h-[600px] relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="col-span-full space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Định danh sản phẩm</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="w-full px-8 py-5 rounded-2xl bg-cream border border-sage/5 focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none text-2xl font-display font-bold text-sage transition-all shadow-inner"
                placeholder="Nhập tên sản phẩm thảo mộc..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Mã SKU</label>
              <input name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage" placeholder="Vd: BSP-001" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Danh mục hệ thống</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage cursor-pointer">
                <option value="">Chọn danh mục phù hợp</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Giá niêm yết (₫)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-display font-bold text-xl text-sage" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Giá khuyến mãi (₫)</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-display font-bold text-xl text-gold" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Số lượng khả dụng</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Nhãn đính kèm (Badge)</label>
              <input name="badge" value={formData.badge} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage" placeholder="Hot, Sale, New..." />
            </div>
            <div className="flex gap-10 items-center col-span-full bg-sage/[0.02] p-8 rounded-[2rem] border border-sage/5 mt-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.isPreorder ? 'bg-sage border-sage shadow-lg shadow-sage/20' : 'bg-white border-sage/10'}`}>
                  {formData.isPreorder && <Check className="w-5 h-5 text-gold" />}
                </div>
                <input type="checkbox" name="isPreorder" checked={formData.isPreorder} onChange={handleInputChange} className="hidden" />
                <span className={`font-bold text-sm ${formData.isPreorder ? 'text-sage' : 'text-sage/40'}`}>Chế độ Đặt trước (Pre-order)</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.isNew ? 'bg-sage border-sage shadow-lg shadow-sage/20' : 'bg-white border-sage/10'}`}>
                  {formData.isNew && <Check className="w-5 h-5 text-gold" />}
                </div>
                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleInputChange} className="hidden" />
                <span className={`font-bold text-sm ${formData.isNew ? 'text-sage' : 'text-sage/40'}`}>Gắn nhãn Sản phẩm mới</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Tóm tắt sản phẩm (Short Description)</label>
              <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows={4} className="w-full px-6 py-5 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-medium text-sage resize-none" placeholder="Mô tả ngắn gọn về đặc điểm nổi bật nhất của sản phẩm..." />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Chi tiết sản phẩm (Full Content)</label>
              <div className="rounded-[2rem] overflow-hidden border border-sage/5 shadow-soft luxury-quill">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(content) => setFormData((prev: any) => ({ ...prev, description: content }))}
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
        )}

        {activeTab === 'media' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* Primary Thumbnail */}
            <div className="space-y-6">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Ảnh đại diện chính (Thumbnail)</label>
              <div className="max-w-md">
                <div 
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                  className="aspect-[4/3] rounded-[3rem] bg-cream border-2 border-dashed border-sage/10 relative overflow-hidden group cursor-pointer hover:border-gold/30 transition-all shadow-soft"
                >
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-sage/20 group-hover:text-gold transition-colors">
                      <ImageIcon className="w-16 h-16 mb-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Tải ảnh đại diện</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <input 
                  id="thumbnail-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleThumbnailUpload} 
                />
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-6">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Thư viện hình ảnh nghệ thuật (Gallery)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {formData.images.map((url: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-[2rem] bg-cream border border-sage/5 relative group overflow-hidden shadow-soft">
                    <img src={url} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-sage-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                        onClick={() => setFormData((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== idx) }))}
                        className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                  className="aspect-square rounded-[2rem] border-2 border-dashed border-sage/10 flex flex-col items-center justify-center gap-3 text-sage/20 hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center border border-sage/5">
                    <Plus className="w-8 h-8" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest">Tải lên ảnh</span>
                </button>
                <input 
                  id="gallery-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleGalleryUpload} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Video trình diễn (YouTube/Vimeo/TikTok)</label>
              <div className="relative group">
                <Video className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/60 group-focus-within:text-gold transition-colors" />
                <input name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} className="w-full pl-16 pr-6 py-5 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage shadow-inner" placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Meta Title</label>
              <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage" placeholder="Tiêu đề hiển thị chuẩn SEO..." />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={4} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-medium text-sage resize-none" placeholder="Mô tả tóm lược hấp dẫn trên trang tìm kiếm..." />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Từ khóa (Tags)</label>
              <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage" placeholder="Thảo mộc, Spa, Serum..." />
            </div>
            
            {/* Google Luxury Preview */}
            <div className="bg-cream/50 p-10 rounded-[2.5rem] border border-sage/5 space-y-3 shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Globe className="w-16 h-16" /></div>
              <p className="text-[10px] font-black text-sage/30 uppercase tracking-[0.2em] mb-4">Google Search Preview</p>
              <h4 className="text-2xl text-blue-800 font-medium leading-tight">{formData.metaTitle || formData.name || 'Tiêu đề sản phẩm cao cấp'}</h4>
              <p className="text-sage/40 text-sm font-bold flex items-center gap-2">herbspalab.com <ChevronRight className="w-3 h-3" /> sản phẩm <ChevronRight className="w-3 h-3" /> {formData.sku || 'slug'}</p>
              <p className="text-sage/60 text-sm leading-relaxed line-clamp-2 mt-2">{formData.metaDescription || formData.shortDescription || 'Mô tả tác phẩm thảo mộc của bạn sẽ được hiển thị một cách tinh tế tại đây để thu hút khách hàng từ bộ máy tìm kiếm Google.'}</p>
            </div>
          </div>
        )}

        {activeTab === 'variants' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-bold text-sage">Danh sách Biến thể</h3>
              <button className="px-8 py-3 bg-gold/10 text-gold rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-sage-dark transition-all shadow-sm border border-gold/10">
                Khởi tạo Ma trận biến thể
              </button>
            </div>
            <div className="bg-cream/50 p-20 rounded-[3rem] border-2 border-dashed border-sage/10 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-soft mb-6 border border-sage/5">
                <Database className="w-10 h-10 text-sage/20" />
              </div>
              <p className="text-sage font-display font-bold text-xl">Sản phẩm hiện chưa có biến thể</p>
              <p className="text-sage/40 text-sm italic mt-2 max-w-sm">Vui lòng thiết lập các thuộc tính như Mùi hương, Dung tích hoặc Màu sắc để bắt đầu tạo ra các phiên bản khác nhau của sản phẩm.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;
