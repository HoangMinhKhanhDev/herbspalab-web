import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, FileText, Database, 
  Plus, Trash2, Video, Globe, Sparkles, Loader2, 
  Info, Layers, Clock, Zap, CheckCircle2, AlertCircle, Upload, Box, Truck, Tag, Settings, Ruler
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

  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: '', sku: '', badge: '', shortDescription: '', description: '',
    thumbnail: '', images: [], videoUrl: '',
    price: '', salePrice: '', stock: '', categoryId: '',
    isNew: false, isPreorder: false, preparationTime: '2-3',
    tags: '', metaTitle: '', metaDescription: '', variants: [],
    // New Shopee-style fields
    brand: 'No Brand', material: '', condition: 'Mới',
    weight: '', length: '', width: '', height: '', sizeGuideUrl: ''
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
            preparationTime: product.preparationTime || '2-3',
            brand: product.brand || 'No Brand',
            material: product.material || '',
            condition: product.condition || 'Mới',
            weight: product.weight || '',
            length: product.length || '',
            width: product.width || '',
            height: product.height || '',
            sizeGuideUrl: product.sizeGuideUrl || ''
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
    if (formData.images.length + acceptedFiles.length > 8) {
       return toast.error('Chỉ được tải lên tối đa 8 ảnh.');
    }
    setUploading(true);
    try {
      const compressedFiles = await Promise.all(
        acceptedFiles.map(file => imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true }))
      );
      const { data } = await adminUploadMultiple(compressedFiles);
      setFormData((p: any) => ({ ...p, images: [...p.images, ...data.map((d: any) => d.url)].slice(0,8) }));
      toast.success(`Đã tải lên ${data.length} ảnh`);
    } catch (er: any) { 
      toast.error('Lỗi khi tải ảnh hàng loạt'); 
    } finally { 
      setUploading(false); 
    }
  }, [formData.images.length]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true, maxFiles: 8 });

  const generateVariants = () => {
    if (selectedAttrs.length === 0) return toast.error('Vui lòng chọn ít nhất 1 thuộc tính');
    const validAttrs = selectedAttrs.filter(a => selectedValues[a] && selectedValues[a].length > 0);
    if (validAttrs.length === 0) return toast.error('Vui lòng chọn giá trị cho thuộc tính');

    const arraysToCombine = validAttrs.map(aId => {
      const attr = attributes.find(a => a.id === aId);
      return selectedValues[aId].map(vId => {
        const val = attr?.values.find((v: any) => v.id === vId);
        return { attributeId: aId, valueId: vId, label: val?.value };
      });
    });

    const combine = (arrays: any[][]): any[][] => arrays.reduce((a, b) => a.flatMap(x => b.map(y => [...x, y])), [[]]);
    const combinations = combine(arraysToCombine);

    const newVariants = combinations.map(combo => ({
      label: combo.map((c: any) => c.label).join(' - '),
      price: Number(formData.price) || 0,
      stock: 0,
      sku: `${formData.sku || 'SKU'}-${combo.map((c: any) => c.label.substring(0, 3).toUpperCase()).join('-')}`,
      options: combo.map((c: any) => ({ attributeId: c.attributeId, valueId: c.valueId }))
    }));

    setFormData((p: any) => ({ ...p, variants: newVariants }));
    toast.success(`Đã tạo ${newVariants.length} biến thể`);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
       return toast.error('Vui lòng điền đủ tên sản phẩm, giá bán và ngành hàng');
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        stock: Number(formData.stock) || 0,
      };
      if (isEdit) {
        await updateProduct(id!, payload);
        toast.success('Cập nhật thành công');
      } else {
        await createProduct(payload);
        toast.success('Tạo sản phẩm thành công');
        navigate('/admin/products');
      }
    } catch (er: any) { 
      toast.error(er.response?.data?.message || 'Lỗi khi lưu sản phẩm'); 
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

  const inp = "w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/5 outline-none font-bold text-gray-900 transition-all text-[13px] placeholder:text-gray-400";
  const lbl = "block text-[12px] font-black text-gray-800 tracking-wide mb-2";
  const card = "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8";
  const cardH = "px-6 py-5 border-b border-gray-50 bg-white flex items-center justify-between";

  return (
    <div className="pb-32 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-4 z-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-[#1a2420] text-[#bca37f] text-[10px] font-black uppercase tracking-widest rounded-full">Kênh Người Bán</span>
            {isEdit && <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">ID: #{id?.slice(-6)}</span>}
          </div>
          <h1 className="text-2xl font-black text-[#1a2420] tracking-tight">{isEdit ? 'Cập nhật Sản phẩm' : 'Đăng Sản phẩm Mới'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/products')} className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-black text-xs hover:bg-gray-50 hover:border-gray-300 transition-all uppercase tracking-widest shadow-sm">Hủy bỏ</button>
          <button onClick={handleSave} disabled={saving} className="btn-admin-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={3} />}
            {saving ? 'Đang lưu...' : 'Lưu & Hiển thị'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main 1-Column Content Layout Shopee-Style */}
        <div className="col-span-1 lg:col-span-3">

          {/* 1. THÔNG TIN CƠ BẢN */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Info size={18} className="text-[#bca37f]"/> 1. Thông tin cơ bản</p>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <label className={lbl}>Tên sản phẩm <span className="text-red-500">*</span></label>
                <input name="name" value={formData.name} onChange={handleInputChange} className={inp} placeholder="Công thức: Thương hiệu – Thông số kỹ thuật, loại sản phẩm – Mã sản phẩm..." />
                <p className="text-[11px] text-gray-400 mt-2">Tránh viết in hoa toàn bộ chữ cái, sử dụng kí hiệu không cần thiết hay spam từ khóa không liên quan.</p>
              </div>

              <div>
                <label className={lbl}>Ngành hàng (Danh mục) <span className="text-red-500">*</span></label>
                <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className={`${inp} appearance-none cursor-pointer border-gray-200`}>
                  <option value="">Chọn ngành hàng cho sản phẩm của bạn</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Shopee-style Image Upload */}
              <div>
                 <label className={lbl}>Hình ảnh sản phẩm <span className="text-red-500">*</span></label>
                 <div className="flex gap-4 items-start flex-wrap">
                   {/* Thumbnail Box */}
                   <div className="flex flex-col gap-2">
                     <div onClick={() => document.getElementById('thumb-up')?.click()} className="w-32 h-32 rounded-lg bg-gray-50 border-2 border-dashed border-[#bca37f]/50 flex items-center justify-center cursor-pointer hover:bg-[#bca37f]/5 transition-all overflow-hidden relative group">
                       {formData.thumbnail ? <img src={formData.thumbnail} className="w-full h-full object-cover" alt="" /> : <div className="text-center text-[#bca37f]"><ImageIcon size={24} className="mx-auto mb-1"/><span className="text-[10px] font-bold">Ảnh bìa</span></div>}
                     </div>
                     <input id="thumb-up" type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                   </div>

                   {/* Gallery Boxes (Shopee usually shows 8 blocks) */}
                   <div className="flex-1">
                      <div className="flex gap-4 flex-wrap">
                        {formData.images.map((url: string, idx: number) => (
                           <div key={idx} className="w-32 h-32 rounded-lg bg-gray-50 border border-gray-200 relative group overflow-hidden">
                             <img src={url} alt="" className="w-full h-full object-cover" />
                             <div className="absolute bottom-0 inset-x-0 h-8 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => setFormData((p: any) => ({ ...p, images: p.images.filter((_: any, i: number) => i !== idx) }))} className="text-white hover:text-red-400">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </div>
                        ))}
                        {formData.images.length < 8 && (
                           <div {...getRootProps()} className="w-32 h-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                             <input {...getInputProps()} />
                             <div className="text-center text-gray-400"><Plus size={24} className="mx-auto mb-1"/><span className="text-[10px] font-bold">Thêm ảnh ({formData.images.length}/8)</span></div>
                           </div>
                        )}
                      </div>
                   </div>
                 </div>
              </div>

              {/* Video */}
              <div>
                 <label className={lbl}>Video sản phẩm</label>
                 <div className="flex items-center gap-4">
                    <button type="button" onClick={() => document.getElementById('video-up')?.click()} className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-gray-100">
                      <Upload size={16}/> Tải Video (MP4)
                    </button>
                    <input id="video-up" type="file" accept="video/mp4,video/quicktime" className="hidden" onChange={async (e) => {
                       const file = e.target.files?.[0]; if(!file) return; setUploading(true);
                       try { const { data } = await adminUploadSingle(file); setFormData((p:any) => ({...p, videoUrl: data.url})); toast.success('Tải video thành công'); } 
                       catch(err) { toast.error('Lỗi tải video'); } finally { setUploading(false); }
                    }} />
                    <span className="text-[12px] text-gray-500 font-medium">Hoặc YouTube:</span>
                    <input name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} className={`${inp} flex-1`} placeholder="Nhập link Youtube" />
                 </div>
                 {formData.videoUrl && <div className="mt-3 text-[12px] font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> Đã đính kèm 1 Video</div>}
              </div>

              <div>
                <label className={lbl}>Mô tả sản phẩm <span className="text-red-500">*</span></label>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <ReactQuill theme="snow" value={formData.description} onChange={(c) => setFormData((p: any) => ({ ...p, description: c }))} className="product-editor h-64"
                    modules={{ toolbar: [[{ header: [1,2,3,false] }],['bold','italic','underline','strike'],[{list:'ordered'},{list:'bullet'}],['link','image','video'],['clean']] }} />
                </div>
                <p className="text-[11px] text-gray-400 mt-2">Cung cấp đầy đủ thông tin chi tiết, thông số kỹ thuật, lợi ích và bảo hành (nếu có).</p>
              </div>
            </div>
          </div>

          {/* 2. THÔNG TIN CHI TIẾT */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Settings size={18} className="text-[#bca37f]"/> 2. Thông tin chi tiết</p>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
               <div>
                  <label className={lbl}>Thương hiệu <span className="text-red-500">*</span></label>
                  <input name="brand" value={formData.brand} onChange={handleInputChange} className={inp} placeholder="VD: HerbSpaLab" />
               </div>
               <div>
                  <label className={lbl}>Chất liệu / Thành phần</label>
                  <input name="material" value={formData.material} onChange={handleInputChange} className={inp} placeholder="VD: 100% Cotton, Thảo dược tự nhiên..." />
               </div>
            </div>
          </div>

          {/* 3. THÔNG TIN BÁN HÀNG */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Tag size={18} className="text-[#bca37f]"/> 3. Thông tin bán hàng</p>
            </div>
            <div className="p-8 space-y-8 bg-[#fafafa]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={lbl}>Giá bán (₫) <span className="text-red-500">*</span></label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={inp} placeholder="0 ₫" />
                </div>
                <div>
                  <label className={lbl}>Kho hàng <span className="text-red-500">*</span></label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={inp} placeholder="0" />
                </div>
              </div>

              <div>
                 <label className={lbl}>Phân loại hàng (Màu sắc, Kích cỡ)</label>
                 <div className="bg-white p-6 rounded-xl border border-gray-200">
                    {/* Simplified Attribute Picker for Shopee Style */}
                    <div className="space-y-4 mb-4">
                      {attributes.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                          <AlertCircle size={24} className="text-gray-300 mx-auto mb-2"/>
                          <p className="text-[12px] text-gray-500 font-bold mb-3">Chưa có thuộc tính nào được thiết lập</p>
                          <button onClick={() => navigate('/admin/attributes')} className="px-4 py-2 bg-[#ee4d2d] text-white rounded font-bold text-[11px] hover:bg-[#d73f22]">Thiết lập thuộc tính ngay</button>
                        </div>
                      ) : (
                        attributes.map((attr: any) => (
                          <div key={attr.id} className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" className="w-4 h-4 accent-[#1a2420]" checked={selectedAttrs.includes(attr.id)} onChange={() => {
                                setSelectedAttrs(p => p.includes(attr.id) ? p.filter(a => a !== attr.id) : [...p, attr.id]);
                                if (selectedAttrs.includes(attr.id)) setSelectedValues(p => { const n={...p}; delete n[attr.id]; return n; });
                              }}/>
                              <span className="text-[13px] font-bold text-gray-800">{attr.name}</span>
                            </label>
                            {selectedAttrs.includes(attr.id) && (
                              <div className="flex flex-wrap gap-2 pl-6 mt-2">
                                {attr.values?.map((v: any) => {
                                  const sel = (selectedValues[attr.id]||[]).includes(v.id);
                                  return <button type="button" key={v.id} onClick={() => setSelectedValues(p => { const cur=p[attr.id]||[]; return {...p,[attr.id]:sel?cur.filter((x:string)=>x!==v.id):[...cur,v.id]}; })}
                                    className={`px-4 py-1.5 rounded text-[12px] font-medium border ${sel?'bg-[#1a2420] text-white border-[#1a2420]':'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>{v.value}</button>;
                                })}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    
                    {attributes.length > 0 && (
                      <button type="button" onClick={generateVariants} className="px-5 py-2 bg-gray-100 text-gray-700 font-bold text-[12px] rounded border border-gray-200 hover:bg-gray-200">
                         Thiết lập phân loại hàng
                      </button>
                    )}

                    {formData.variants.length > 0 && (
                      <div className="mt-6 border border-gray-200 rounded overflow-hidden">
                        <table className="w-full text-left bg-white">
                          <thead><tr className="bg-gray-50 border-b border-gray-200 text-[12px] font-bold text-gray-600">
                            <th className="px-4 py-3">Phân loại hàng</th><th className="px-4 py-3">Giá (₫)</th><th className="px-4 py-3">Kho hàng</th><th className="px-2 py-3"></th>
                          </tr></thead>
                          <tbody className="divide-y divide-gray-100">
                            {formData.variants.map((v: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-[12px] font-medium text-gray-800">{v.label}</td>
                                <td className="px-4 py-3"><input type="number" value={v.price} onChange={e => { const vv=[...formData.variants]; vv[idx]={...vv[idx],price:Number(e.target.value)}; setFormData((p:any)=>({...p,variants:vv})); }} className="w-full px-3 py-1.5 rounded border border-gray-300 outline-none focus:border-[#1a2420]"/></td>
                                <td className="px-4 py-3"><input type="number" value={v.stock} onChange={e => { const vv=[...formData.variants]; vv[idx]={...vv[idx],stock:Number(e.target.value)}; setFormData((p:any)=>({...p,variants:vv})); }} className="w-full px-3 py-1.5 rounded border border-gray-300 outline-none focus:border-[#1a2420]"/></td>
                                <td className="px-2 py-3"><button type="button" onClick={() => setFormData((p:any)=>({...p,variants:p.variants.filter((_:any,i:number)=>i!==idx)}))} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                 </div>
              </div>




            </div>
          </div>

          {/* 4. VẬN CHUYỂN */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Truck size={18} className="text-[#ee4d2d]"/> 4. Vận chuyển</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#fdfdfd]">
               <div>
                  <label className={lbl}>Cân nặng sau khi đóng gói (Gram) <span className="text-red-500">*</span></label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className={inp} placeholder="VD: 500" />
               </div>
               <div>
                  <label className={lbl}>Kích thước đóng gói (Phí vận chuyển sẽ thay đổi)</label>
                  <div className="flex gap-2 items-center">
                     <input type="number" name="length" value={formData.length} onChange={handleInputChange} className={inp} placeholder="D" />
                     <span className="text-gray-400">x</span>
                     <input type="number" name="width" value={formData.width} onChange={handleInputChange} className={inp} placeholder="R" />
                     <span className="text-gray-400">x</span>
                     <input type="number" name="height" value={formData.height} onChange={handleInputChange} className={inp} placeholder="C" />
                     <span className="text-gray-400 text-xs font-bold">cm</span>
                  </div>
               </div>
            </div>
          </div>

          {/* 5. THÔNG TIN KHÁC */}
          <div className={card}>
            <div className={cardH}>
               <p className="text-[14px] font-black text-[#1a2420] flex items-center gap-2"><Box size={18} className="text-[#bca37f]"/> 4. Thông tin khác</p>
            </div>
            <div className="p-8 space-y-6">
               <div className="flex items-center gap-10">
                  <label className={lbl + " !mb-0 w-32"}>Hàng đặt trước</label>
                  <div className="flex items-center gap-4 flex-1">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input type="radio" name="isPreorder" checked={!formData.isPreorder} onChange={() => setFormData((p:any)=>({...p, isPreorder: false}))} className="w-4 h-4 accent-[#1a2420]"/>
                       <span className="text-[13px] text-gray-800">Không</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input type="radio" name="isPreorder" checked={formData.isPreorder} onChange={() => setFormData((p:any)=>({...p, isPreorder: true}))} className="w-4 h-4 accent-[#1a2420]"/>
                       <span className="text-[13px] text-gray-800">Đồng ý</span>
                     </label>
                  </div>
               </div>
               {formData.isPreorder && (
                 <div className="flex items-center gap-10 pl-[168px]">
                   <input name="preparationTime" value={formData.preparationTime} onChange={handleInputChange} className={inp} placeholder="Thời gian chuẩn bị hàng (ngày). VD: 7" />
                 </div>
               )}

               <div className="flex items-center gap-10">
                  <label className={lbl + " !mb-0 w-32"}>Tình trạng</label>
                  <select name="condition" value={formData.condition} onChange={handleInputChange} className={`${inp} flex-1 appearance-none border-gray-200`}>
                     <option>Mới</option>
                     <option>Đã sử dụng</option>
                  </select>
               </div>

               <div className="flex items-center gap-10">
                  <label className={lbl + " !mb-0 w-32"}>SKU Sản phẩm</label>
                  <input name="sku" value={formData.sku} onChange={handleInputChange} className={`${inp} flex-1 font-mono`} placeholder="Mã phân loại do hệ thống Shop tự định nghĩa" />
               </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar - Optional Tool/Stats (Shopee has a small right menu) */}
        <div className="hidden lg:block col-span-1">
          <div className="sticky top-28 space-y-4">
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[12px] font-black text-gray-800 mb-3 uppercase">Danh mục kiểm tra</p>
                <ul className="space-y-3">
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.name ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Tên sản phẩm</li>
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.categoryId ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Ngành hàng</li>
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.thumbnail ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Hình ảnh</li>
                   <li className={`text-[12px] font-bold flex items-center gap-2 ${formData.price ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle2 size={16}/> Giá bán</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
