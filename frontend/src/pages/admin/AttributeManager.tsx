import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Database, List, Settings2 } from 'lucide-react';
import { getAttributes, createAttribute, addAttributeValue, deleteAttribute, deleteAttributeValue } from '../../api/adminApi';
import toast from 'react-hot-toast';

const AttributeManager: React.FC = () => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAttrName, setNewAttrName] = useState('');
  const [newValueMap, setNewValueMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const data = await getAttributes();
      setAttributes(data);
    } catch (error) {
      toast.error('Lỗi khi tải thuộc tính');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttrName) return;
    try {
      await createAttribute({ name: newAttrName });
      toast.success('Tạo thuộc tính thành công');
      setNewAttrName('');
      loadAttributes();
    } catch (error) {
      toast.error('Lỗi khi tạo thuộc tính');
    }
  };

  const handleAddValue = async (attributeId: string) => {
    const value = newValueMap[attributeId];
    if (!value) return;
    try {
      await addAttributeValue({ attributeId, value });
      toast.success('Thêm giá trị thành công');
      setNewValueMap(prev => ({ ...prev, [attributeId]: '' }));
      loadAttributes();
    } catch (error) {
      toast.error('Lỗi khi thêm giá trị');
    }
  };

  const handleDeleteAttr = async (id: string) => {
    if (!window.confirm('Xóa thuộc tính này?')) return;
    try {
      await deleteAttribute(id);
      loadAttributes();
    } catch (error) { toast.error('Lỗi khi xóa'); }
  };

  const handleDeleteValue = async (id: string) => {
    try {
      await deleteAttributeValue(id);
      loadAttributes();
    } catch (error) { toast.error('Lỗi khi xóa'); }
  };

  if (loading) return <div className="p-10 text-center font-display italic text-sage/40">Đang khởi tạo cấu trúc thuộc tính...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Settings2 className="w-4 h-4" />
            Product Attributes
          </div>
          <h1 className="text-4xl font-display font-bold text-sage">Thuộc tính sản phẩm</h1>
          <p className="text-sage/60 text-lg italic mt-1">Thiết lập các đặc tính kỹ thuật (Mùi hương, Dung tích...) để tạo biến thể sản phẩm.</p>
        </div>
      </div>

      {/* Premium Creation Card */}
      <div className="bg-sage p-10 rounded-[3rem] shadow-xl shadow-sage/20 text-white flex flex-col md:flex-row items-center gap-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-gold/10 transition-all duration-700" />
        <div className="w-20 h-20 bg-white/10 rounded-[1.5rem] flex items-center justify-center border border-white/10 backdrop-blur-md">
          <Database className="w-10 h-10 text-gold" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-display font-bold">Thêm thuộc tính mới</h3>
          <p className="text-white/60 text-sm mt-1">Khởi tạo loại thuộc tính dùng chung cho toàn bộ danh mục sản phẩm.</p>
        </div>
        <form onSubmit={handleCreateAttribute} className="flex gap-3 bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-lg w-full md:w-auto">
          <input 
            value={newAttrName}
            onChange={e => setNewAttrName(e.target.value)}
            className="bg-transparent px-6 py-3 outline-none placeholder:text-white/30 font-bold text-white flex-1" 
            placeholder="Ví dụ: Mùi hương" 
          />
          <button type="submit" className="px-8 py-3 bg-gold text-sage-dark rounded-xl font-black hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
            THÊM NGAY
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {attributes.map((attr) => (
          <div key={attr.id} className="bg-white rounded-[2.5rem] shadow-premium border border-sage/5 overflow-hidden group/card">
            <div className="p-8 border-b border-sage/5 bg-sage/[0.02] flex justify-between items-center">
              <h3 className="font-display font-bold text-sage text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <List className="w-4 h-4" />
                </div>
                {attr.name}
              </h3>
              <button onClick={() => handleDeleteAttr(attr.id)} className="w-10 h-10 bg-white text-sage/30 hover:text-red-400 hover:shadow-sm rounded-xl flex items-center justify-center transition-all border border-transparent hover:border-red-50">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-wrap gap-3">
                {attr.values?.map((val: any) => (
                  <div key={val.id} className="inline-flex items-center gap-3 bg-cream text-sage px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider border border-sage/5 group/val hover:border-gold/30 transition-all shadow-sm">
                    {val.value}
                    <button onClick={() => handleDeleteValue(val.id)} className="text-sage/20 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {(!attr.values || attr.values.length === 0) && (
                  <p className="text-[10px] font-black text-sage/20 uppercase tracking-[0.15em] italic py-2">Chưa thiết lập giá trị</p>
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                <input 
                  value={newValueMap[attr.id] || ''}
                  onChange={e => setNewValueMap({...newValueMap, [attr.id]: e.target.value})}
                  className="flex-1 px-5 py-3 rounded-xl bg-cream border border-sage/5 focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none text-xs font-bold text-sage transition-all shadow-inner" 
                  placeholder="Nhập giá trị mới..." 
                />
                <button onClick={() => handleAddValue(attr.id)} className="w-12 h-12 bg-sage text-white rounded-xl flex items-center justify-center hover:bg-sage-dark shadow-lg shadow-sage/10 transition-all active:scale-95">
                  <Plus className="w-6 h-6 text-gold" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeManager;
