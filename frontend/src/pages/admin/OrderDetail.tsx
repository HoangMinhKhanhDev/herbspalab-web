import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle, ShoppingBag, Printer, User, Package } from 'lucide-react';
import { getOrderDetail, updateOrderStatus } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

const statusMap: any = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
  packing: { label: 'Đóng gói', color: 'bg-blue-50 text-blue-500 border-blue-200', icon: ShoppingBag },
  delivering: { label: 'Đang giao', color: 'bg-purple-50 text-purple-500 border-purple-200', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-50 text-red-400 border-red-200', icon: XCircle },
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

  if (loading) return <div className="p-16 text-center text-sage/40 text-sm">Đang tải đơn hàng...</div>;
  if (!order) return null;

  const status = statusMap[order.status] || statusMap.pending;
  const StatusIcon = status.icon;
  const shipping = order.shippingAddress || (order.shippingInfo ? (() => { try { return JSON.parse(order.shippingInfo); } catch { return null; } })() : null);

  return (
    <div className="max-w-[1100px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/orders')} className="p-2.5 rounded-xl bg-white border border-black/5 text-sage/30 hover:text-sage transition-all"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-2xl font-bold text-sage tracking-tight">Đơn hàng #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-[10px] uppercase tracking-wider text-sage/30 font-bold mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
            <StatusIcon className="w-3.5 h-3.5" /> {status.label}
          </span>
          <button onClick={() => window.print()} className="p-2.5 rounded-xl bg-white border border-black/5 text-sage/30 hover:text-sage transition-all" title="In"><Printer className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-black/5 bg-gray-50/30">
              <h3 className="font-bold text-sage text-sm flex items-center gap-2"><Package className="w-4 h-4 text-amber-500" /> Sản phẩm ({order.orderItems?.length || 0})</h3>
            </div>
            <div className="divide-y divide-black/5">
              {order.orderItems?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden border border-black/5 flex-shrink-0">
                    <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sage text-sm truncate">{item.name}</h4>
                    {item.variantLabel && <p className="text-[10px] text-amber-600/70 font-medium mt-0.5">{item.variantLabel}</p>}
                    <p className="text-[10px] text-sage/30 font-medium">SL: {item.qty} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-bold text-sage text-sm">{formatPrice(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-black/5 bg-gray-50/30 flex justify-between items-center">
              <span className="text-sm font-bold text-sage/40 uppercase tracking-wider">Tổng cộng</span>
              <span className="text-2xl font-bold text-sage">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
            <h3 className="font-bold text-sage text-sm mb-4">Cập nhật trạng thái</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusMap).map(([key, val]: any) => {
                const Icon = val.icon;
                return (
                  <button key={key} onClick={() => handleStatusChange(key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${order.status === key ? val.color + ' shadow-md' : 'bg-gray-50 text-sage/30 border-black/5 hover:bg-white hover:border-sage/20'}`}>
                    <Icon className="w-3.5 h-3.5" /> {val.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Info Cards */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
            <h3 className="font-bold text-sage text-sm flex items-center gap-2 mb-3"><User className="w-4 h-4 text-blue-500" /> Khách hàng</h3>
            <p className="font-bold text-sage">{order.user?.name || 'Khách vãng lai'}</p>
            <p className="text-xs text-sage/40 mt-1">{order.user?.email || '—'}</p>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
            <h3 className="font-bold text-sage text-sm flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-emerald-500" /> Giao hàng</h3>
            {shipping ? (
              <div className="text-sm text-sage/70 space-y-1">
                <p className="font-medium">{shipping.fullName || shipping.name || '—'}</p>
                <p>{shipping.address || '—'}</p>
                <p>{[shipping.ward, shipping.district, shipping.city].filter(Boolean).join(', ') || shipping.province || '—'}</p>
                <p>{shipping.phone || '—'}</p>
              </div>
            ) : <p className="text-sage/30 text-sm">Không có thông tin</p>}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
            <h3 className="font-bold text-sage text-sm flex items-center gap-2 mb-3"><CreditCard className="w-4 h-4 text-purple-500" /> Thanh toán</h3>
            <p className="font-medium text-sage text-sm">{order.paymentMethod || 'COD'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${order.isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
            {order.paidAt && <p className="text-[10px] text-sage/30 mt-2">Thanh toán lúc: {formatDate(order.paidAt)}</p>}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
            <h3 className="font-bold text-sage text-sm mb-3">Thời gian</h3>
            <div className="space-y-2 text-xs text-sage/50">
              <div className="flex justify-between"><span>Đặt hàng:</span><span className="font-medium text-sage">{formatDate(order.createdAt)}</span></div>
              {order.deliveredAt && <div className="flex justify-between"><span>Giao hàng:</span><span className="font-medium text-sage">{formatDate(order.deliveredAt)}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
