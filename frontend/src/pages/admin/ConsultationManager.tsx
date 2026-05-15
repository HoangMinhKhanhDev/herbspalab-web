import React, { useEffect, useState } from 'react';
import { Trash2, MessageSquare, Phone, Calendar, CheckCircle, Clock, PhoneCall, Filter, User, MoreVertical, ArrowUpRight } from 'lucide-react';
import { adminFetchConsultations, adminDeleteConsultation, updateConsultationStatus } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';

const statusConfig: any = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600', ring: 'ring-amber-500/10', icon: Clock },
  CONTACTED: { label: 'Đã liên hệ', color: 'bg-blue-50 text-blue-600', ring: 'ring-blue-500/10', icon: PhoneCall },
  COMPLETED: { label: 'Hoàn tất', color: 'bg-green-50 text-sage', ring: 'ring-green-500/10', icon: CheckCircle },
};

const ConsultationManager: React.FC = () => {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { loadConsultations(); }, [statusFilter]);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const { data } = await adminFetchConsultations(statusFilter === 'ALL' ? undefined : statusFilter);
      setConsultations(data);
    } catch { toast.error('Lỗi tải danh sách tư vấn'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa yêu cầu tư vấn này?')) return;
    try { await adminDeleteConsultation(id); toast.success('Đã xóa'); loadConsultations(); }
    catch { toast.error('Lỗi xóa'); }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await updateConsultationStatus(id, status); toast.success('Cập nhật thành công'); loadConsultations(); }
    catch (e: any) { toast.error(e.response?.data?.message || 'Lỗi cập nhật'); }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Quản lý Tư vấn</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Theo dõi và phản hồi các yêu cầu hỗ trợ từ khách hàng HerbSpaLab.</p>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/50 rounded-[1.5rem] w-fit border border-gray-100 shadow-inner">
        {[{ key: 'ALL', label: 'Tất cả yêu cầu' }, ...Object.entries(statusConfig).map(([k, v]: any) => ({ key: k, label: v.label }))].map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setStatusFilter(tab.key)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              statusFilter === tab.key 
                ? 'bg-[#1a2420] text-white shadow-lg shadow-[#1a2420]/20' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-20 text-center">
          <div className="w-12 h-12 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Đang đồng bộ yêu cầu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultations.map((item) => {
            const sc = statusConfig[item.status] || statusConfig.PENDING;
            const StatusIcon = sc.icon;
            return (
              <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-16 -mt-16 rounded-full bg-sage`}></div>
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1a2420] text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg shadow-[#1a2420]/20">
                      {item.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-base tracking-tight">{item.userName}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer ID</span>
                         <span className="text-[10px] font-black text-sage font-mono">#{item.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${sc.color} ring-4 ring-opacity-30 ${sc.ring}`}>
                    <StatusIcon size={12} strokeWidth={2.5} /> {sc.label}
                  </span>
                </div>

                <div className="space-y-4 mb-8 flex-1 relative z-10">
                  <a href={`tel:${item.phone}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 group/btn hover:bg-sage/5 hover:border-sage/20 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white rounded-xl shadow-sm text-sage group-hover/btn:bg-sage group-hover/btn:text-white transition-all">
                          <Phone size={14} />
                       </div>
                       <span className="text-sm font-black text-gray-700">{item.phone}</span>
                    </div>
                    <ArrowUpRight size={14} className="text-gray-300 group-hover/btn:text-sage transition-all" />
                  </a>

                  {item.category && (
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-1 h-1 rounded-full bg-sage"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Yêu cầu:</span>
                      <span className="text-xs font-bold text-gray-700">{item.category}</span>
                    </div>
                  )}

                  {item.note && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border-l-4 border-sage text-sm font-medium text-gray-600 leading-relaxed relative">
                       <MessageSquare className="absolute top-2 right-2 text-sage/10 w-8 h-8" />
                       "{item.note}"
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Ngày nhận</span>
                    <span className="text-[11px] font-bold text-gray-500 mt-0.5">{formatDate(item.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select 
                      value={item.status} 
                      onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                      className="bg-gray-50 hover:bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest py-2 px-3 focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer"
                    >
                      {Object.entries(statusConfig).map(([k, v]: any) => (<option key={k} value={k}>{v.label}</option>))}
                    </select>
                    <button onClick={() => handleDelete(item.id)} className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {consultations.length === 0 && (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <MessageSquare className="text-gray-200" size={40} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">Chưa có yêu cầu mới</h2>
              <p className="text-gray-400 font-medium text-sm">Hệ thống hiện tại đang trống. Tất cả tư vấn đã được xử lý!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationManager;
