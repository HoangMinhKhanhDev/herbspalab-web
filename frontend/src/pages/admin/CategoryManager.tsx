import React, { useEffect, useState } from 'react';
import { 
  Folder, ChevronRight, ChevronDown, Upload, Plus, Edit, Trash2, X, 
  Image as ImageIcon, Database, CheckCircle2, Info, Layers, 
  Globe, Layout, ChevronLeft, Loader2, Sparkles, Send
} from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, adminUploadSingle } from '../../api/adminApi';
import toast from 'react-hot-toast';

const emptyForm = { name: '', slug: '', parentId: '', description: '', banner: '', metaTitle: '', metaDescription: '' };

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
      setExpandedIds(data.map((c: any) => c.id));
    } catch { toast.error('Lỗi tải danh mục'); }
    finally { setLoading(false); }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || '',
      description: cat.description || '',
      banner: cat.banner || '',
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || ''
    });
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const { data } = await adminUploadSingle(file);
      setFormData(p => ({ ...p, banner: data.url }));
      toast.success('Tải banner thành công');
    } catch { toast.error('Lỗi tải banner'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Vui lòng nhập tên danh mục');
    setSaving(true);
    try {
      const sub = { ...formData, parentId: formData.parentId === '' ? null : formData.parentId };
      if (editingCategory) {
        await updateCategory(editingCategory.id, sub);
        toast.success('Cập nhật thành công');
      } else {
        await createCategory(sub);
        toast.success('Tạo danh mục thành công');
      }
      loadCategories();
      resetForm();
    } catch (e: any) { 
       toast.error(e.response?.data?.message || 'Lỗi lưu danh mục'); 
    } finally {
       setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa danh mục này và các danh mục con?')) return;
    try { await deleteCategory(id); toast.success('Đã xóa'); loadCategories(); if(editingCategory?.id === id) resetForm(); }
    catch { toast.error('Lỗi xóa'); }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
  };

  const CategoryNode = ({ category, level = 0 }: { category: any, level: number }) => {
    const children = categories.filter(c => c.parentId === category.id);
    const isExpanded = expandedIds.includes(category.id);
    const isSelected = editingCategory?.id === category.id;

    return (
      <div className="relative">
        <div className={`flex items-center gap-2 group p-2 rounded-xl transition-all cursor-pointer ${isSelected ? 'bg-sage text-white' : 'hover:bg-gray-50'}`}
             onClick={() => handleEdit(category)}>
          <div className="flex items-center gap-1" style={{ marginLeft: `${level * 20}px` }}>
            {children.length > 0 ? (
              <button onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }} className={`p-1 rounded-md ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : <div className="w-6" />}
            <Folder size={16} className={isSelected ? 'text-white' : 'text-[#bca37f]'} />
            <span className={`text-[13px] font-bold truncate max-w-[150px] ${isSelected ? 'text-white' : 'text-gray-700'}`}>{category.name}</span>
          </div>
          <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-1 pr-2">
             <button onClick={(e) => { e.stopPropagation(); setFormData({...emptyForm, parentId: category.id}); setEditingCategory(null); }} className="p-1.5 hover:bg-black/10 rounded-lg text-inherit"><Plus size={12}/></button>
             <button onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }} className="p-1.5 hover:bg-red-500 hover:text-white rounded-lg text-inherit"><Trash2 size={12}/></button>
          </div>
        </div>
        {isExpanded && children.map(child => <CategoryNode key={child.id} category={child} level={level + 1} />)}
      </div>
    );
  };

  if (loading && categories.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="w-14 h-14 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto mb-6 shadow-xl shadow-sage/10"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Đang nạp sơ đồ danh mục...</p>
    </div>
  );

  const inp = "w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/5 outline-none font-bold text-gray-900 transition-all text-[13px] placeholder:text-gray-400";
  const lbl = "block text-[12px] font-black text-gray-800 tracking-wide mb-2";

  const rootCategories = categories.filter(c => !c.parentId);

  return (
    <div className="max-w-7xl mx-auto pb-32">
       {/* Unified Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-4 z-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-[#1a2420] text-[#bca37f] text-[10px] font-black uppercase tracking-widest rounded-full">Archive Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#1a2420] tracking-tight">Ngành hàng & Danh mục</h1>
        </div>
        <button onClick={resetForm} className="px-6 py-3 rounded-xl bg-[#1a2420] text-white font-black text-xs hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-black/20">
          <Plus size={16} strokeWidth={3} /> Danh mục gốc
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* LEFT: CATEGORY TREE (5/12) */}
         <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Cấu trúc phân cấp</p>
               <Layers size={14} className="text-gray-300"/>
            </div>
            <div className="p-4 space-y-1">
               {rootCategories.map(cat => <CategoryNode key={cat.id} category={cat} level={0} />)}
               {rootCategories.length === 0 && (
                  <div className="text-center py-20">
                     <Folder size={32} className="mx-auto text-gray-100 mb-3" />
                     <p className="text-[10px] font-black text-gray-300 uppercase">Chưa có danh mục</p>
                  </div>
               )}
            </div>
         </div>

         {/* RIGHT: EDIT/CREATE FORM (7/12) */}
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <div>
                    <h3 className="text-lg font-black text-[#1a2420] tracking-tight">
                       {editingCategory ? 'Chỉnh sửa danh mục' : formData.parentId ? 'Thêm danh mục con' : 'Thêm danh mục gốc'}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                       {editingCategory ? `ID: #${editingCategory.id.slice(-6)}` : 'Create new category entry'}
                    </p>
                  </div>
                  {editingCategory && (
                     <button onClick={resetForm} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
                  )}
               </div>

               <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className={lbl}>Tên danh mục *</label>
                        <input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className={inp} placeholder="VD: Sữa rửa mặt..." />
                     </div>
                     <div>
                        <label className={lbl}>Đường dẫn tĩnh (Slug)</label>
                        <input name="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className={`${inp} font-mono text-[12px]`} placeholder="sua-rua-mat" />
                     </div>
                  </div>

                  <div>
                     <label className={lbl}>Mô tả</label>
                     <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className={`${inp} resize-none`} placeholder="Giới thiệu ngắn về ngành hàng này..." />
                  </div>

                  <div>
                     <label className={lbl}>Ảnh Banner / Đại diện</label>
                     <div onClick={() => document.getElementById('cat-banner')?.click()} className="aspect-[21/9] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all relative overflow-hidden group">
                        {formData.banner ? (
                           <>
                             <img src={formData.banner} className="w-full h-full object-cover" alt="" />
                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-black uppercase tracking-widest">Thay đổi banner</div>
                           </>
                        ) : (
                           <div className="text-center text-gray-400">
                              <ImageIcon size={32} className="mx-auto mb-2 opacity-20"/>
                              <p className="text-[10px] font-bold uppercase">Tải banner ngành hàng</p>
                           </div>
                        )}
                        {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-sage" size={24}/></div>}
                     </div>
                     <input id="cat-banner" type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                  </div>

                  {/* SEO Card inside Form */}
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-5">
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14}/> Cấu hình SEO (Tùy chọn)</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className={lbl}>Meta Title</label>
                           <input name="metaTitle" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} className={inp} placeholder="Tiêu đề Google..." />
                        </div>
                        <div>
                           <label className={lbl}>Meta Description</label>
                           <textarea name="metaDescription" value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} rows={2} className={`${inp} resize-none`} placeholder="Mô tả SEO..." />
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                     <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest">Làm mới</button>
                     <button type="submit" disabled={saving} className="btn-admin-primary">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : editingCategory ? <Send size={16}/> : <Plus size={16}/>}
                        {saving ? 'Đang lưu...' : editingCategory ? 'Cập nhật danh mục' : 'Khởi tạo danh mục'}
                     </button>
                  </div>
               </form>
            </div>

            {/* Quick Stats / Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center"><Layout size={24}/></div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngành hàng cha</p>
                     <p className="text-xl font-black text-gray-800">{rootCategories.length}</p>
                  </div>
               </div>
               <div className="bg-[#1a2420] p-6 rounded-2xl flex items-center gap-4 shadow-xl shadow-sage/10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 text-[#bca37f] flex items-center justify-center"><Sparkles size={24}/></div>
                  <div>
                     <p className="text-[10px] font-black text-[#bca37f]/60 uppercase tracking-widest">Tổng danh mục</p>
                     <p className="text-xl font-black text-white">{categories.length}</p>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default CategoryManager;
