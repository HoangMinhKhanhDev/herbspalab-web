import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Folder, ChevronRight, Globe, Layers } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/adminApi';
import toast from 'react-hot-toast';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    metaTitle: '',
    metaDescription: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || '',
      description: cat.description || '',
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await createCategory(formData);
        toast.success('Tạo danh mục thành công');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      toast.error('Lỗi khi lưu danh mục');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      await deleteCategory(id);
      toast.success('Xóa danh mục thành công');
      loadCategories();
    } catch (error) {
      toast.error('Lỗi khi xóa danh mục');
    }
  };

  if (loading) return <div className="p-10 text-center font-display italic text-sage/40">Đang sắp xếp hệ thống danh mục...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Layers className="w-4 h-4" />
            Taxonomy Structure
          </div>
          <h1 className="text-4xl font-display font-bold text-sage">Quản lý Danh mục</h1>
          <p className="text-sage/60 text-lg italic mt-1">Tổ chức hệ thống sản phẩm theo cấu trúc phân cấp chuyên nghiệp.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({ name: '', slug: '', parentId: '', description: '', metaTitle: '', metaDescription: '' }); setIsModalOpen(true); }}
          className="px-8 py-3.5 bg-sage text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-sage-dark shadow-xl shadow-sage/20 transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5 text-gold" />
          Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* List Section */}
        <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 overflow-hidden">
          <div className="p-8 border-b border-sage/5 bg-sage/[0.02]">
            <h3 className="font-black text-sage/40 uppercase tracking-[0.2em] text-[10px]">Cấu trúc hiện tại</h3>
          </div>
          <div className="divide-y divide-sage/5">
            {categories.filter(c => !c.parentId).map((parent) => (
              <div key={parent.id} className="group">
                <div className="flex items-center justify-between p-8 hover:bg-sage/[0.01] transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center border border-gold/10">
                      <Folder className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sage text-xl">{parent.name}</h4>
                      <p className="text-[10px] font-black text-sage/30 uppercase tracking-widest mt-0.5">/{parent.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(parent)} className="p-2.5 text-sage/40 hover:text-gold hover:bg-gold/5 rounded-xl transition-all"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(parent.id)} className="p-2.5 text-sage/40 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
                {/* Children Mapping */}
                {categories.filter(c => c.parentId === parent.id).map(child => (
                  <div key={child.id} className="flex items-center justify-between p-6 pl-20 border-t border-sage/[0.02] hover:bg-sage/[0.02] transition-all group/child">
                    <div className="flex items-center gap-4">
                      <ChevronRight className="w-4 h-4 text-gold/40" />
                      <div>
                        <h5 className="font-bold text-sage text-lg leading-tight">{child.name}</h5>
                        <p className="text-[10px] font-black text-sage/20 uppercase tracking-tighter">/{child.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover/child:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(child)} className="p-2 text-sage/40 hover:text-gold hover:bg-gold/5 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(child.id)} className="p-2 text-sage/40 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Form Modal / Inline Editor */}
        {isModalOpen && (
          <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 p-10 space-y-8 animate-in slide-in-from-right-8 duration-500 h-fit sticky top-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-bold text-sage">{editingCategory ? 'Biên tập Danh mục' : 'Khởi tạo Danh mục'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-sage/5 text-sage rounded-full flex items-center justify-center hover:bg-sage hover:text-white transition-all"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Tên danh mục</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none font-medium transition-all shadow-inner text-sage" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Đường dẫn tĩnh (Slug)</label>
                <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none font-medium transition-all shadow-inner text-sage" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">Danh mục gốc</label>
                <select value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none font-bold text-sage cursor-pointer">
                  <option value="">Không có (Danh mục cấp 1)</option>
                  {categories.filter(c => !c.parentId && c.id !== editingCategory?.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="p-8 bg-sage/[0.02] rounded-[2rem] space-y-6 border border-sage/5">
                <h4 className="font-display font-bold text-sage text-lg flex items-center gap-3"><Globe className="w-5 h-5 text-gold" /> Tối ưu hóa Tìm kiếm (SEO)</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sage/30 uppercase tracking-widest ml-1">Meta Title</label>
                  <input value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white border border-sage/5 focus:border-gold outline-none text-sm text-sage" placeholder="Tiêu đề hiển thị trên Google" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sage/30 uppercase tracking-widest ml-1">Meta Description</label>
                  <textarea value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} rows={3} className="w-full px-5 py-3 rounded-xl bg-white border border-sage/5 focus:border-gold outline-none text-sm text-sage resize-none" placeholder="Mô tả ngắn gọn về danh mục sản phẩm" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-sage text-white rounded-2xl font-bold hover:bg-sage-dark transition-all shadow-xl shadow-sage/20 text-lg">
                {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục ngay'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
