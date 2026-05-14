import React, { useEffect, useState } from 'react';
import { Database, Settings2 } from 'lucide-react';
import { getAttributes, createAttribute, deleteAttribute } from '../../api/adminApi';
import toast from 'react-hot-toast';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoadingSkeleton from '../../components/admin/AdminLoadingSkeleton';
import AdminModal from '../../components/admin/AdminModal';

const AttributeManager: React.FC = () => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', valuesText: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const data = await getAttributes();
      setAttributes(data);
    } catch (error: any) {
      toast.error('Lỗi khi tải thuộc tính');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Vui lòng nhập tên thuộc tính');
      return;
    }
    
    setIsSaving(true);
    try {
      const values = formData.valuesText
        .split('\n')
        .map(v => v.trim())
        .filter(v => v !== '');
        
      await createAttribute({ name: formData.name, values });
      toast.success('Tạo thuộc tính thành công');
      setFormData({ name: '', valuesText: '' });
      setIsModalOpen(false);
      loadAttributes();
    } catch (error: any) {
      toast.error('Lỗi khi tạo thuộc tính');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAttr = async (id: string) => {
    if (!window.confirm('Xóa thuộc tính này?')) return;
    try {
      await deleteAttribute(id);
      toast.success('Đã xóa thuộc tính');
      loadAttributes();
    } catch (error: any) { toast.error('Lỗi khi xóa'); }
  };

  // Remove old loading check here to place it inside the JSX
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
             <Settings2 className="w-3 h-3" /> System Taxonomy
          </div>
          <h1 className="text-4xl font-display italic text-sage tracking-tight">Thuộc tính sản phẩm</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-ink text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mint transition-all shadow-xl"
        >
          + THÊM THUỘC TÍNH
        </button>
      </div>

      {loading ? (
        <AdminLoadingSkeleton type="grid" count={6} />
      ) : (
        <>
          {/* Grid of Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attributes.map((attr) => (
              <div key={attr.id} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-sage text-lg tracking-tight group-hover:text-mint transition-colors">{attr.name}</h3>
                  <button onClick={() => handleDeleteAttr(attr.id)} className="opacity-0 group-hover:opacity-100 text-mint/40 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all">
                    Xóa
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {attr.values?.map((val: any) => (
                    <div key={val.id} className="bg-gray-50 text-sage/60 px-4 py-2 rounded-full font-bold text-[9px] uppercase tracking-widest border border-black/5">
                      {val.value}
                    </div>
                  ))}
                  {(!attr.values || attr.values.length === 0) && (
                    <p className="text-[10px] font-bold text-sage/20 uppercase tracking-widest italic">Trống</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {attributes.length === 0 && (
            <AdminEmptyState
              icon={Database}
              title="Chưa có thuộc tính"
              description="Tạo các thuộc tính như Màu sắc, Dung tích để quản lý biến thể sản phẩm tốt hơn."
              actionLabel="+ BẮT ĐẦU NGAY"
              onAction={() => setIsModalOpen(true)}
            />
          )}
        </>
      )}

      {/* Create Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm thuộc tính"
      >
        <form onSubmit={handleCreateAttribute} className="space-y-6">
          <div>
            <label className="text-[11px] font-bold text-sage/40 uppercase tracking-widest mb-2 block px-1">Tên thuộc tính *</label>
            <input 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-mint focus:bg-white outline-none font-bold text-sage text-sm transition-all placeholder:text-sage/20" 
              placeholder="VD: Màu sắc, Kích thước, Dung tích" 
            />
          </div>
          
          <div>
            <label className="text-[11px] font-bold text-sage/40 uppercase tracking-widest mb-2 block px-1">Các giá trị (mỗi dòng 1 giá trị)</label>
            <textarea 
              value={formData.valuesText}
              onChange={e => setFormData({...formData, valuesText: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:border-mint focus:bg-white outline-none font-bold text-sage text-sm transition-all placeholder:text-sage/20 min-h-[150px] resize-none" 
              placeholder="Đỏ&#10;Xanh&#10;Trắng" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full py-5 bg-ink text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-mint transition-all shadow-xl disabled:opacity-50 mt-4"
          >
            {isSaving ? 'ĐANG KHỞI TẠO...' : 'TẠO THUỘC TÍNH'}
          </button>
        </form>
      </AdminModal>
    </div>
  );
};

export default AttributeManager;
