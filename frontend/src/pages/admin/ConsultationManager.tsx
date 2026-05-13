import React, { useEffect, useState } from 'react';
import { Trash2, MessageSquare, Phone, Mail, Calendar, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { adminFetchConsultations, adminDeleteConsultation } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';

const ConsultationManager: React.FC = () => {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const { data } = await adminFetchConsultations();
      setConsultations(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa yêu cầu tư vấn này?')) return;
    try {
      await adminDeleteConsultation(id);
      toast.success('Đã xóa yêu cầu');
      loadConsultations();
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
            <Clock className="w-3 h-3" /> Chờ xử lý
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Đã tư vấn
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-sage/5 text-sage/40 rounded-full text-[10px] font-black uppercase tracking-widest border border-sage/10">
            <AlertCircle className="w-3 h-3" /> Lưu trữ
          </div>
        );
    }
  };

  if (loading) return <div className="p-20 text-center font-display italic text-sage/40">Đang đồng bộ yêu cầu tư vấn...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Sparkles className="w-4 h-4" />
            Client Relationship
          </div>
          <h1 className="text-4xl font-display font-bold text-sage">Danh sách Tư vấn</h1>
          <p className="text-sage/60 text-lg italic mt-1">Lắng nghe và hỗ trợ khách hàng trên hành trình chăm sóc vẻ đẹp tự nhiên.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sage/[0.02] border-b border-sage/5">
              <th className="px-8 py-6 text-[10px] font-black text-sage/40 uppercase tracking-[0.2em]">Khách hàng</th>
              <th className="px-8 py-6 text-[10px] font-black text-sage/40 uppercase tracking-[0.2em]">Thông tin liên hệ</th>
              <th className="px-8 py-6 text-[10px] font-black text-sage/40 uppercase tracking-[0.2em]">Nội dung yêu cầu</th>
              <th className="px-8 py-6 text-[10px] font-black text-sage/40 uppercase tracking-[0.2em]">Thời gian</th>
              <th className="px-8 py-6 text-[10px] font-black text-sage/40 uppercase tracking-[0.2em]">Trạng thái</th>
              <th className="px-8 py-6 text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/5">
            {consultations.map((item) => (
              <tr key={item.id} className="group hover:bg-sage/[0.01] transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center font-bold text-xs">
                      {item.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-display font-bold text-sage text-lg">{item.fullName}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sage/60 text-sm font-medium">
                      <Phone className="w-3.5 h-3.5 text-gold/60" /> {item.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sage/40 text-xs italic">
                      <Mail className="w-3.5 h-3.5" /> {item.email}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="max-w-xs">
                    <p className="text-sage/70 text-sm line-clamp-2 italic leading-relaxed">"{item.content}"</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-sage/40 text-xs font-bold uppercase tracking-tighter">
                    <Calendar className="w-3.5 h-3.5 text-gold/40" />
                    {formatDate(item.createdAt)}
                  </div>
                </td>
                <td className="px-8 py-6">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 text-sage/20 hover:text-red-400 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {consultations.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-sage/10" />
            </div>
            <p className="text-sage/40 font-display italic">Hiện chưa có yêu cầu tư vấn nào được gửi đến.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationManager;
