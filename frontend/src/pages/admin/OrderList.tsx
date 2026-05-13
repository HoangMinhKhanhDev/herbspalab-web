import React, { useEffect, useState } from 'react';
import { ShoppingBag, Eye, Calendar, Clock, CheckCircle, Truck, XCircle, ClipboardList } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

const statusMap: any = {
  'pending': { label: 'Chờ xử lý', color: 'bg-gold/10 text-gold border-gold/20', icon: Clock },
  'packing': { label: 'Đóng gói', color: 'bg-blue-50 text-blue-500 border-blue-100', icon: ShoppingBag },
  'delivering': { label: 'Đang giao', color: 'bg-purple-50 text-purple-500 border-purple-100', icon: Truck },
  'delivered': { label: 'Đã giao', color: 'bg-sage/10 text-sage border-sage/20', icon: CheckCircle },
  'cancelled': { label: 'Đã hủy', color: 'bg-red-50 text-red-400 border-red-100', icon: XCircle },
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  if (loading) return <div className="p-10 text-center font-display italic text-sage/40">Đang đồng bộ hóa vận đơn...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <ClipboardList className="w-4 h-4" />
            Order Fulfillment
          </div>
          <h1 className="text-4xl font-display font-bold text-sage">Quản lý Đơn hàng</h1>
          <p className="text-sage/60 text-lg italic mt-1">Theo dõi và cập nhật tiến độ đơn hàng từ khách hàng.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sage/5 text-sage/40 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-10 py-6 font-black">Mã vận đơn</th>
                <th className="px-10 py-6 font-black">Khách hàng</th>
                <th className="px-10 py-6 font-black">Ngày khởi tạo</th>
                <th className="px-10 py-6 font-black">Giá trị đơn</th>
                <th className="px-10 py-6 font-black">Trạng thái</th>
                <th className="px-10 py-6 font-black text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/5">
              {orders.map((order) => {
                const status = statusMap[order.status] || statusMap.pending;
                return (
                  <tr key={order.id} className="hover:bg-sage/[0.01] transition-colors group/row">
                    <td className="px-10 py-8">
                      <span className="font-sans font-black text-sage/30 text-xs tracking-tighter uppercase">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="font-display font-bold text-sage text-lg leading-tight">{order.user?.name || 'Ẩn danh'}</span>
                        <span className="text-[10px] font-bold text-sage/40 tracking-wider uppercase">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-sage/60">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="w-4 h-4 text-gold/60" />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="font-display font-bold text-sage text-xl">{formatPrice(order.totalPrice)}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${status.color}`}>
                        <status.icon className="w-3.5 h-3.5" />
                        {status.label}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-cream border border-sage/10 rounded-xl px-4 py-2 text-xs font-bold focus:ring-4 focus:ring-gold/10 outline-none text-sage cursor-pointer"
                        >
                          {Object.entries(statusMap).map(([key, val]: any) => (
                            <option key={key} value={key}>{val.label}</option>
                          ))}
                        </select>
                        <button className="w-10 h-10 bg-sage/5 text-sage rounded-xl flex items-center justify-center hover:bg-sage hover:text-white transition-all shadow-sm border border-sage/5">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
