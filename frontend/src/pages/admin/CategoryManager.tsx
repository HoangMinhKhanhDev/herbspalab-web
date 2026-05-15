import React, { useEffect, useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Upload, Plus, Edit, Trash2 } from 'lucide-react';
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
          className="flex items-center gap-4 py-3 hover:bg-gray-50 border-b border-gray-100 group"
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          <div className="flex items-center gap-2 w-full">
            <button 
              onClick={() => toggleExpand(category.id)}
              className={`p-1 hover:bg-gray-200 rounded transition-colors ${!hasChildren && 'invisible'}`}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
              {category.banner ? (
                <img src={category.banner} className="w-full h-full object-cover rounded" alt="" />
              ) : (
                <Folder size={14} className="text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-sm truncate">{category.name}</div>
              <div className="text-[10px] text-gray-400 font-mono">{category.slug}</div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openNew(category.id)} className="p-1.5 text-gray-400 hover:text-sage hover:bg-gray-100 rounded" title="Thêm con">
                <Plus size={14} />
              </button>
              <button onClick={() => handleEdit(category)} className="p-1.5 text-gray-400 hover:text-sage hover:bg-gray-100 rounded" title="Sửa">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(category.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title="Xóa">
                <Trash2 size={14} />
              </button>
            </div>
            
            <div className="w-24 text-right pr-4">
              <span className="text-xs font-medium text-gray-500">{category._count?.products || 0} SP</span>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => (
              <CategoryNode key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
          <p className="text-sm text-gray-500">Tổ chức phân loại sản phẩm theo phân cấp</p>
        </div>
        <button 
          onClick={() => openNew()}
          className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark font-bold text-sm transition-colors"
        >
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.filter(c => !c.parentId).map((parent) => (
              <CategoryNode key={parent.id} category={parent} level={0} />
            ))}
            
            {categories.length === 0 && (
              <div className="p-20 text-center text-gray-400 text-sm">
                Chưa có danh mục nào được tạo.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900">{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <Trash2 size={18} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên danh mục *</label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                  <input 
                    required 
                    value={formData.slug} 
                    onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none font-mono text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Danh mục cha</label>
                  <select 
                    value={formData.parentId} 
                    onChange={e => setFormData({ ...formData, parentId: e.target.value })} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none"
                  >
                    <option value="">— Cấp cao nhất —</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    rows={2} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ảnh banner (URL)</label>
                  <div className="flex gap-2">
                    <input 
                      value={formData.banner} 
                      onChange={e => setFormData({ ...formData, banner: e.target.value })} 
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => document.getElementById('cat-upload')?.click()}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold"
                    >
                      {uploading ? '...' : 'Upload'}
                    </button>
                    <input id="cat-upload" type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2 bg-sage text-white rounded-lg font-bold hover:bg-sage-dark transition-colors">
                  Lưu lại
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                  Hủy
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

