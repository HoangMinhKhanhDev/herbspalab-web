import React, { useEffect, useState } from 'react';
import { Trash2, MessageSquare, Phone, Calendar, CheckCircle, Clock, PhoneCall, Filter } from 'lucide-react';
import { adminFetchConsultations, adminDeleteConsultation, updateConsultationStatus } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';

const statusConfig: any = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  CONTACTED: { label: 'Đã liên hệ', color: 'bg-blue-100 text-blue-700', icon: PhoneCall },
  COMPLETED: { label: 'Hoàn tất', color: 'bg-green-100 text-green-700', icon: CheckCircle },
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tư vấn</h1>
          <p className="text-sm text-gray-500">Yêu cầu hỗ trợ từ khách hàng và khách vãng lai</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Filter size={16} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-500 uppercase">Trạng thái:</span>
        </div>
        {[{ key: 'ALL', label: 'Tất cả' }, ...Object.entries(statusConfig).map(([k, v]: any) => ({ key: k, label: v.label }))].map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === tab.key ? 'bg-sage text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultations.map((item) => {
            const sc = statusConfig[item.status] || statusConfig.PENDING;
            const StatusIcon = sc.icon;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center font-bold text-sm">
                      {item.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.userName}</h4>
                      <a href={`tel:${item.phone}`} className="flex items-center gap-1 text-xs text-sage hover:underline">
                        <Phone size={12} /> {item.phone}
                      </a>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${sc.color}`}>
                    <StatusIcon size={10} /> {sc.label}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 mb-6 min-h-[60px]">
                  {item.category && <p><span className="font-bold text-gray-400 uppercase text-[9px]">Dịch vụ:</span> {item.category}</p>}
                  {item.note && (
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 italic text-gray-500">
                      "{item.note}"
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                    <Calendar size={12} /> {formatDate(item.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={item.status} 
                      onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                      className="bg-gray-100 border-none rounded text-[10px] font-bold uppercase tracking-wider py-1 px-2 focus:ring-1 focus:ring-sage"
                    >
                      {Object.entries(statusConfig).map(([k, v]: any) => (<option key={k} value={k}>{v.label}</option>))}
                    </select>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {consultations.length === 0 && (
            <div className="col-span-full p-20 text-center text-gray-400 text-sm">
              <MessageSquare className="mx-auto mb-2 opacity-20" size={48} />
              Chưa có yêu cầu tư vấn nào.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationManager;
