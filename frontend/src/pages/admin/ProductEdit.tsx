import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, FileText, Database, 
  Plus, Trash2, Video, Globe, Sparkles, Check, ArrowLeft, 
  Info, Target, Layers, Clock
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { getProductDetails, updateProduct, createProduct } from '../../api/productApi';
import { getCategories, getAttributes, adminUploadSingle, adminUploadMultiple } from '../../api/adminApi';

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
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { 
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
      const { data } = await adminUploadMultiple(acceptedFiles); 
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin" />
      <p className="text-sage/40 font-bold text-[11px] uppercase tracking-widest">Đang khởi tạo dữ liệu...</p>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Cơ bản', icon: Info },
    { id: 'content', label: 'Mô tả', icon: FileText },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: Target },
    { id: 'variants', label: 'Biến thể', icon: Layers },
  ];

  const inputCls = "w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:border-mint focus:bg-white outline-none font-bold text-sage text-sm transition-all placeholder:text-sage/20 shadow-sm";
  const labelCls = "text-[11px] font-bold text-sage/40 uppercase tracking-widest mb-2.5 block px-1";

  return (
    <div className="max-w-[1400px] mx-auto pb-32 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/products')} 
            className="p-4 rounded-2xl bg-white border border-black/5 text-sage/20 hover:text-sage hover:shadow-xl transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Luxury Catalog
            </div>
            <h1 className="text-4xl font-display italic text-sage tracking-tight">
              {isEdit ? 'Biên tập sản phẩm' : 'Thêm sản phẩm mới'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')} 
            className="px-8 py-4 rounded-full border border-black/5 text-sage/40 text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-sm"
          >
            Hủy thay đổi
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="px-10 py-4 rounded-full bg-ink text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-mint transition-all shadow-2xl hover:-translate-y-1 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex items-center gap-4 py-5 px-8 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all border ${activeTab === tab.id ? 'bg-white text-mint border-black/5 shadow-xl' : 'text-sage/30 border-transparent hover:text-sage hover:bg-white/50'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-mint' : 'text-sage/20'}`} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[2.5rem] border border-black/5 p-10 lg:p-16 shadow-sm min-h-[600px] animate-in fade-in zoom-in-95 duration-500">
            {activeTab === 'basic' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-full">
                    <label className={labelCls}>Tên sản phẩm *</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className={`${inputCls} text-lg`} placeholder="Ví dụ: Nước giặt Thảo Mộc Organic" />
                  </div>
                  <div>
                    <label className={labelCls}>Mã SKU</label>
                    <input name="sku" value={formData.sku} onChange={handleInputChange} className={`${inputCls} font-mono uppercase tracking-widest`} placeholder="BSP-001" />
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
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={`${inputCls} text-lg`} />
                  </div>
                  <div>
                    <label className={labelCls}>Giá khuyến mãi (₫)</label>
                    <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className={`${inputCls} text-lg text-mint`} />
                  </div>
                  <div>
                    <label className={labelCls}>Tồn kho</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nhãn (Badge)</label>
                    <input name="badge" value={formData.badge} onChange={handleInputChange} className={inputCls} placeholder="New, Best Seller, Hot..." />
                  </div>
                </div>

                <div className="pt-10 border-t border-black/5">
                   <label className={labelCls}>Cấu hình đặc biệt</label>
                   <div className="flex flex-wrap gap-10">
                      {[
                        { name: 'isPreorder', label: 'Cho phép Đặt trước (Pre-order)', icon: Clock },
                        { name: 'isNew', label: 'Đánh dấu Sản phẩm mới', icon: Sparkles }
                      ].map(cb => (
                        <label key={cb.name} className="flex items-center gap-4 cursor-pointer group">
                          <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${formData[cb.name] ? 'bg-mint border-mint shadow-lg shadow-mint/20' : 'bg-gray-50 border-black/5 group-hover:border-mint/30'}`}>
                            {formData[cb.name] && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <input type="checkbox" name={cb.name} checked={formData[cb.name]} onChange={handleInputChange} className="hidden" />
                          <span className={`font-bold text-[11px] uppercase tracking-widest transition-colors ${formData[cb.name] ? 'text-sage' : 'text-sage/30 group-hover:text-sage/60'}`}>{cb.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

                {formData.isPreorder && (
                  <div className="animate-in slide-in-from-top-4 duration-500">
                    <label className={labelCls}>Thời gian chuẩn bị dự kiến (ngày)</label>
                    <input name="preparationTime" value={formData.preparationTime} onChange={handleInputChange} className={inputCls} placeholder="VD: 2-3 hoặc 7-10" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div>
                  <label className={labelCls}>Mô tả ngắn gọn (Hiển thị đầu trang)</label>
                  <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows={4} className={`${inputCls} resize-none font-medium leading-relaxed`} placeholder="Tóm tắt những điểm nổi bật nhất của sản phẩm..." />
                </div>
                <div>
                  <label className={labelCls}>Thông tin chi tiết (Rich Content)</label>
                  <div className="rounded-[2rem] overflow-hidden border border-black/5 bg-gray-50 p-2">
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
              <div className="space-y-12 animate-in fade-in duration-500">
                <div>
                  <label className={labelCls}>Ảnh đại diện sản phẩm</label>
                  <div className="max-w-md">
                    <div onClick={() => document.getElementById('thumb-up')?.click()} className="aspect-[4/3] rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-black/5 relative overflow-hidden group cursor-pointer hover:border-mint transition-all shadow-inner">
                      {formData.thumbnail ? 
                        <img src={formData.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> :
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-sage/10 group-hover:text-mint transition-all">
                          <ImageIcon className="w-12 h-12 mb-3" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tải ảnh bìa chính</span>
                        </div>
                      }
                      {uploading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"><div className="w-10 h-10 border-4 border-mint border-t-transparent rounded-full animate-spin" /></div>}
                    </div>
                    <input id="thumb-up" type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Thư viện ảnh sản phẩm</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {formData.images.map((url: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-[1.5rem] bg-gray-50 border border-black/5 relative group overflow-hidden shadow-sm">
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setFormData((p: any) => ({ ...p, images: p.images.filter((_: any, i: number) => i !== idx) }))} className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div {...getRootProps()} className={`aspect-square rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${isDragActive ? 'border-mint bg-mint/5 text-mint' : 'border-black/5 bg-gray-50 text-sage/10 hover:border-mint hover:text-mint'}`}>
                      <input {...getInputProps()} />
                      <Plus className="w-8 h-8" />
                      <span className="font-black text-[9px] uppercase tracking-widest text-center px-4">{isDragActive ? 'Thả ảnh' : 'Kéo thả ảnh'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5">
                  <label className={labelCls}>Video Review URL</label>
                  <div className="relative group">
                    <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-sage/10 w-5 h-5 group-focus-within:text-mint transition-colors" />
                    <input name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} className={`${inputCls} pl-14`} placeholder="Link YouTube, TikTok hoặc MP4..." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-10 animate-in fade-in duration-500 max-w-3xl">
                <div>
                   <label className={labelCls}>Meta Title (SEO)</label>
                   <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className={inputCls} placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm..." />
                   <p className="text-[10px] text-sage/30 mt-2 font-bold px-1">Tối ưu từ 50-60 ký tự</p>
                </div>
                <div>
                   <label className={labelCls}>Meta Description (SEO)</label>
                   <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={4} className={`${inputCls} resize-none`} placeholder="Mô tả thu hút người dùng click từ Google..." />
                   <p className="text-[10px] text-sage/30 mt-2 font-bold px-1">Tối ưu từ 120-160 ký tự</p>
                </div>
                <div>
                   <label className={labelCls}>Tags & Keywords (Cách nhau bởi dấu phẩy)</label>
                   <input name="tags" value={formData.tags} onChange={handleInputChange} className={inputCls} placeholder="thao moc, organic, luxury, serum..." />
                </div>

                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-black/5 shadow-inner">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm"><Globe className="w-4 h-4 text-mint" /></div>
                    <p className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em]">Google Preview</p>
                  </div>
                  <h4 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer mb-1">{formData.metaTitle || formData.name || 'Tiêu đề sản phẩm'}</h4>
                  <p className="text-[#006621] text-sm mb-2 italic opacity-80">herbspalab.com › products › {formData.sku || 'san-pham-herbs'}</p>
                  <p className="text-sage/60 text-sm leading-relaxed line-clamp-2">
                    {formData.metaDescription || formData.shortDescription || 'Chưa có mô tả SEO. Hãy nhập mô tả để cải thiện thứ hạng tìm kiếm của sản phẩm trên Google...'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex items-center justify-between pb-6 border-b border-black/5">
                  <div>
                    <h3 className="text-2xl font-display italic text-sage">Ma trận biến thể</h3>
                    <p className="text-[11px] text-sage/30 font-bold uppercase tracking-widest mt-1">Cấu hình kích thước, mùi hương, màu sắc...</p>
                  </div>
                  <button onClick={generateVariants} className="px-8 py-4 bg-ink text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-mint transition-all shadow-xl flex items-center gap-3">
                    <Layers className="w-4 h-4" /> Khởi tạo ma trận
                  </button>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2rem] border border-black/5 space-y-8">
                  {attributes.map((attr: any) => (
                    <div key={attr.id} className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedAttrs.includes(attr.id) ? 'bg-sage border-sage' : 'bg-white border-black/10 group-hover:border-sage/30'}`}>
                          {selectedAttrs.includes(attr.id) && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" checked={selectedAttrs.includes(attr.id)} onChange={() => {
                          setSelectedAttrs(p => p.includes(attr.id) ? p.filter(a => a !== attr.id) : [...p, attr.id]);
                          if (selectedAttrs.includes(attr.id)) setSelectedValues(p => { const n = { ...p }; delete n[attr.id]; return n; });
                        }} className="hidden" />
                        <span className="font-black text-sage text-[11px] uppercase tracking-widest">{attr.name}</span>
                      </label>
                      
                      {selectedAttrs.includes(attr.id) && (
                        <div className="flex flex-wrap gap-3 ml-9 animate-in slide-in-from-left-4 duration-500">
                          {attr.values?.map((v: any) => {
                            const sel = (selectedValues[attr.id] || []).includes(v.id);
                            return (
                              <button key={v.id} onClick={() => setSelectedValues(p => {
                                const cur = p[attr.id] || [];
                                return { ...p, [attr.id]: sel ? cur.filter(x => x !== v.id) : [...cur, v.id] };
                              })} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${sel ? 'bg-mint text-white border-mint shadow-md' : 'bg-white text-sage/30 border-black/5 hover:border-mint/30 hover:text-sage'}`}>
                                {v.value}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                  {attributes.length === 0 && (
                    <div className="py-10 text-center">
                      <p className="text-sage/30 text-sm font-bold uppercase tracking-widest">Chưa có thuộc tính hệ thống</p>
                      <button onClick={() => navigate('/admin/attributes')} className="mt-4 text-mint font-bold text-[10px] uppercase tracking-widest underline decoration-2 underline-offset-4">Tạo thuộc tính ngay</button>
                    </div>
                  )}
                </div>

                {formData.variants.length > 0 ? (
                  <div className="rounded-[2rem] border border-black/5 overflow-hidden shadow-sm bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-black text-sage/30 uppercase tracking-[0.2em] border-b border-black/5">
                            <th className="px-8 py-5">Biến thể</th>
                            <th className="px-8 py-5">SKU</th>
                            <th className="px-8 py-5 text-center">Giá (₫)</th>
                            <th className="px-8 py-5 text-center">Tồn kho</th>
                            <th className="px-8 py-5 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                          {formData.variants.map((v: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5 font-bold text-sage text-xs">{v.label}</td>
                              <td className="px-8 py-5">
                                <input value={v.sku} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], sku: e.target.value }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="px-4 py-2 rounded-lg bg-gray-50 border border-black/5 text-[11px] w-full font-mono font-bold uppercase" />
                              </td>
                              <td className="px-8 py-5">
                                <input type="number" value={v.price} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], price: Number(e.target.value) }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="px-4 py-2 rounded-lg bg-gray-50 border border-black/5 text-[11px] w-32 text-center mx-auto block font-bold" />
                              </td>
                              <td className="px-8 py-5">
                                <input type="number" value={v.stock} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], stock: Number(e.target.value) }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="px-4 py-2 rounded-lg bg-gray-50 border border-black/5 text-[11px] w-24 text-center mx-auto block font-bold" />
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button onClick={() => setFormData((p: any) => ({ ...p, variants: p.variants.filter((_: any, i: number) => i !== idx) }))} className="p-2 text-sage/20 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-20 rounded-[2.5rem] border-2 border-dashed border-black/5 text-center">
                    <Database className="w-12 h-12 text-sage/10 mx-auto mb-4" />
                    <p className="text-sage/30 font-black text-[11px] uppercase tracking-[0.2em]">Chọn thuộc tính & nhấn "Khởi tạo ma trận" để bắt đầu</p>
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
