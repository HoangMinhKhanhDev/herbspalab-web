import React, { useEffect, useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Upload } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, adminUploadSingle } from '../../api/adminApi';
import toast from 'react-hot-toast';

import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoadingSkeleton from '../../components/admin/AdminLoadingSkeleton';
import AdminModal from '../../components/admin/AdminModal';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', slug: '', parentId: '', description: '', banner: '', metaTitle: '', metaDescription: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try { 
      const data = await getCategories(); 
      setCategories(data); 
      // Expand all by default
      setExpandedIds(data.map((c: any) => c.id));
    }
    catch (e: any) { toast.error('Lỗi tải danh mục'); }
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
    setIsModalOpen(true);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const { data } = await adminUploadSingle(file); setFormData(p => ({ ...p, banner: data.url })); toast.success('Tải banner thành công'); }
    catch { toast.error('Lỗi tải banner'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sub = { ...formData, parentId: formData.parentId === '' ? null : formData.parentId };
      if (editingCategory) { await updateCategory(editingCategory.id, sub); toast.success('Cập nhật thành công'); }
      else { await createCategory(sub); toast.success('Tạo danh mục thành công'); }
      setIsModalOpen(false); loadCategories();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Lỗi lưu danh mục'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa danh mục này và các danh mục con?')) return;
    try { await deleteCategory(id); toast.success('Đã xóa'); loadCategories(); }
    catch (e: any) { toast.error('Lỗi xóa'); }
  };

  const openNew = (parentId?: string) => { 
    setEditingCategory(null); 
    setFormData({ 
      name: '', 
      slug: '', 
      parentId: parentId || '', 
      description: '', 
      banner: '', 
      metaTitle: '', 
      metaDescription: '' 
    }); 
    setIsModalOpen(true); 
  };

  const CategoryNode = ({ category, level = 0 }: { category: any, level: number }) => {
    const children = categories.filter(c => c.parentId === category.id);
    const isExpanded = expandedIds.includes(category.id);
    const hasChildren = children.length > 0;

    return (
      <div className="animate-in fade-in slide-in-from-left-2 duration-300 relative group">
        {level > 0 && (
           <div className="absolute top-0 bottom-0 w-px bg-black/5" style={{ left: `${level * 40 - 20}px` }} />
        )}
        {level > 0 && (
           <div className="absolute w-4 h-px bg-black/5 top-9" style={{ left: `${level * 40 - 20}px` }} />
        )}
        <div 
          className="flex items-start gap-4 py-4 hover:bg-gray-50/50 transition-colors rounded-2xl pr-4 relative z-10"
          style={{ paddingLeft: `${level === 0 ? 0 : level * 40}px` }}
        >
          {/* Folder Icon Box */}
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center text-sage/20 shadow-sm shrink-0">
            {category.banner ? (
              <img src={category.banner} className="w-full h-full object-cover rounded-xl" alt="" />
            ) : (
              <Folder className="w-4 h-4" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sage text-sm tracking-tight">{category.name}</h4>
              {hasChildren && (
                <button onClick={() => toggleExpand(category.id)} className="p-1 hover:bg-gray-100 rounded-md transition-colors focus:ring-2 focus:ring-mint outline-none">
                  {isExpanded ? <ChevronDown className="w-3 h-3 text-sage/30" /> : <ChevronRight className="w-3 h-3 text-sage/30" />}
                </button>
              )}
            </div>
            <p className="text-[10px] text-sage/30 font-medium lowercase tracking-tight">
              /{category.slug} • {category._count?.products || 0} sản phẩm
            </p>
            <div className="flex items-center gap-4 pt-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
              <button onClick={() => handleEdit(category)} className="text-[10px] font-bold text-sage/40 hover:text-mint transition-colors">Sửa</button>
              <button onClick={() => handleDelete(category.id)} className="text-[10px] font-bold text-sage/40 hover:text-red-400 transition-colors">Xóa</button>
              <button onClick={() => openNew(category.id)} className="text-[10px] font-bold text-sage/40 hover:text-gold transition-colors flex items-center gap-1">
                + Thêm con
              </button>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-0">
            {children.map(child => (
              <CategoryNode key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto py-4">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-display italic text-sage tracking-tight">Danh mục</h1>
        <button onClick={() => openNew()} className="px-8 py-3 bg-ink text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mint transition-all shadow-xl">
          + THÊM DANH MỤC
        </button>
      </div>

      {loading ? (
        <AdminLoadingSkeleton type="list" count={6} />
      ) : (
        <>
          {/* List Area */}
          <div className="space-y-1">
            {categories.filter(c => !c.parentId).map((parent) => (
              <CategoryNode key={parent.id} category={parent} level={0} />
            ))}
            
            {categories.length === 0 && (
              <AdminEmptyState
                icon={Folder}
                title="Chưa có danh mục sản phẩm"
                description="Tạo các danh mục để phân loại sản phẩm của bạn một cách rõ ràng và khoa học."
                actionLabel="+ THÊM DANH MỤC"
                onAction={() => openNew()}
              />
            )}
          </div>
        </>
      )}

      {/* Modal Overlay */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Biên tập danh mục' : 'Thêm danh mục'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-sage/40 uppercase tracking-widest px-1">Tên danh mục *</label>
            <input 
              required 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-mint focus:bg-white outline-none text-sage font-bold transition-all shadow-sm" 
              placeholder="Ví dụ: Chăm sóc da" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-sage/40 uppercase tracking-widest px-1">URL Slug</label>
            <input 
              required 
              value={formData.slug} 
              onChange={e => setFormData({ ...formData, slug: e.target.value })} 
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-mint focus:bg-white outline-none text-sage/60 font-mono text-xs transition-all shadow-sm" 
              placeholder="Tự động tạo từ tên" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-sage/40 uppercase tracking-widest px-1">Danh mục cha</label>
            <select 
              value={formData.parentId} 
              onChange={e => setFormData({ ...formData, parentId: e.target.value })} 
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-mint focus:bg-white outline-none text-sage font-bold cursor-pointer transition-all shadow-sm"
            >
              <option value="">— Không (Cấp cao nhất) —</option>
              {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-sage/40 uppercase tracking-widest px-1">Mô tả SEO</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              rows={3} 
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-mint focus:bg-white outline-none text-sage text-sm font-medium resize-none transition-all shadow-sm" 
              placeholder="..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-sage/40 uppercase tracking-widest px-1">Ảnh banner</label>
            <div className="flex gap-3">
              <input 
                value={formData.banner} 
                onChange={e => setFormData({ ...formData, banner: e.target.value })} 
                className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-mint focus:bg-white outline-none text-sage/40 text-xs transition-all shadow-sm" 
                placeholder="URL hoặc upload" 
              />
              <button 
                type="button"
                onClick={() => document.getElementById('cat-upload')?.click()}
                className="px-6 py-4 bg-white border border-black/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm focus:ring-2 focus:ring-mint outline-none"
              >
                <Upload className="w-3.5 h-3.5" /> {uploading ? '...' : 'Upload'}
              </button>
              <input id="cat-upload" type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-black/5 mt-8">
            <button type="submit" className="flex-1 py-4 bg-ink text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-mint focus:ring-2 focus:ring-offset-2 focus:ring-mint transition-all shadow-xl outline-none">
              LƯU
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-black/10 text-sage/40 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-sage focus:ring-2 focus:ring-black/10 transition-all outline-none">
              Hủy
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default CategoryManager;

