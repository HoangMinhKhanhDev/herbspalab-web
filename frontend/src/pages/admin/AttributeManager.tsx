import React, { useEffect, useState } from 'react';
import { Database, Plus, Trash2 } from 'lucide-react';
import { getAttributes, createAttribute, deleteAttribute } from '../../api/adminApi';
import toast from 'react-hot-toast';

const AttributeManager: React.FC = () => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!formData.name) return toast.error('Vui lòng nhập tên thuộc tính');
    
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thuộc tính Sản phẩm</h1>
          <p className="text-sm text-gray-500">Quản lý các đặc tính như Mùi hương, Dung tích, Màu sắc</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark font-bold text-sm transition-colors"
        >
          <Plus size={18} />
          Thêm thuộc tính
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attributes.map((attr) => (
            <div key={attr.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900">{attr.name}</h3>
                <button onClick={() => handleDeleteAttr(attr.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {attr.values?.map((val: any) => (
                  <span key={val.id} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {val.value}
                  </span>
                ))}
                {(!attr.values || attr.values.length === 0) && (
                  <span className="text-xs text-gray-400 italic">Chưa có giá trị</span>
                )}
              </div>
            </div>
          ))}
          
          {attributes.length === 0 && (
            <div className="col-span-full p-20 text-center text-gray-400 text-sm">
              Chưa có thuộc tính nào được tạo.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900">Thêm thuộc tính mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <Trash2 size={18} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreateAttribute} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên thuộc tính *</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none" 
                  placeholder="VD: Mùi hương, Dung tích..." 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Các giá trị (mỗi dòng 1 giá trị)</label>
                <textarea 
                  value={formData.valuesText}
                  onChange={e => setFormData({...formData, valuesText: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sage focus:border-sage outline-none text-sm min-h-[120px] resize-none" 
                  placeholder="Hương Tràm&#10;Hương Sả&#10;Hương Nhu" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isSaving} className="flex-1 py-2 bg-sage text-white rounded-lg font-bold hover:bg-sage-dark transition-colors disabled:opacity-50">
                  {isSaving ? 'Đang tạo...' : 'Lưu lại'}
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

export default AttributeManager;
