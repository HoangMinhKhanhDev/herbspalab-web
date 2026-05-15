import React, { useEffect, useState } from 'react';
import { Database, Plus, Trash2, Info, CheckCircle2, AlertCircle, X, Layers, Settings2, Sparkles, Loader2 } from 'lucide-react';
import { getAttributes, createAttribute, deleteAttribute } from '../../api/adminApi';
import toast from 'react-hot-toast';

const AttributeManager: React.FC = () => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const inp = "w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/5 outline-none font-bold text-gray-900 transition-all text-[13px] placeholder:text-gray-400";
  const lbl = "block text-[12px] font-black text-gray-800 tracking-wide mb-2";
  const card = "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden";
  const cardH = "px-6 py-4 border-b border-gray-50 bg-white flex items-center justify-between";

  return (
    <div className="max-w-7xl mx-auto pb-32">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-4 z-40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-[#1a2420] text-[#bca37f] text-[10px] font-black uppercase tracking-widest rounded-full">System Matrix</span>
          </div>
          <h1 className="text-2xl font-black text-[#1a2420] tracking-tight">Quản lý Thuộc tính</h1>
        </div>
        <div className="flex items-center gap-4 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
           <Layers size={14}/> {attributes.length} Thuộc tính đang hoạt động
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: PERSISTENT CREATE FORM (4/12) */}
        <div className="lg:col-span-4">
           <div className={`${card} sticky top-32`}>
              <div className={cardH}>
                 <p className="text-[13px] font-black text-[#1a2420] flex items-center gap-2"><Plus size={16} className="text-sage"/> Tạo thuộc tính mới</p>
              </div>
              <form onSubmit={handleCreateAttribute} className="p-6 space-y-6">
                 <div>
                    <label className={lbl}>Tên thuộc tính *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={inp}
                      placeholder="VD: Mùi hương, Dung tích..."
                    />
                 </div>
                 
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className={lbl}>Danh sách giá trị</label>
                       <span className="text-[9px] font-black text-sage uppercase bg-sage/5 px-2 py-0.5 rounded">Mỗi dòng 1 giá trị</span>
                    </div>
                    <textarea
                      value={formData.valuesText}
                      onChange={e => setFormData({ ...formData, valuesText: e.target.value })}
                      className={`${inp} min-h-[160px] resize-none leading-relaxed`}
                      placeholder={"Hương Tràm\nHương Sả\nHương Nhu..."}
                    />
                 </div>

                 <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                    <Info size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-amber-700 font-medium leading-relaxed">Các giá trị này sẽ được dùng để tạo ra các biến thể sản phẩm (Variant Matrix).</p>
                 </div>

                 <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-admin-primary w-full py-4"
                 >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} strokeWidth={3} />}
                    {isSaving ? 'Đang tạo...' : 'Xác nhận tạo mới'}
                 </button>
              </form>
           </div>
        </div>

        {/* RIGHT PANEL: ATTRIBUTE LIST (8/12) */}
        <div className="lg:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attributes.map((attr) => (
                <div key={attr.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                         <h3 className="font-black text-[#1a2420] text-base tracking-tight">{attr.name}</h3>
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-0.5">{attr.values?.length || 0} lựa chọn</p>
                      </div>
                      <button onClick={() => handleDeleteAttr(attr.id)} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                         <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                   </div>

                   <div className="flex flex-wrap gap-2 relative z-10">
                      {attr.values?.map((val: any) => (
                        <span key={val.id} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-[11px] font-bold border border-gray-100">
                          {val.value}
                        </span>
                      ))}
                      {(!attr.values || attr.values.length === 0) && (
                        <div className="flex items-center gap-2 text-gray-300 text-[11px] font-bold italic py-1"><AlertCircle size={14}/> Trống</div>
                      )}
                   </div>

                   <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-1.5"><Settings2 size={10}/> SKU Property</span>
                      <Sparkles size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-sage"/>
                   </div>
                </div>
              ))}

              {attributes.length === 0 && (
                <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                   <Database size={40} className="mx-auto text-gray-200 mb-4" strokeWidth={1} />
                   <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Chưa có thuộc tính nào được khởi tạo</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AttributeManager;
