import React, { useEffect, useState } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, ShoppingBag, MessageSquare, DollarSign,
  Star, RefreshCw, Clock, ChevronRight, Plus, Eye, ArrowRight, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';
import AdminEmptyState from '../../components/admin/AdminEmptyState';

const COLORS = ['#1a241b', '#bca37f', '#4a9d7c', '#e8634a', '#6366f1', '#8b5cf6'];

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

const StatCard = ({ label, value, growth, icon: Icon, color }: any) => {
  const isPositive = growth >= 0;
  const colors: any = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    mint: 'bg-mint/5 text-mint border-mint/10',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]} border transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold text-sage/30 uppercase tracking-[0.15em] mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-sage tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin" />
      <p className="font-bold text-sage/40 uppercase tracking-[0.2em] text-[10px]">Đang đồng bộ hệ thống dữ liệu...</p>
    </div>
  );
  if (!stats) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24">
      {/* Header & Status */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 pt-4">
        <div>
          <div className="flex items-center gap-3 text-gold font-black text-[10px] uppercase tracking-[0.4em] mb-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-mint/40" />
            </div>
            System Operational • Live
          </div>
          <h1 className="text-6xl font-display italic text-sage leading-tight tracking-tighter">
            {getTimeGreeting()}, <span className="text-gold">Admin</span>
          </h1>
          <p className="text-sage/40 text-[12px] font-bold uppercase tracking-[0.2em] mt-3">Chào mừng bạn trở lại với trung tâm điều hành HerbSpaLab</p>
        </div>
        
        <div className="flex items-center gap-6 bg-white p-6 px-10 rounded-[2.5rem] border border-black/5 shadow-xl backdrop-blur-xl bg-white/60">
          <div className="flex flex-col items-center gap-1 border-r border-black/5 pr-8">
            <span className="text-[10px] font-bold text-sage/30 uppercase tracking-widest">Thời gian</span>
            <span className="text-xl font-bold text-sage">{currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-black/5 pr-8">
            <span className="text-[10px] font-bold text-sage/30 uppercase tracking-widest">Phiên làm việc</span>
            <span className="text-xl font-bold text-mint">Đã xác thực</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-sage rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden border border-black/5">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard label="Doanh thu" value={formatPrice(stats.revenue)} growth={stats.revenueGrowth} icon={DollarSign} color="amber" />
        <StatCard label="Đơn hàng mới" value={stats.orderCount} growth={stats.orderGrowth} icon={ShoppingBag} color="mint" />
        <StatCard label="Khách hàng" value={stats.customerCount} growth={stats.customerGrowth} icon={Users} color="blue" />
        <StatCard label="Tư vấn" value={stats.consultationCount} growth={0} icon={MessageSquare} color="purple" />
      </div>

      {/* Pending Actions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-amber-50 transition-all cursor-pointer">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Cần xử lý</p>
            <h3 className="text-2xl font-bold text-sage">{stats.orderCount || 0} Đơn hàng đang chờ</h3>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-amber-500" />
          </div>
        </div>
        <div className="bg-mint/5 border border-mint/10 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-mint/10 transition-all cursor-pointer">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-mint uppercase tracking-[0.2em]">Yêu cầu mới</p>
            <h3 className="text-2xl font-bold text-sage">{stats.pendingConsultationCount || 0} Tư vấn chưa liên hệ</h3>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6 text-mint" />
          </div>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-blue-50 transition-all cursor-pointer">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Kho hàng</p>
            <h3 className="text-2xl font-bold text-sage">Tình trạng kho ổn định</h3>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Revenue Trend - Spans 2 columns */}
        <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-sage tracking-tight">Xu hướng Doanh thu</h3>
                <p className="text-sage/30 text-[10px] font-bold uppercase tracking-[0.2em]">Báo cáo hiệu suất 7 ngày gần nhất</p>
              </div>
            </div>
            <button onClick={fetchStats} className="p-3 bg-gray-50 text-sage/20 hover:text-sage hover:bg-white rounded-xl transition-all border border-transparent hover:border-black/5">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bca37f" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#bca37f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '20px 24px', background: 'white' }}
                  itemStyle={{ fontWeight: 800, fontSize: '16px', color: '#1a241b' }}
                  labelStyle={{ fontWeight: 900, color: '#bca37f', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                  formatter={(val: number) => [formatPrice(val), 'Doanh thu']}
                />
                <Area type="monotone" dataKey="value" stroke="#bca37f" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 6, fill: '#bca37f', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-mint/5 flex items-center justify-center">
              <Eye className="w-6 h-6 text-mint" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-sage tracking-tight">Nguồn truy cập</h3>
              <p className="text-sage/30 text-[10px] font-bold uppercase tracking-[0.2em]">{stats.trafficCount.toLocaleString()} lượt truy cập tháng này</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.trafficSourceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.trafficSourceBreakdown.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                    itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-10">
              {stats.trafficSourceBreakdown.slice(0, 4).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[11px] font-bold text-sage/40 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold text-sage">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity & Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        {/* Activity Feed */}
        <div className="bg-white rounded-[3rem] border border-black/5 overflow-hidden shadow-sm flex flex-col h-fit">
          <div className="p-8 border-b border-black/5 bg-gray-50/30">
            <h3 className="font-bold text-sage text-sm flex items-center gap-2 tracking-tight">
              <RefreshCw className="w-4 h-4 text-mint animate-spin-slow" /> 
              Hoạt động hệ thống
            </h3>
          </div>
          <div className="p-4 space-y-2 flex-1 flex flex-col">
            {stats.activities?.length > 0 ? stats.activities.map((act: any, idx: number) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-black/5 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${act.type === 'order' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-500'}`}>
                  {act.type === 'order' ? <ShoppingBag className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-sage line-clamp-2 leading-tight">{act.text}</p>
                  <p className="text-[10px] text-sage/30 font-bold uppercase tracking-[0.2em] mt-2">{new Date(act.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <AdminEmptyState
                  icon={Clock}
                  title="Chưa có hoạt động"
                  description="Hệ thống chưa ghi nhận hoạt động nào gần đây."
                />
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="xl:col-span-3 bg-white rounded-[3rem] border border-black/5 overflow-hidden shadow-sm flex flex-col">
          <div className="p-10 border-b border-black/5 bg-gray-50/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-sage tracking-tight">Đơn hàng vừa đặt</h3>
                <p className="text-sage/30 text-[10px] font-bold uppercase tracking-[0.2em]">Cập nhật trạng thái thời gian thực</p>
              </div>
            </div>
            <Link to="/admin/orders" className="flex items-center gap-2 text-[11px] font-black text-sage/40 hover:text-mint uppercase tracking-[0.2em] transition-all">
              Tất cả đơn hàng <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {stats.recentOrders?.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-sage/30 uppercase tracking-[0.3em] border-b border-black/5 bg-gray-50/10">
                    <th className="px-10 py-6">Mã đơn</th>
                    <th className="px-10 py-6">Khách hàng</th>
                    <th className="px-10 py-6 text-center">Trạng thái</th>
                    <th className="px-10 py-6 text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-all group cursor-pointer">
                      <td className="px-10 py-6">
                        <span className="font-mono text-[12px] font-bold text-mint bg-mint/5 px-3 py-1.5 rounded-xl border border-mint/10 group-hover:bg-mint group-hover:text-white transition-all">#{order.id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-sage text-base">{order.user?.name || 'Khách vãng lai'}</span>
                          <span className="text-[11px] text-sage/30 font-bold uppercase tracking-wider mt-1">{formatDate(order.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          'bg-blue-50 text-blue-500 border-blue-200'
                        }`}>
                          {order.status === 'delivered' ? 'Hoàn tất' : order.status === 'pending' ? 'Chờ duyệt' : 'Xử lý'}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right font-bold text-sage text-lg">{formatPrice(order.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10">
                <AdminEmptyState
                  icon={ShoppingBag}
                  title="Không có đơn hàng"
                  description="Chưa có đơn hàng nào được đặt gần đây."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white rounded-[3rem] border border-black/5 overflow-hidden shadow-sm">
          <div className="p-10 border-b border-black/5 bg-gray-50/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-sage tracking-tight">Sản phẩm bán chạy</h3>
                <p className="text-sage/30 text-[10px] font-bold uppercase tracking-[0.2em]">Top hiệu suất kinh doanh</p>
              </div>
            </div>
            <Link to="/admin/products" className="p-3 bg-gray-50 text-sage/20 hover:text-sage hover:bg-white rounded-xl transition-all border border-transparent hover:border-black/5">
              <Plus className="w-5 h-5" />
            </Link>
          </div>
          <div className="divide-y divide-black/5 flex-1 flex flex-col">
            {stats.topProducts?.length > 0 ? stats.topProducts.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between px-10 py-6 hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 text-sage/20 rounded-2xl flex items-center justify-center font-bold text-xl border border-black/5 shadow-inner group-hover:bg-ink group-hover:text-white transition-all">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-sage text-lg group-hover:text-gold transition-colors block leading-tight">{p.name}</span>
                    <span className="text-[11px] font-bold text-sage/25 uppercase tracking-widest mt-2 block">{p.qty} sản phẩm đã bán</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sage text-xl group-hover:text-mint transition-colors tracking-tighter">{formatPrice(p.revenue)}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <TrendingUp className="w-3.5 h-3.5 text-mint" />
                    <span className="text-[10px] font-black text-mint uppercase tracking-[0.2em]">Hot Product</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center p-10">
                <AdminEmptyState
                  icon={Star}
                  title="Chưa có dữ liệu"
                  description="Chưa có thống kê sản phẩm bán chạy trong khoảng thời gian này."
                />
              </div>
            )}
          </div>
          <div className="p-8 bg-gray-50/50 border-t border-black/5">
            <Link to="/admin/products" className="w-full py-5 bg-white border border-black/5 rounded-2xl text-[12px] font-black text-sage/40 hover:text-sage hover:shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em]">
              Quản lý kho hàng sản phẩm <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        {/* Quick Help / Info Card */}
        <div className="bg-ink p-10 rounded-[3rem] text-white flex flex-col justify-between border border-white/5 relative overflow-hidden shadow-2xl group">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 mb-8">
              <Package className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-3xl font-bold italic font-display mb-4">Lưu ý quản vận</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">Đừng quên kiểm tra các yêu cầu tư vấn mới từ khách hàng để đảm bảo tỷ lệ chuyển đổi tối ưu cho HerbSpaLab.</p>
          </div>
          <button className="relative z-10 w-full py-5 bg-gold text-ink rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl active:scale-95">
            Kiểm tra yêu cầu mới
          </button>
          
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold/5 blur-3xl rounded-full group-hover:bg-gold/10 transition-all" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-mint/5 blur-3xl rounded-full group-hover:bg-mint/10 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
