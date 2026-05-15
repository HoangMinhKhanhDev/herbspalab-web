import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Clock, CheckCircle, Truck, XCircle, ClipboardList, Search, Trash2, Filter } from 'lucide-react';
import { getOrders, updateOrderStatus, adminDeleteOrder } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

const statusMap: any = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  packing: { label: 'Đóng gói', color: 'bg-blue-100 text-blue-700', icon: ShoppingBag },
  delivering: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
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

  const filtered = orders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o => o.id.includes(searchTerm) || (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const statusCounts: Record<string, number> = { all: orders.length };
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-sm text-gray-500">Danh sách đơn hàng từ người dùng và khách vãng lai</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn hoặc tên..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-sage outline-none" 
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Filter size={16} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-500 uppercase">Lọc theo:</span>
        </div>
        {[{ key: 'all', label: 'Tất cả' }, ...Object.entries(statusMap).map(([k, v]: any) => ({ key: k, label: v.label }))].map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === tab.key ? 'bg-sage text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({statusCounts[tab.key] || 0})
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Ngày đặt</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((order) => {
                  const s = statusMap[order.status] || statusMap.pending;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-sage">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{order.user?.name || 'Khách vãng lai'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPrice(order.totalPrice)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 border-none rounded py-1 px-2 focus:ring-1 focus:ring-sage"
                          >
                            {Object.entries(statusMap).map(([key, val]: any) => (<option key={key} value={key}>{val.label}</option>))}
                          </select>
                          <Link to={`/admin/orders/${order.id}`} className="p-1.5 text-gray-400 hover:text-sage hover:bg-sage/10 rounded transition-colors" title="Chi tiết">
                            <Eye size={16} />
                          </Link>
                          <button onClick={() => handleDelete(order.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Xóa">
                            <Trash2 size={16} />
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
            <div className="p-20 text-center text-gray-400 text-sm">
              <ClipboardList className="mx-auto mb-2 opacity-20" size={48} />
              Không tìm thấy đơn hàng nào.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;
