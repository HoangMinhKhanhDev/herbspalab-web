import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, FileText, Database, 
  Plus, Trash2, Video, Globe, Sparkles, ArrowLeft, 
  Info, Target, Layers, Clock
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { getProductDetails, updateProduct, createProduct } from '../../api/productApi';
import { getCategories, getAttributes, adminUploadSingle, adminUploadMultiple } from '../../api/adminApi';
import imageCompression from 'browser-image-compression';
// Nếu bạn thấy lỗi "Failed to resolve import", hãy khởi động lại server (Ctrl+C rồi npm start)

const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== 'new';
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: '', sku: '', categoryId: '', price: 0, salePrice: '', stock: 0,
    badge: '', isPreorder: false, isNew: false, description: '', shortDescription: '',
    videoUrl: '', metaTitle: '', metaDescription: '', tags: '', images: [], variants: [], thumbnail: '',
    preparationTime: '2-3'
  });

  // Variant builder state
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, attrData] = await Promise.all([getCategories(), getAttributes()]);
        setCategories(catData);
        setAttributes(attrData);
        if (isEdit) {
          const product = await getProductDetails(id!);
          setFormData({ 
            ...product, 
            images: product.images?.map((img: any) => img.url) || [], 
            salePrice: product.salePrice || '', 
            tags: product.tags || '',
            preparationTime: product.preparationTime || '2-3'
          });
          
          if (product.variants?.length) {
            const attrIds = new Set<string>();
            const valMap: Record<string, Set<string>> = {};
            product.variants.forEach((v: any) => v.options?.forEach((o: any) => {
              const aId = o.attributeValue?.attribute?.id;
              const vId = o.attributeValue?.id;
              if (aId && vId) { 
                attrIds.add(aId); 
                if (!valMap[aId]) valMap[aId] = new Set(); 
                valMap[aId].add(vId); 
              }
            }));
            setSelectedAttrs([...attrIds]);
            const sv: Record<string, string[]> = {};
            Object.entries(valMap).forEach(([k, v]) => sv[k] = [...v]);
            setSelectedValues(sv);
          }
        }
      } catch (e: any) { 
        toast.error(e.response?.data?.message || 'Lỗi tải dữ liệu'); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as any).checked : value }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { 
      // Compress image before upload
      if (file.type.startsWith('image/')) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        file = await imageCompression(file, options);
      }
      const { data } = await adminUploadSingle(file); 
      setFormData((p: any) => ({ ...p, thumbnail: data.url })); 
      toast.success('Tải ảnh thành công'); 
    } catch (er: any) { 
      toast.error(er.response?.data?.message || 'Lỗi tải ảnh'); 
    } finally { 
      setUploading(false); 
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setUploading(true);
    try { 
      const compressedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          if (file.type.startsWith('image/')) {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
            return await imageCompression(file, options);
          }
          return file;
        })
      );
      const { data } = await adminUploadMultiple(compressedFiles); 
      setFormData((p: any) => ({ ...p, images: [...(p.images || []), ...data.urls] })); 
      toast.success(`Đã tải ${data.urls.length} ảnh`); 
    } catch (er: any) { 
      toast.error(er.response?.data?.message || 'Lỗi tải ảnh'); 
    } finally { 
      setUploading(false); 
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true });

  const generateVariants = () => {
    const activeSets = selectedAttrs.filter(aId => (selectedValues[aId] || []).length > 0).map(aId => (selectedValues[aId] || []).map(vId => {
      const attr = attributes.find((a: any) => a.id === aId);
      const val = attr?.values?.find((v: any) => v.id === vId);
      return { attributeValueId: vId, label: `${attr?.name}: ${val?.value}` };
    }));
    if (!activeSets.length) { toast.error('Chọn ít nhất 1 thuộc tính và giá trị'); return; }
    const cartesian = (sets: any[][]): any[][] => sets.reduce((acc, set) => acc.flatMap(combo => set.map(item => [...combo, item])), [[]] as any[][]);
    const combos = cartesian(activeSets);
    const newVariants = combos.map((combo, idx) => ({
      sku: `${formData.sku || 'VAR'}-${idx + 1}`, price: formData.price || 0, stock: 0,
      optionIds: combo.map((c: any) => c.attributeValueId), label: combo.map((c: any) => c.label).join(' / ')
    }));
    setFormData((p: any) => ({ ...p, variants: newVariants }));
    toast.success(`Đã tạo ${newVariants.length} biến thể`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sub = { 
        ...formData, 
        categoryId: formData.categoryId === '' ? null : formData.categoryId, 
        price: Number(formData.price) || 0, 
        salePrice: formData.salePrice === '' ? null : Number(formData.salePrice), 
        stock: Number(formData.stock) || 0 
      };
      if (isEdit) { 
        await updateProduct(id!, sub); 
        toast.success('Cập nhật thành công'); 
      } else { 
        await createProduct(sub); 
        toast.success('Tạo sản phẩm thành công'); 
        navigate('/admin/products'); 
      }
    } catch (e: any) { 
      toast.error(e.response?.data?.message || 'Lỗi lưu sản phẩm'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Cơ bản', icon: Info },
    { id: 'content', label: 'Mô tả', icon: FileText },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: Target },
    { id: 'variants', label: 'Biến thể', icon: Layers },
  ];

  const inputCls = "w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:border-sage focus:ring-1 focus:ring-sage outline-none text-sm transition-colors";
  const labelCls = "block text-sm font-bold text-gray-700 mb-1";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')} 
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/products')} 
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="px-6 py-2 rounded-lg bg-sage text-white font-bold text-sm flex items-center gap-2 hover:bg-sage/90 transition-colors disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />} 
            {saving ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-sage border border-gray-200 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-sage' : 'text-gray-400'} /> 
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[500px]">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <label className={labelCls}>Tên sản phẩm *</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className={inputCls} placeholder="Ví dụ: Nước giặt Thảo Mộc Organic" />
                  </div>
                  <div>
                    <label className={labelCls}>Mã SKU</label>
                    <input name="sku" value={formData.sku} onChange={handleInputChange} className={`${inputCls} font-mono`} placeholder="BSP-001" />
                  </div>
                  <div>
                    <label className={labelCls}>Danh mục</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className={inputCls}>
                      <option value="">Chọn danh mục</option>
                      {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Giá bán (₫) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Giá khuyến mãi (₫)</label>
                    <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tồn kho</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nhãn (Badge)</label>
                    <input name="badge" value={formData.badge} onChange={handleInputChange} className={inputCls} placeholder="New, Hot..." />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                   <label className={labelCls}>Cấu hình đặc biệt</label>
                   <div className="flex flex-wrap gap-6 mt-3">
                      {[
                        { name: 'isPreorder', label: 'Cho phép Đặt trước (Pre-order)', icon: Clock },
                        { name: 'isNew', label: 'Đánh dấu Sản phẩm mới', icon: Sparkles }
                      ].map(cb => (
                        <label key={cb.name} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name={cb.name} checked={formData[cb.name]} onChange={handleInputChange} className="rounded text-sage focus:ring-sage" />
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><cb.icon size={14} className="text-gray-400" /> {cb.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

                {formData.isPreorder && (
                  <div className="pt-4">
                    <label className={labelCls}>Thời gian chuẩn bị dự kiến (ngày)</label>
                    <input name="preparationTime" value={formData.preparationTime} onChange={handleInputChange} className={inputCls} placeholder="VD: 2-3 hoặc 7-10" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className={labelCls}>Mô tả ngắn gọn</label>
                  <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows={3} className={`${inputCls} resize-none`} placeholder="Tóm tắt ngắn gọn về sản phẩm..." />
                </div>
                <div>
                  <label className={labelCls}>Thông tin chi tiết</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.description} 
                      onChange={(content) => setFormData((p: any) => ({ ...p, description: content }))}
                      modules={{ 
                        toolbar: [
                          [{ header: [1, 2, 3, false] }], 
                          ['bold', 'italic', 'underline', 'strike'], 
                          [{ list: 'ordered' }, { list: 'bullet' }], 
                          [{ align: [] }], 
                          ['link', 'image', 'video'], 
                          ['clean']
                        ] 
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-8">
                <div>
                  <label className={labelCls}>Ảnh đại diện chính</label>
                  <div className="max-w-xs mt-2">
                    <div onClick={() => document.getElementById('thumb-up')?.click()} className="aspect-square rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 relative overflow-hidden cursor-pointer hover:border-sage transition-colors flex items-center justify-center">
                      {formData.thumbnail ? 
                        <img src={formData.thumbnail} alt="" className="w-full h-full object-cover" /> :
                        <div className="flex flex-col items-center text-gray-400">
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-xs font-bold uppercase tracking-wider">Tải ảnh</span>
                        </div>
                      }
                      {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" /></div>}
                    </div>
                    <input id="thumb-up" type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelCls}>Thư viện ảnh</label>
                    <button 
                      type="button"
                      onClick={() => document.getElementById('gallery-up')?.click()}
                      className="text-xs font-bold text-sage hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Thêm nhiều ảnh
                    </button>
                    <input 
                      id="gallery-up" 
                      type="file" 
                      multiple 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))} 
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-2">
                    {formData.images.map((url: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-lg bg-gray-100 border border-gray-200 relative group overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setFormData((p: any) => ({ ...p, images: p.images.filter((_: any, i: number) => i !== idx) }))} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div {...getRootProps()} className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${isDragActive ? 'border-sage bg-sage/5 text-sage' : 'border-gray-300 bg-gray-50 text-gray-400 hover:border-sage hover:text-sage'}`}>
                      <input {...getInputProps()} />
                      {uploading ? (
                        <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Plus size={24} />
                          <span className="text-xs font-bold text-center px-2">{isDragActive ? 'Thả ảnh' : 'Kéo thả'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <label className={labelCls}>Video Sản phẩm</label>
                  <div className="mt-2 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Link Video (YouTube, TikTok...)</label>
                        <div className="relative">
                          <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} className={`${inputCls} pl-10`} placeholder="https://..." />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Hoặc tải video lên (MP4, Max 50MB)</label>
                        <button 
                          type="button"
                          disabled={uploading}
                          onClick={() => document.getElementById('video-up')?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-sage hover:bg-sage/5 transition-all text-sm font-bold text-gray-600"
                        >
                          {uploading ? <div className="w-4 h-4 border-2 border-sage border-t-transparent rounded-full animate-spin" /> : <Plus size={16} />}
                          Tải video lên
                        </button>
                        <input 
                          id="video-up" 
                          type="file" 
                          className="hidden" 
                          accept="video/mp4,video/quicktime" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            setUploading(true);
                            try {
                              const { data } = await adminUploadSingle(file);
                              setFormData((p: any) => ({ ...p, videoUrl: data.url }));
                              toast.success('Tải video thành công');
                            } catch (err: any) {
                              toast.error(err.response?.data?.message || 'Lỗi tải video');
                            } finally {
                              setUploading(false);
                            }
                          }} 
                        />
                      </div>
                    </div>

                    {formData.videoUrl && (
                      <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video max-w-md">
                        {formData.videoUrl.startsWith('/uploads/') ? (
                          <video src={formData.videoUrl} controls className="w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs text-center p-4">
                            <Video size={32} className="mb-2 opacity-50 block mx-auto" />
                            <p>Video từ link ngoài: <br/>{formData.videoUrl}</p>
                          </div>
                        )}
                        <button 
                          onClick={() => setFormData((p: any) => ({ ...p, videoUrl: '' }))}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                   <label className={labelCls}>Meta Title</label>
                   <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className={inputCls} placeholder="Tiêu đề SEO..." />
                   <p className="text-xs text-gray-500 mt-1">Tối ưu từ 50-60 ký tự.</p>
                </div>
                <div>
                   <label className={labelCls}>Meta Description</label>
                   <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={4} className={`${inputCls} resize-none`} placeholder="Mô tả SEO..." />
                   <p className="text-xs text-gray-500 mt-1">Tối ưu từ 120-160 ký tự.</p>
                </div>
                <div>
                   <label className={labelCls}>Tags (Cách nhau bởi dấu phẩy)</label>
                   <input name="tags" value={formData.tags} onChange={handleInputChange} className={inputCls} placeholder="tag1, tag2..." />
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={16} className="text-gray-400" />
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Xem trước Google</p>
                  </div>
                  <h4 className="text-lg text-blue-700 font-medium hover:underline cursor-pointer mb-1 truncate">{formData.metaTitle || formData.name || 'Tiêu đề sản phẩm'}</h4>
                  <p className="text-green-700 text-sm mb-1 truncate">herbspalab.com › products › {formData.sku || 'san-pham'}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {formData.metaDescription || formData.shortDescription || 'Mô tả SEO sẽ xuất hiện ở đây...'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Biến thể Sản phẩm</h3>
                    <p className="text-sm text-gray-500">Quản lý kích thước, mùi hương...</p>
                  </div>
                  <button onClick={generateVariants} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Layers size={16} /> Tạo biến thể
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                  {attributes.map((attr: any) => (
                    <div key={attr.id} className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input type="checkbox" checked={selectedAttrs.includes(attr.id)} onChange={() => {
                          setSelectedAttrs(p => p.includes(attr.id) ? p.filter(a => a !== attr.id) : [...p, attr.id]);
                          if (selectedAttrs.includes(attr.id)) setSelectedValues(p => { const n = { ...p }; delete n[attr.id]; return n; });
                        }} className="rounded text-sage focus:ring-sage" />
                        <span className="font-bold text-gray-900 text-sm">{attr.name}</span>
                      </label>
                      
                      {selectedAttrs.includes(attr.id) && (
                        <div className="flex flex-wrap gap-2 pl-6">
                          {attr.values?.map((v: any) => {
                            const sel = (selectedValues[attr.id] || []).includes(v.id);
                            return (
                              <button key={v.id} onClick={() => setSelectedValues(p => {
                                const cur = p[attr.id] || [];
                                return { ...p, [attr.id]: sel ? cur.filter(x => x !== v.id) : [...cur, v.id] };
                              })} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${sel ? 'bg-sage text-white border-sage' : 'bg-white text-gray-600 border-gray-300 hover:border-sage'}`}>
                                {v.value}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                  {attributes.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">Chưa có thuộc tính nào.</p>
                      <button onClick={() => navigate('/admin/attributes')} className="mt-2 text-sage font-bold text-sm underline">Đến trang Quản lý thuộc tính</button>
                    </div>
                  )}
                </div>

                {formData.variants.length > 0 ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-3">Phân loại</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3 text-center">Giá (₫)</th>
                            <th className="px-4 py-3 text-center">Tồn kho</th>
                            <th className="px-4 py-3 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {formData.variants.map((v: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-bold text-gray-900">{v.label}</td>
                              <td className="px-4 py-3">
                                <input value={v.sku} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], sku: e.target.value }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="w-full px-2 py-1 rounded bg-white border border-gray-300 text-xs font-mono" />
                              </td>
                              <td className="px-4 py-3">
                                <input type="number" value={v.price} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], price: Number(e.target.value) }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="w-24 px-2 py-1 mx-auto block rounded bg-white border border-gray-300 text-xs text-center" />
                              </td>
                              <td className="px-4 py-3">
                                <input type="number" value={v.stock} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], stock: Number(e.target.value) }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="w-20 px-2 py-1 mx-auto block rounded bg-white border border-gray-300 text-xs text-center" />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={() => setFormData((p: any) => ({ ...p, variants: p.variants.filter((_: any, i: number) => i !== idx) }))} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 py-12 rounded-xl border-2 border-dashed border-gray-200 text-center">
                    <Database size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Chọn thuộc tính và tạo biến thể để thiết lập giá và tồn kho riêng biệt.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
