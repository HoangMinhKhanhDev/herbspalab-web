import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, FileText, Database, 
  Plus, Trash2, Video, Globe, Sparkles, ArrowLeft, 
  Info, Target, Layers, Clock, ChevronRight, LayoutGrid, Zap, CheckCircle2, AlertCircle, X, Upload
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { getProductDetails, updateProduct, createProduct } from '../../api/productApi';
import { getCategories, getAttributes, adminUploadSingle, adminUploadMultiple } from '../../api/adminApi';
import imageCompression from 'browser-image-compression';

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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="w-14 h-14 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto mb-6 shadow-xl shadow-sage/10"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Triệu hồi cơ sở dữ liệu sản phẩm...</p>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Cơ bản', icon: Info, desc: 'Thông tin cốt lõi' },
    { id: 'content', label: 'Mô tả', icon: FileText, desc: 'Nội dung chi tiết' },
    { id: 'media', label: 'Media', icon: ImageIcon, desc: 'Hình ảnh & Video' },
    { id: 'seo', label: 'SEO', icon: Target, desc: 'Tối ưu tìm kiếm' },
    { id: 'variants', label: 'Biến thể', icon: Layers, desc: 'Thuộc tính mở rộng' },
  ];

  const inputCls = "w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-sage focus:ring-4 focus:ring-sage/5 outline-none font-bold text-gray-900 transition-all text-[13px] shadow-sm placeholder:text-gray-300";
  const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5";

  return (
    <div className="space-y-10 pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/admin/products')} 
            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-white border border-gray-100 text-gray-400 hover:text-sage hover:bg-white hover:border-sage transition-all shadow-sm group"
          >
            <ArrowLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
               <span className="px-2.5 py-1 bg-[#1a2420] text-[#bca37f] text-[9px] font-black uppercase tracking-widest rounded-full">Inventory Control</span>
               {isEdit && <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">ID: #{id?.slice(-6)}</span>}
            </div>
            <h1 className="text-3xl font-black text-[#1a2420] tracking-tight mt-1">
              {isEdit ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/products')} 
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
            {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-3">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex flex-col gap-1 px-6 py-5 rounded-[2rem] text-left transition-all duration-300 relative overflow-hidden group border ${
                activeTab === tab.id 
                  ? 'bg-white text-sage border-gray-100 shadow-xl shadow-sage/5' 
                  : 'text-gray-400 hover:bg-white hover:text-gray-600 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <tab.icon size={20} strokeWidth={activeTab === tab.id ? 3 : 2} className={activeTab === tab.id ? 'text-sage' : 'text-gray-300'} /> 
                <span className="text-[13px] font-black uppercase tracking-widest">{tab.label}</span>
              </div>
              <p className={`text-[10px] font-bold pl-8 relative z-10 ${activeTab === tab.id ? 'text-gray-400' : 'text-gray-300'}`}>{tab.desc}</p>
              {activeTab === tab.id && <div className="absolute top-0 right-0 w-1.5 h-full bg-sage"></div>}
            </button>
          ))}
          
          <div className="mt-8 p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100/50">
             <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-amber-600" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Quality Check</span>
             </div>
             <p className="text-[11px] text-amber-700/70 font-medium leading-relaxed">Đảm bảo SKU là duy nhất và hình ảnh có độ phân giải tối thiểu 1000x1000px để hiển thị tốt nhất.</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[3rem] border border-gray-50 p-10 lg:p-14 shadow-sm min-h-[600px] relative">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                {activeTab === 'basic' && <Info size={200} strokeWidth={1} />}
                {activeTab === 'content' && <FileText size={200} strokeWidth={1} />}
                {activeTab === 'media' && <ImageIcon size={200} strokeWidth={1} />}
                {activeTab === 'seo' && <Target size={200} strokeWidth={1} />}
                {activeTab === 'variants' && <Layers size={200} strokeWidth={1} />}
            </div>

            {activeTab === 'basic' && (
              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="col-span-full">
                    <label className={labelCls}>Tên sản phẩm định danh *</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className={inputCls} placeholder="Ví dụ: Nước giặt Thảo Mộc Organic" />
                  </div>
                  <div>
                    <label className={labelCls}>Mã SKU Hệ thống</label>
                    <input name="sku" value={formData.sku} onChange={handleInputChange} className={`${inputCls} font-mono uppercase tracking-widest`} placeholder="BSP-001" />
                  </div>
                  <div>
                    <label className={labelCls}>Danh mục phân phối</label>
                    <div className="relative group">
                      <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className={`${inputCls} appearance-none cursor-pointer`}>
                        <option value="">Chọn danh mục</option>
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Giá bán niêm yết (₫) *</label>
                    <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xs">₫</span>
                       <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Giá ưu đãi (sale) (₫)</label>
                    <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-300 font-bold text-xs">₫</span>
                       <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className={`${inputCls} pl-10 text-red-600`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Tồn kho thực tế</label>
                    <div className="relative">
                       <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-400" size={16} />
                       <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={`${inputCls} pl-12 font-black`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Nhãn hiển thị (Badge)</label>
                    <input name="badge" value={formData.badge} onChange={handleInputChange} className={inputCls} placeholder="New, Hot, Limited..." />
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50">
                   <label className={labelCls}>Cấu hình trạng thái đặc biệt</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {[
                        { name: 'isPreorder', label: 'Cho phép Đặt trước (Pre-order)', icon: Clock, desc: 'Dành cho hàng sắp về' },
                        { name: 'isNew', label: 'Đánh dấu Sản phẩm mới', icon: Sparkles, desc: 'Hiển thị icon New tại store' }
                      ].map(cb => (
                        <label key={cb.name} className={`flex items-center gap-4 p-6 rounded-3xl border border-gray-100 cursor-pointer transition-all hover:border-sage hover:bg-sage/5 ${formData[cb.name] ? 'bg-sage/5 border-sage ring-4 ring-sage/5' : 'bg-white'}`}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData[cb.name] ? 'bg-sage text-white' : 'bg-gray-50 text-gray-400'}`}>
                             <cb.icon size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1">
                             <div className="text-[13px] font-black text-gray-900 leading-tight">{cb.label}</div>
                             <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{cb.desc}</p>
                          </div>
                          <input type="checkbox" name={cb.name} checked={formData[cb.name]} onChange={handleInputChange} className="hidden" />
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData[cb.name] ? 'border-sage bg-sage' : 'border-gray-200'}`}>
                             {formData[cb.name] && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                          </div>
                        </label>
                      ))}
                   </div>
                </div>

                {formData.isPreorder && (
                  <div className="pt-4 animate-fadeIn">
                    <label className={labelCls}>Thời gian chuẩn bị dự kiến (ngày)</label>
                    <input name="preparationTime" value={formData.preparationTime} onChange={handleInputChange} className={inputCls} placeholder="VD: 2-3 hoặc 7-10" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-10 relative z-10">
                <div>
                  <label className={labelCls}>Tóm tắt ngắn gọn (Slogan/Intro)</label>
                  <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows={3} className={`${inputCls} resize-none leading-relaxed h-32`} placeholder="Giới thiệu nhanh về công dụng hoặc đặc tính nổi bật..." />
                </div>
                <div>
                  <label className={labelCls}>Thông tin chi tiết sản phẩm</label>
                  <div className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-inner bg-gray-50/30">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.description} 
                      onChange={(content) => setFormData((p: any) => ({ ...p, description: content }))}
                      className="product-editor"
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
              <div className="space-y-12 relative z-10">
                <div>
                  <label className={labelCls}>Ảnh đại diện đại diện (Main Thumbnail)</label>
                  <div className="max-w-xs mt-4">
                    <div onClick={() => document.getElementById('thumb-up')?.click()} className="aspect-square rounded-[2rem] bg-[#f8f9f8] border-2 border-dashed border-gray-200 relative overflow-hidden cursor-pointer hover:border-sage transition-all shadow-inner flex items-center justify-center group/thumb">
                      {formData.thumbnail ? 
                        <img src={formData.thumbnail} alt="" className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700" /> :
                        <div className="flex flex-col items-center text-gray-300">
                          <ImageIcon size={48} strokeWidth={1.5} className="mb-3 group-hover/thumb:scale-110 group-hover/thumb:text-sage transition-all" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Core Asset</span>
                        </div>
                      }
                      {uploading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"><div className="w-10 h-10 border-4 border-sage/10 border-t-sage rounded-full animate-spin" /></div>}
                      {formData.thumbnail && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="px-4 py-2 bg-white rounded-full text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-xl">Thay đổi ảnh</span>
                        </div>
                      )}
                    </div>
                    <input id="thumb-up" type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <label className={labelCls}>Bộ sưu tập Media (Gallery)</label>
                    <button 
                      type="button"
                      onClick={() => document.getElementById('gallery-up')?.click()}
                      className="px-4 py-2 bg-[#f8f9f8] text-sage rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sage hover:text-white transition-all shadow-sm flex items-center gap-2 border border-gray-50"
                    >
                      <Plus size={14} strokeWidth={3} /> Thêm ảnh
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {formData.images.map((url: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 relative group overflow-hidden shadow-sm">
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setFormData((p: any) => ({ ...p, images: p.images.filter((_: any, i: number) => i !== idx) }))} className="w-10 h-10 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-110 transition-all shadow-lg">
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/30 backdrop-blur-md rounded-md text-[8px] font-black text-white/80 uppercase tracking-widest">
                           #{idx + 1}
                        </div>
                      </div>
                    ))}
                    <div {...getRootProps()} className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all shadow-inner ${isDragActive ? 'border-sage bg-sage/5 text-sage' : 'border-gray-100 bg-gray-50/50 text-gray-300 hover:border-sage hover:bg-white hover:text-sage'}`}>
                      <input {...getInputProps()} />
                      {uploading ? (
                        <div className="w-8 h-8 border-4 border-sage/10 border-t-sage rounded-full animate-spin shadow-xl shadow-sage/10" />
                      ) : (
                        <>
                          <LayoutGrid size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-center px-4 leading-tight">{isDragActive ? 'Thả để tải' : 'Kéo thả thư viện'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50">
                  <label className={labelCls}>Trình chiếu Video (Marketing Asset)</label>
                  <div className="mt-4 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Link định danh (YouTube, TikTok...)</label>
                        <div className="relative group">
                          <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sage transition-colors" size={18} />
                          <input name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} className={`${inputCls} pl-14`} placeholder="https://www.youtube.com/watch?v=..." />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Hoặc lưu trữ nội bộ (MP4, Max 50MB)</label>
                        <button 
                          type="button"
                          disabled={uploading}
                          onClick={() => document.getElementById('video-up')?.click()}
                          className="w-full h-[60px] flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-100 bg-white hover:border-sage hover:bg-sage/5 hover:text-sage transition-all text-[11px] font-black uppercase tracking-widest text-gray-400 shadow-sm"
                        >
                          {uploading ? <div className="w-5 h-5 border-4 border-sage/10 border-t-sage rounded-full animate-spin" /> : <Upload size={18} strokeWidth={2.5} />}
                          Truy xuất Media
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
                      <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 bg-black aspect-video max-w-2xl relative shadow-2xl group/vid">
                        {formData.videoUrl.startsWith('/uploads/') ? (
                          <video src={formData.videoUrl} controls className="w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 text-xs text-center p-10 bg-[#1a2420]">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                               <Video size={40} className="text-sage" strokeWidth={1.5} />
                            </div>
                            <p className="font-bold tracking-tight">Video liên kết từ nguồn bên ngoài:</p>
                            <p className="text-[10px] opacity-60 mt-1 truncate max-w-sm">{formData.videoUrl}</p>
                          </div>
                        )}
                        <button 
                          onClick={() => setFormData((p: any) => ({ ...p, videoUrl: '' }))}
                          className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-xl group-hover/vid:scale-110"
                        >
                          <X size={20} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-10 relative z-10 max-w-3xl">
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className={labelCls}>Tiêu đề tối ưu SEO (Meta Title)</label>
                    <input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className={inputCls} placeholder="Tiêu đề hiển thị trên Google..." />
                    <div className="flex justify-between mt-2">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tối ưu từ 50-60 ký tự.</p>
                       <span className={`text-[10px] font-black ${formData.metaTitle?.length > 60 ? 'text-red-500' : 'text-sage'}`}>{formData.metaTitle?.length || 0}/60</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Mô tả tối ưu SEO (Meta Description)</label>
                    <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={4} className={`${inputCls} resize-none h-40 leading-relaxed`} placeholder="Tóm tắt nội dung thu hút người dùng nhấp chuột..." />
                    <div className="flex justify-between mt-2">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tối ưu từ 120-160 ký tự.</p>
                       <span className={`text-[10px] font-black ${formData.metaDescription?.length > 160 ? 'text-red-500' : 'text-sage'}`}>{formData.metaDescription?.length || 0}/160</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Từ khóa hệ thống (Tags)</label>
                    <div className="relative group">
                       <Database className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input name="tags" value={formData.tags} onChange={handleInputChange} className={`${inputCls} pl-14`} placeholder="thao moc, organic, herbspalab..." />
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-[#f8f9f8] rounded-lg flex items-center justify-center text-sage">
                       <Globe size={16} strokeWidth={2.5} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Xem trước hiển thị tìm kiếm (Google SERP)</p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-500/5 max-w-2xl">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          <img src="/logo-small.png" alt="" className="w-3 h-3 grayscale opacity-50" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] text-gray-900 font-medium">HerbSpaLab</span>
                          <span className="text-[9px] text-gray-400 font-medium -mt-1">herbspalab.com › products › {formData.sku || 'san-pham'}</span>
                       </div>
                    </div>
                    <h4 className="text-[20px] text-[#1a0dab] font-medium hover:underline cursor-pointer mb-1 leading-tight line-clamp-1">{formData.metaTitle || formData.name || 'Tiêu đề sản phẩm hiển thị tại đây'}</h4>
                    <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                      {formData.metaDescription || formData.shortDescription || 'Mô tả SEO sẽ xuất hiện ở đây để thu hút khách hàng tìm kiếm trên Google...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-10 relative z-10">
                <div className="flex items-center justify-between pb-8 border-b border-gray-50">
                  <div>
                    <h3 className="text-xl font-black text-[#1a2420] tracking-tight">Cấu hình Biến thể</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Quản lý kích thước, khối lượng, mùi hương riêng biệt.</p>
                  </div>
                  <button onClick={generateVariants} className="px-8 py-4 bg-[#1a2420] text-white rounded-[1.25rem] font-black text-xs hover:bg-[#2c3b2e] transition-all flex items-center gap-2 uppercase tracking-widest shadow-xl shadow-[#1a2420]/10">
                    <Layers size={16} strokeWidth={3} /> Khởi tạo ngay
                  </button>
                </div>

                <div className="bg-[#f8f9f8] p-10 rounded-[2.5rem] border border-gray-100 space-y-8 shadow-inner">
                  {attributes.map((attr: any) => (
                    <div key={attr.id} className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer w-fit group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedAttrs.includes(attr.id) ? 'border-sage bg-sage' : 'border-gray-200 bg-white'}`}>
                           {selectedAttrs.includes(attr.id) && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="font-black text-[#1a2420] text-[15px] tracking-tight group-hover:text-sage transition-colors">{attr.name}</span>
                        <input type="checkbox" checked={selectedAttrs.includes(attr.id)} onChange={() => {
                          setSelectedAttrs(p => p.includes(attr.id) ? p.filter(a => a !== attr.id) : [...p, attr.id]);
                          if (selectedAttrs.includes(attr.id)) setSelectedValues(p => { const n = { ...p }; delete n[attr.id]; return n; });
                        }} className="hidden" />
                      </label>
                      
                      {selectedAttrs.includes(attr.id) && (
                        <div className="flex flex-wrap gap-3 pl-9 animate-fadeIn">
                          {attr.values?.map((v: any) => {
                            const sel = (selectedValues[attr.id] || []).includes(v.id);
                            return (
                              <button key={v.id} onClick={() => setSelectedValues(p => {
                                const cur = p[attr.id] || [];
                                return { ...p, [attr.id]: sel ? cur.filter(x => x !== v.id) : [...cur, v.id] };
                              })} className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all border-2 ${sel ? 'bg-sage text-white border-sage shadow-lg shadow-sage/20 scale-105' : 'bg-white text-gray-400 border-white hover:border-sage hover:text-sage'}`}>
                                {v.value}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                  {attributes.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-[2rem] border border-gray-50">
                      <AlertCircle size={32} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm font-bold">Chưa có thuộc tính cơ sở.</p>
                      <button onClick={() => navigate('/admin/attributes')} className="mt-3 px-5 py-2 bg-[#1a2420] text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Thiết lập ngay</button>
                    </div>
                  )}
                </div>

                {formData.variants.length > 0 ? (
                  <div className="rounded-[2.5rem] border border-gray-50 overflow-hidden bg-white shadow-xl shadow-gray-500/5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#f8f9f8] border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Phân loại chi tiết</th>
                            <th className="px-8 py-5">Định danh SKU</th>
                            <th className="px-8 py-5 text-center">Giá riêng (₫)</th>
                            <th className="px-8 py-5 text-center">Tồn kho</th>
                            <th className="px-8 py-5 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {formData.variants.map((v: any, idx: number) => (
                            <tr key={idx} className="group hover:bg-[#f8f9f8] transition-all">
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-sage shadow-lg shadow-sage/50"></div>
                                    <span className="text-[13px] font-black text-[#1a2420] tracking-tight">{v.label}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                <input value={v.sku} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], sku: e.target.value }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-sage outline-none text-[11px] font-mono font-black uppercase tracking-tighter" />
                              </td>
                              <td className="px-8 py-5">
                                <div className="relative">
                                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-[10px]">₫</span>
                                   <input type="number" value={v.price} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], price: Number(e.target.value) }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="w-32 px-4 py-2.5 pl-7 mx-auto block rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-sage outline-none text-[12px] font-black text-center" />
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <input type="number" value={v.stock} onChange={e => { const vv = [...formData.variants]; vv[idx] = { ...vv[idx], stock: Number(e.target.value) }; setFormData((p: any) => ({ ...p, variants: vv })); }} className="w-24 px-4 py-2.5 mx-auto block rounded-xl bg-[#1a2420] text-white border-none outline-none text-[12px] font-black text-center shadow-lg shadow-[#1a2420]/10" />
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button onClick={() => setFormData((p: any) => ({ ...p, variants: p.variants.filter((_: any, i: number) => i !== idx) }))} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                  <Trash2 size={18} strokeWidth={2.5} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#f8f9f8] py-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center shadow-inner group">
                    <Database size={48} className="text-gray-200 mx-auto mb-5 group-hover:scale-110 group-hover:text-sage transition-all duration-500" strokeWidth={1} />
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Inventory Matrix Empty</h4>
                    <p className="text-xs text-gray-300 font-medium max-w-xs mx-auto mt-2 leading-relaxed">Chọn các thuộc tính cơ bản và khởi tạo ma trận biến thể để quản lý đa chiều.</p>
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
