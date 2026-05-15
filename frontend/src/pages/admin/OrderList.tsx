import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Clock, CheckCircle, Truck, XCircle, ClipboardList, Search, Trash2, Filter, MoreVertical, Package, ChevronRight } from 'lucide-react';
import { getOrders, updateOrderStatus, adminDeleteOrder } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

const statusMap: any = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700', ring: 'ring-amber-500/20', icon: Clock },
  packing: { label: 'Đóng gói', color: 'bg-blue-100 text-blue-700', ring: 'ring-blue-500/20', icon: Package },
  delivering: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-500/20', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', ring: 'ring-green-500/20', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', ring: 'ring-red-500/20', icon: XCircle },
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try { const data = await getOrders(); setOrders(data); }
    catch (e: any) { toast.error('Lỗi tải đơn hàng'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try { await updateOrderStatus(orderId, newStatus); toast.success('Cập nhật thành công'); fetchOrders(); }
    catch (e: any) { toast.error('Lỗi cập nhật'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa đơn hàng này?')) return;
    try { await adminDeleteOrder(id); toast.success('Đã xóa'); fetchOrders(); }
    catch (e: any) { toast.error('Lỗi xóa'); }
  };

  const filtered = orders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o => o.id.includes(searchTerm) || (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const statusCounts: Record<string, number> = { all: orders.length };
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Quản lý tất cả các giao dịch và trạng thái vận chuyển.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sage transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn hoặc tên khách..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-[13px] font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all shadow-sm" 
            />
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/50 rounded-[1.5rem] w-fit border border-gray-100 shadow-inner">
        {[{ key: 'all', label: 'Tất cả đơn' }, ...Object.entries(statusMap).map(([k, v]: any) => ({ key: k, label: v.label }))].map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setStatusFilter(tab.key)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              statusFilter === tab.key 
                ? 'bg-[#1a2420] text-white shadow-lg shadow-[#1a2420]/20' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusFilter === tab.key ? 'bg-white/10 text-white/90' : 'bg-gray-200/50 text-gray-500'}`}>
              {statusCounts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                <th className="px-7 py-5">Định danh đơn hàng</th>
                <th className="px-7 py-5">Khách hàng</th>
                <th className="px-7 py-5">Thời gian đặt</th>
                <th className="px-7 py-5">Tổng thanh toán</th>
                <th className="px-7 py-5">Tiến độ đơn</th>
                <th className="px-7 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="w-12 h-12 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Truy xuất danh sách đơn hàng...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <ClipboardList size={32} className="text-gray-200" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">Không tìm thấy đơn hàng nào</p>
                  </td>
                </tr>
              ) : filtered.map((order) => {
                const s = statusMap[order.status] || statusMap.pending;
                return (
                  <tr key={order.id} className="group hover:bg-[#f8f9f8] transition-all">
                    <td className="px-7 py-5">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-black text-sage group-hover:scale-105 transition-transform origin-left tracking-tight uppercase">
                          #{order.id.slice(-10).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Mã giao dịch điện tử</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-black text-gray-400 uppercase">
                          {order.user?.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <div className="text-[14px] font-black text-gray-900 group-hover:text-sage transition-colors">{order.user?.name || 'Khách vãng lai'}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.user?.phone || 'Chưa cập nhật số'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-5 text-[11px] text-gray-500 font-bold tracking-tight uppercase">{formatDate(order.createdAt)}</td>
                    <td className="px-7 py-5 text-[15px] font-black text-[#1a2420] tracking-tight">{formatPrice(order.totalPrice)}</td>
                    <td className="px-7 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${s.color} ring-4 ring-opacity-10 ${s.ring}`}>
                        <s.icon size={12} strokeWidth={2.5} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-7 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-white border border-gray-100 rounded-xl py-2 px-3 focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer"
                        >
                          {Object.entries(statusMap).map(([key, val]: any) => (<option key={key} value={key}>{val.label}</option>))}
                        </select>
                        <Link to={`/admin/orders/${order.id}`} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1a2420] hover:bg-gray-100 rounded-xl transition-all" title="Chi tiết">
                          <ChevronRight size={20} />
                        </Link>
                        <button onClick={() => handleDelete(order.id)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa bỏ">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer actions */}
        <div className="p-5 bg-gray-50/50 border-t border-gray-50 text-center">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Hệ thống quản lý đơn hàng thông minh v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
