import React, { useEffect, useState } from 'react';
import { Database, Plus, Trash2, X, ChevronRight, LayoutGrid, Info, CheckCircle2, AlertCircle } from 'lucide-react';
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
    setLoading(true);
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
    if (!window.confirm('Xóa thuộc tính này? Tất cả các biến thể sử dụng thuộc tính này sẽ bị ảnh hưởng.')) return;
    try {
      await deleteAttribute(id);
      toast.success('Đã xóa thuộc tính');
      loadAttributes();
    } catch (error: any) { toast.error('Lỗi khi xóa'); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="w-14 h-14 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto mb-6 shadow-xl shadow-sage/10"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Đang nạp hệ thống thuộc tính...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#1a2420] text-[#bca37f] text-[9px] font-black uppercase tracking-widest rounded-full">System Engine</span>
           </div>
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight mt-1">Thuộc tính Sản phẩm</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Thiết lập các đặc tính cơ sở cho hệ thống biến thể (SKU Matrix).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-[#1a2420] text-white rounded-[1.25rem] hover:bg-[#2c3b2e] transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#1a2420]/20"
        >
          <Plus size={18} strokeWidth={3} />
          Thêm thuộc tính mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {attributes.map((attr) => (
          <div key={attr.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group hover:shadow-xl hover:shadow-gray-500/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <Database size={100} strokeWidth={1} />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
               <div>
                  <h3 className="font-black text-[#1a2420] text-lg tracking-tight group-hover:text-sage transition-colors">{attr.name}</h3>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-0.5">{attr.values?.length || 0} Options defined</p>
               </div>
              <button onClick={() => handleDeleteAttr(attr.id)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2.5 relative z-10">
              {attr.values?.map((val: any) => (
                <span key={val.id} className="bg-[#f8f9f8] text-sage px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-50 group-hover:border-sage/20 transition-colors">
                  {val.value}
                </span>
              ))}
              {(!attr.values || attr.values.length === 0) && (
                <div className="flex items-center gap-2 text-gray-300 py-2">
                   <AlertCircle size={14} />
                   <span className="text-[11px] font-bold uppercase tracking-widest italic">Chưa có giá trị</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                       <div className="w-full h-full bg-sage/10 animate-pulse"></div>
                    </div>
                  ))}
               </div>
               <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Active Schema</span>
            </div>
          </div>
        ))}
        
        {attributes.length === 0 && (
          <div className="col-span-full py-32 bg-white rounded-[3rem] border border-gray-50 text-center shadow-inner group">
             <LayoutGrid size={60} strokeWidth={1} className="text-gray-100 mx-auto mb-6 group-hover:scale-110 group-hover:text-sage transition-all duration-700" />
            <h2 className="text-xl font-black text-[#1a2420] tracking-tight mb-2 uppercase tracking-widest">Matrix Empty</h2>
            <p className="text-gray-400 font-medium text-sm max-w-xs mx-auto">Chưa có thuộc tính nào được khởi tạo. Hãy tạo các đặc tính như Mùi hương, Dung tích để bắt đầu.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 px-8 py-3 bg-[#f8f9f8] text-sage rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sage hover:text-white transition-all shadow-sm"
            >
               Tạo thuộc tính đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Advanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a2420]/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-scaleUp">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-[#f8f9f8]">
              <div>
                <h3 className="text-2xl font-black text-[#1a2420] tracking-tight">Thêm thuộc tính</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Define new product characteristic</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <form onSubmit={handleCreateAttribute} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Tên thuộc tính định danh *</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sage/5 focus:bg-white focus:border-sage outline-none font-bold text-gray-900 transition-all text-[15px] shadow-inner" 
                    placeholder="VD: Mùi hương, Dung tích, Màu sắc..." 
                  />
                </div>
                <div>
                   <div className="flex items-center justify-between mb-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Danh sách giá trị</label>
                      <span className="text-[9px] font-black text-sage uppercase tracking-widest bg-sage/5 px-2 py-0.5 rounded-full">Multiline Entry</span>
                   </div>
                  <textarea 
                    value={formData.valuesText}
                    onChange={e => setFormData({...formData, valuesText: e.target.value})}
                    className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-sage/5 focus:bg-white focus:border-sage outline-none text-sm min-h-[160px] resize-none font-bold leading-relaxed shadow-inner" 
                    placeholder="Hương Tràm&#10;Hương Sả&#10;Hương Nhu&#10;Mỗi dòng là một giá trị..." 
                  />
                  <div className="flex items-center gap-2 mt-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                     <Info size={14} className="text-amber-500" />
                     <p className="text-[10px] text-amber-600/70 font-bold uppercase tracking-widest leading-tight">Nhập mỗi giá trị trên một dòng mới để hệ thống tự động phân tách.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" disabled={isSaving} className="flex-[2] py-5 bg-[#1a2420] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#2c3b2e] transition-all disabled:opacity-50 shadow-2xl shadow-[#1a2420]/20 flex items-center justify-center gap-2 group">
                  {isSaving ? <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 size={18} strokeWidth={3} />}
                  {isSaving ? 'Đang khởi tạo...' : 'Xác nhận tạo mới'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
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

export default AttributeManager;
