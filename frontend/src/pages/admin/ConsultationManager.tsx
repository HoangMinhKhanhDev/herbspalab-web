import React, { useEffect, useState } from 'react';
import { Trash2, MessageSquare, Phone, Calendar, CheckCircle, Clock, Sparkles, PhoneCall } from 'lucide-react';
import { adminFetchConsultations, adminDeleteConsultation, updateConsultationStatus } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoadingSkeleton from '../../components/admin/AdminLoadingSkeleton';

const statusConfig: any = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
  CONTACTED: { label: 'Đã liên hệ', color: 'bg-blue-50 text-blue-500 border-blue-200', icon: PhoneCall },
  COMPLETED: { label: 'Hoàn tất', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
};

const ConsultationManager: React.FC = () => {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { loadConsultations(); }, [statusFilter]);

  const loadConsultations = async () => {
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

  // Removed inline loading logic
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600/80 font-bold text-[10px] uppercase tracking-[0.2em] mb-1"><Sparkles className="w-3 h-3" /> Client Relations</div>
          <h1 className="text-3xl font-bold text-sage tracking-tight">Quản lý Tư vấn</h1>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {[{ key: 'ALL', label: 'Tất cả' }, ...Object.entries(statusConfig).map(([k, v]: any) => ({ key: k, label: v.label }))].map(tab => (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${statusFilter === tab.key ? 'bg-ink text-white border-ink shadow-md' : 'bg-white text-sage/40 border-black/5 hover:text-sage'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Layout */}
      {loading ? (
        <AdminLoadingSkeleton type="grid" count={6} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {consultations.map((item) => {
          const sc = statusConfig[item.status] || statusConfig.PENDING;
          const StatusIcon = sc.icon;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-mint/10 text-mint rounded-xl flex items-center justify-center font-bold text-sm border border-mint/10">
                    {item.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sage text-sm">{item.userName}</h4>
                    <a href={`tel:${item.phone}`} className="flex items-center gap-1 text-xs text-amber-600 font-medium hover:underline">
                      <Phone className="w-3 h-3" /> {item.phone}
                    </a>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${sc.color}`}>
                  <StatusIcon className="w-3 h-3" /> {sc.label}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs text-sage/60 mb-4">
                {item.category && <p><span className="font-semibold text-sage/40">Loại:</span> {item.category}</p>}
                {item.skinType && <p><span className="font-semibold text-sage/40">Da:</span> {item.skinType}</p>}
                {item.note && <p className="italic text-sage/50 bg-gray-50 p-2 rounded-lg">"{item.note}"</p>}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/5">
                <div className="flex items-center gap-1 text-[10px] text-sage/30 font-medium">
                  <Calendar className="w-3 h-3" /> {formatDate(item.createdAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Status update buttons */}
                  <select value={item.status} onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                    className="bg-gray-50 border border-black/5 hover:border-black/10 focus:border-mint focus:bg-white rounded-lg px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-sage cursor-pointer outline-none transition-all">
                    {Object.entries(statusConfig).map(([k, v]: any) => (<option key={k} value={k}>{v.label}</option>))}
                  </select>
                  <a href={`tel:${item.phone}`} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:shadow-md transition-all border border-emerald-100" title="Gọi ngay">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-sage/20 hover:text-red-400 rounded-lg transition-all hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
          </div>

          {consultations.length === 0 && (
            <AdminEmptyState
              icon={MessageSquare}
              title="Không có yêu cầu tư vấn"
              description="Hiện tại chưa có khách hàng nào gửi yêu cầu tư vấn."
            />
          )}
        </>
      )}
    </div>
  );
};

export default ConsultationManager;
