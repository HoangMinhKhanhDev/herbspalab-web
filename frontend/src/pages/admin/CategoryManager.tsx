import React, { useEffect, useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Upload, Plus, Edit, Trash2, X, Image as ImageIcon, LayoutGrid, Database } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, adminUploadSingle } from '../../api/adminApi';
import toast from 'react-hot-toast';

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
    setLoading(true);
    try { 
      const data = await getCategories(); 
      setCategories(data); 
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
    try { 
      const { data } = await adminUploadSingle(file); 
      setFormData(p => ({ ...p, banner: data.url })); 
      toast.success('Tải banner thành công'); 
    }
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
      <div className="relative">
        <div 
          className="flex items-center gap-4 py-4 px-6 hover:bg-[#f8f9f8] border-b border-gray-50 group transition-all"
          style={{ paddingLeft: `${level * 24 + 24}px` }}
        >
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={() => toggleExpand(category.id)}
              className={`w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-all ${!hasChildren && 'invisible opacity-0'}`}
            >
              {isExpanded ? <ChevronDown size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
            </button>
            
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
              {category.banner ? (
                <img src={category.banner} className="w-full h-full object-cover" alt="" />
              ) : (
                <Folder size={18} className="text-gray-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-black text-[#1a2420] text-[14px] truncate tracking-tight">{category.name}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{category.slug}</div>
            </div>

            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openNew(category.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-sage hover:bg-sage/5 rounded-lg transition-all" title="Thêm danh mục con">
                <Plus size={16} strokeWidth={2.5} />
              </button>
              <button onClick={() => handleEdit(category)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-sage hover:bg-sage/5 rounded-lg transition-all" title="Sửa">
                <Edit size={16} strokeWidth={2.5} />
              </button>
              <button onClick={() => handleDelete(category.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="w-32 text-right px-4 flex flex-col items-end">
               <span className="text-[11px] font-black text-sage tracking-tighter">{category._count?.products || 0} ITEMS</span>
               <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-sage" style={{ width: `${Math.min(100, (category._count?.products || 0) * 10)}%` }}></div>
               </div>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="bg-gray-50/30">
            {children.map(child => (
              <CategoryNode key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Cấu trúc Danh mục</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Xây dựng và quản lý cây danh mục sản phẩm HerbSpaLab.</p>
        </div>
        <button 
          onClick={() => openNew()}
          className="flex items-center gap-2 px-6 py-3 bg-[#1a2420] text-white rounded-2xl hover:bg-[#2c3b2e] transition-all font-bold text-sm shadow-xl shadow-[#1a2420]/10"
        >
          <Plus size={18} strokeWidth={3} />
          Tạo danh mục gốc
        </button>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <LayoutGrid size={14} /> Phân cấp danh mục
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Database size={14} /> Tổng số {categories.length} mục
           </div>
        </div>
        
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center p-20 text-center">
            <div className="w-12 h-12 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Đang nạp cấu trúc...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.filter(c => !c.parentId).map((parent) => (
              <CategoryNode key={parent.id} category={parent} level={0} />
            ))}
            
            {categories.length === 0 && (
              <div className="p-32 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Folder size={40} className="text-gray-200" />
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">Chưa có dữ liệu</h2>
                <p className="text-gray-400 font-medium text-sm">Hãy tạo danh mục đầu tiên để bắt đầu phân loại sản phẩm!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10 animate-scaleUp">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-[#1a2420] tracking-tight">{editingCategory ? 'Cấu hình Danh mục' : 'Khởi tạo Danh mục'}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{editingCategory ? 'Update existing properties' : 'Create new category entry'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1a2420] hover:bg-gray-100 rounded-full transition-all">
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Tên danh mục hiển thị *</label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="VD: Kem dưỡng da Organic"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-sage/20 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Đường dẫn định danh (Slug)</label>
                  <input 
                    required 
                    value={formData.slug} 
                    onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-sage/20 focus:bg-white outline-none font-black font-mono text-[13px] text-sage transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Phụ thuộc danh mục (Parent)</label>
                  <select 
                    value={formData.parentId} 
                    onChange={e => setFormData({ ...formData, parentId: e.target.value })} 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-sage/20 focus:bg-white outline-none font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">— Đặt làm danh mục gốc —</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Banner định danh (Hero Image)</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1 group">
                       <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                       <input 
                        value={formData.banner} 
                        onChange={e => setFormData({ ...formData, banner: e.target.value })} 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-sage/20 focus:bg-white outline-none font-medium text-xs text-gray-500 transition-all"
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => document.getElementById('cat-upload')?.click()}
                      className="px-6 py-3.5 bg-[#1a2420] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2c3b2e] transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#1a2420]/10"
                    >
                      {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Upload size={14} />}
                      Tải lên
                    </button>
                    <input id="cat-upload" type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-[2] py-4 bg-sage text-white rounded-[1.5rem] font-black text-sm hover:bg-sage-dark transition-all shadow-xl shadow-sage/20 flex items-center justify-center gap-2 group">
                  {editingCategory ? 'Cập nhật thay đổi' : 'Xác nhận tạo mới'}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-[1.5rem] font-black text-sm hover:bg-gray-200 transition-all">
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;

