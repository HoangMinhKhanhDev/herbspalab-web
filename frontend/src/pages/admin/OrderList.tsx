import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Clock, CheckCircle, Truck, XCircle, ClipboardList, Search, Trash2 } from 'lucide-react';
import { getOrders, updateOrderStatus, adminDeleteOrder } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoadingSkeleton from '../../components/admin/AdminLoadingSkeleton';

const statusMap: any = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
  packing: { label: 'Đóng gói', color: 'bg-blue-50 text-blue-500 border-blue-200', icon: ShoppingBag },
  delivering: { label: 'Đang giao', color: 'bg-purple-50 text-purple-500 border-purple-200', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-50 text-red-400 border-red-200', icon: XCircle },
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
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

  // Removed inline loading logic
  const filtered = orders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o => o.id.includes(searchTerm) || (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const statusCounts: Record<string, number> = { all: orders.length };
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sage tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-[11px] uppercase tracking-[0.15em] text-amber-600/80 font-bold mt-1 flex items-center gap-2"><ClipboardList className="w-3.5 h-3.5" /> {orders.length} đơn hàng</p>
        </div>
        <div className="w-full xl:w-[400px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage/20 group-focus-within:text-amber-500 transition-all" />
          <input type="text" placeholder="Tìm mã đơn, tên khách..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-black/5 focus:border-amber-300 outline-none text-sm transition-all shadow-sm text-sage placeholder:text-sage/20 font-medium" />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ key: 'all', label: 'Tất cả' }, ...Object.entries(statusMap).map(([k, v]: any) => ({ key: k, label: v.label }))].map(tab => (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${statusFilter === tab.key ? 'bg-ink text-white border-ink shadow-md' : 'bg-white text-sage/40 border-black/5 hover:text-sage hover:border-sage/20'}`}>
            {tab.label} <span className="ml-1 opacity-60">({statusCounts[tab.key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <AdminLoadingSkeleton type="table" count={10} />
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-sage/30 text-[10px] font-bold uppercase tracking-[0.15em]">
                <th className="px-5 py-4">Mã đơn</th>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4 text-center">Ngày đặt</th>
                <th className="px-5 py-4 text-center">Tổng tiền</th>
                <th className="px-5 py-4 text-center">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((order) => {
                const s = statusMap[order.status] || statusMap.pending;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-all group">
                    <td className="px-5 py-5">
                      <span className="font-mono font-bold text-mint text-xs bg-mint/5 px-3 py-1 rounded-lg border border-mint/10">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <span className="font-bold text-sage text-sm group-hover:text-amber-700 transition-colors">{order.user?.name || 'Khách vãng lai'}</span>
                    </td>
                    <td className="px-5 py-5 text-center text-xs text-sage/40 font-medium">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-5 text-center font-bold text-sage">{formatPrice(order.totalPrice)}</td>
                    <td className="px-5 py-5 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-gray-50 border border-black/5 hover:border-black/10 focus:border-amber-300 focus:bg-white rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider outline-none text-sage cursor-pointer transition-all">
                          {Object.entries(statusMap).map(([key, val]: any) => (<option key={key} value={key}>{val.label}</option>))}
                        </select>
                        <Link to={`/admin/orders/${order.id}`} className="p-2 bg-white text-sage/20 hover:text-amber-600 hover:shadow-md rounded-lg transition-all border border-black/5" title="Chi tiết">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(order.id)} className="p-2 bg-white text-sage/20 hover:text-red-400 rounded-lg transition-all border border-black/5" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <AdminEmptyState
            icon={ClipboardList}
            title="Không tìm thấy đơn hàng"
            description="Thử thay đổi bộ lọc hoặc tìm kiếm để xem kết quả khác."
          />
        )}
      </div>
      )}
    </div>
  );
};

export default OrderList;
