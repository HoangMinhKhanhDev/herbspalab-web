import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle, ShoppingBag, Printer, User, Package } from 'lucide-react';
import { getOrderDetail, updateOrderStatus } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

const statusMap: any = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700', icon: Clock },
  packing: { label: 'Đóng gói', color: 'bg-blue-100 text-blue-700', icon: ShoppingBag },
  delivering: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrder(); }, [id]);

  const loadOrder = async () => {
    try { const data = await getOrderDetail(id!); setOrder(data); }
    catch (e: any) { toast.error('Lỗi tải đơn hàng'); navigate('/admin/orders'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (newStatus: string) => {
    try { await updateOrderStatus(order.id, newStatus); toast.success('Cập nhật thành công'); loadOrder(); }
    catch (e: any) { toast.error('Lỗi cập nhật trạng thái'); }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Đang tải chi tiết đơn hàng...</p>
    </div>
  );
  if (!order) return null;

  const status = statusMap[order.status] || statusMap.pending;
  const StatusIcon = status.icon;
  const shipping = order.shippingAddress || (order.shippingInfo ? (() => { try { return JSON.parse(order.shippingInfo); } catch { return null; } })() : null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${status.color}`}>
            <StatusIcon size={16} /> {status.label}
          </span>
          <button onClick={() => window.print()} className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors" title="In">
            <Printer size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Package size={16} className="text-gray-500" /> Sản phẩm ({order.orderItems?.length || 0})</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.orderItems?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-16 h-16 rounded border border-gray-200 flex-shrink-0 bg-gray-50">
                    <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                    {item.variantLabel && <p className="text-xs text-gray-500 mt-0.5">{item.variantLabel}</p>}
                    <p className="text-sm text-gray-500 mt-1">SL: {item.qty} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">Tổng cộng</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Cập nhật trạng thái</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusMap).map(([key, val]: any) => {
                const Icon = val.icon;
                return (
                  <button key={key} onClick={() => handleStatusChange(key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${order.status === key ? val.color + ' border-transparent' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    <Icon size={16} /> {val.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Info Cards */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3"><User size={16} className="text-gray-500" /> Khách hàng</h3>
            <p className="font-bold text-gray-900 text-sm">{order.user?.name || 'Khách vãng lai'}</p>
            <p className="text-sm text-gray-500 mt-1">{order.user?.email || '—'}</p>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3"><MapPin size={16} className="text-gray-500" /> Giao hàng</h3>
            {shipping ? (
              <div className="text-sm text-gray-700 space-y-1.5">
                <p className="font-bold">{shipping.fullName || shipping.name || '—'}</p>
                <p>{shipping.address || '—'}</p>
                <p>{[shipping.ward, shipping.district, shipping.city].filter(Boolean).join(', ') || shipping.province || '—'}</p>
                <p>{shipping.phone || '—'}</p>
              </div>
            ) : <p className="text-gray-500 text-sm">Không có thông tin</p>}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3"><CreditCard size={16} className="text-gray-500" /> Thanh toán</h3>
            <p className="font-medium text-gray-900 text-sm mb-2">{order.paymentMethod || 'Thanh toán khi nhận hàng (COD)'}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
            {order.paidAt && <p className="text-xs text-gray-500 mt-2">Lúc: {formatDate(order.paidAt)}</p>}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Thời gian</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Đặt hàng:</span><span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span></div>
              {order.deliveredAt && <div className="flex justify-between"><span>Giao hàng:</span><span className="font-medium text-gray-900">{formatDate(order.deliveredAt)}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
