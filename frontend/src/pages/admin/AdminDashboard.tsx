import React, { useEffect, useState } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, ShoppingBag, MessageSquare, DollarSign,
  Star, RefreshCw, Clock, ChevronRight, Eye, Package, Calendar, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';

const COLORS = ['#2c3b2e', '#bca37f', '#4a9d7c', '#e8634a', '#6366f1', '#8b5cf6'];

const StatCard = ({ label, value, growth, icon: Icon, color }: any) => {
  const isPositive = growth >= 0;
  const colorThemes: any = {
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100', accent: 'border-amber-100' },
    mint: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100', accent: 'border-green-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100', accent: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100', accent: 'border-purple-100' },
  };
  const theme = colorThemes[color] || colorThemes.amber;

  return (
    <div className={`bg-white p-5 rounded-2xl border ${theme.accent} shadow-sm hover:shadow-md transition-all group overflow-hidden relative`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110 opacity-50" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl ${theme.iconBg} ${theme.text}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
          <span className="text-[10px] text-gray-400 font-medium">/ tháng</span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-sage/10 border-t-sage rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-sage/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-500 font-medium animate-pulse">Đang đồng bộ hóa dữ liệu...</p>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-sage uppercase tracking-widest mb-1">
            <Calendar size={12} /> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Bảng điều khiển</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Chào mừng trở lại, Administrator.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-xs font-bold text-gray-600 hover:border-sage hover:text-sage transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới dữ liệu
          </button>
          <Link to="/admin/reports" className="px-5 py-2.5 bg-[#1a2420] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#1a2420]/20 hover:bg-[#2c3b2e] transition-all flex items-center gap-2">
            Tải báo cáo <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Tổng doanh thu" value={formatPrice(stats.revenue)} growth={stats.revenueGrowth} icon={DollarSign} color="amber" />
        <StatCard label="Đơn hàng" value={stats.orderCount} growth={stats.orderGrowth} icon={ShoppingBag} color="mint" />
        <StatCard label="Khách hàng" value={stats.customerCount} growth={stats.customerGrowth} icon={Users} color="blue" />
        <StatCard label="Tư vấn mới" value={stats.pendingConsultationCount} growth={0} icon={MessageSquare} color="purple" />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <TrendingUp size={120} />
          </div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="font-bold text-gray-900 text-lg tracking-tight">Xu hướng doanh thu</h3>
              <p className="text-xs text-gray-400 font-medium">Biểu đồ tăng trưởng 7 ngày gần nhất</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button className="px-3 py-1 text-[10px] font-bold bg-white text-gray-900 rounded shadow-sm border border-gray-200">Tuần</button>
              <button className="px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600">Tháng</button>
            </div>
          </div>

          <div className="h-[320px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bca37f" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#bca37f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }} 
                  tickFormatter={(val) => `${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : (val/1000).toFixed(0) + 'k'}`} 
                />
                <Tooltip
                  cursor={{ stroke: '#bca37f', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                    padding: '16px',
                    backgroundColor: '#1a2420',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#bca37f', fontWeight: 'bold' }}
                  labelStyle={{ marginBottom: '8px', opacity: 0.7, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  formatter={(val: any) => [formatPrice(Number(val)), 'Doanh thu']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#bca37f" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  dot={{ r: 5, fill: '#bca37f', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#1a2420' }}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Channels Breakdown */}
        <div className="bg-[#1a2420] p-7 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="relative z-10 mb-8">
            <h3 className="font-bold text-lg tracking-tight text-white">Nguồn truy cập</h3>
            <p className="text-xs text-white/40 font-medium">Phân phối lượng traffic</p>
          </div>

          <div className="h-[200px] relative z-10 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.trafficSourceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {stats.trafficSourceBreakdown.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', color: '#333' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{(stats.trafficSourceBreakdown.reduce((a:any, b:any) => a + b.value, 0))}</span>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Lượt truy cập</span>
            </div>
          </div>

          <div className="mt-8 space-y-3 relative z-10 bg-white/5 p-4 rounded-2xl border border-white/5">
            {stats.trafficSourceBreakdown.slice(0, 4).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full ring-4 ring-white/5" style={{ backgroundColor: COLORS[(idx + 1) % COLORS.length] }} />
                  <span className="text-xs text-white/70 font-medium group-hover:text-white transition-colors">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{item.value}</span>
                  <div className="w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sage" style={{ width: `${(item.value / stats.trafficSourceBreakdown.reduce((a:any, b:any) => a + b.value, 0)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity & Secondary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Activity Feed Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Clock size={16} className="text-sage" /> Nhật ký hoạt động
            </h3>
            <span className="text-[10px] font-black text-white bg-sage px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          <div className="p-3 space-y-1">
            {stats.activities?.slice(0, 7).map((act: any, idx: number) => (
              <div key={idx} className="p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-default group border border-transparent hover:border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-sage shrink-0 group-hover:scale-150 transition-transform"></div>
                  <div>
                    <p className="text-[12px] text-gray-700 font-medium leading-relaxed">{act.text}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {new Date(act.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Vừa xong</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-auto p-4 text-[11px] font-bold text-sage hover:bg-sage/5 transition-colors border-t border-gray-50 flex items-center justify-center gap-2">
            Xem báo cáo nhật ký <ArrowRight size={14} />
          </button>
        </div>

        {/* Detailed Orders Table */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base tracking-tight">Đơn hàng vừa đặt</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Thời gian thực</p>
            </div>
            <Link to="/admin/orders" className="h-9 w-9 bg-sage/10 text-sage rounded-xl flex items-center justify-center hover:bg-sage hover:text-white transition-all shadow-sm">
              <Eye size={18} />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                  <th className="px-7 py-4 border-b border-gray-50">Mã đơn hàng</th>
                  <th className="px-7 py-4 border-b border-gray-50">Khách hàng</th>
                  <th className="px-7 py-4 border-b border-gray-50 text-center">Trạng thái</th>
                  <th className="px-7 py-4 border-b border-gray-50 text-right">Tổng thanh toán</th>
                  <th className="px-7 py-4 border-b border-gray-50 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="group hover:bg-[#f8f9f8] transition-all">
                    <td className="px-7 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-black text-sage group-hover:scale-105 transition-transform origin-left tracking-tight">#{order.id.slice(-8).toUpperCase()}</span>
                        <span className="text-[9px] text-gray-400 font-bold mt-0.5">Giao dịch thành công</span>
                      </div>
                    </td>
                    <td className="px-7 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-[10px] border border-gray-200">
                          {order.user?.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-gray-900 group-hover:text-sage transition-colors">{order.user?.name || 'Khách vãng lai'}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{formatDate(order.createdAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-600' :
                          order.status === 'pending' ? 'bg-amber-600' :
                          'bg-blue-600'
                        }`}></span>
                        {order.status === 'delivered' ? 'Hoàn tất' : order.status === 'pending' ? 'Chờ duyệt' : 'Đang xử lý'}
                      </span>
                    </td>
                    <td className="px-7 py-4 text-right">
                      <div className="text-[14px] font-black text-gray-900 tracking-tight">{formatPrice(order.totalPrice)}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Tiền mặt / COD</div>
                    </td>
                    <td className="px-7 py-4 text-center">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="p-2 text-gray-400 hover:text-[#1a2420] hover:bg-gray-100 rounded-lg transition-all inline-block"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
             <Link to="/admin/orders" className="text-[11px] font-black text-gray-400 hover:text-sage uppercase tracking-[0.2em] transition-all">
                Xem chi tiết lịch sử đơn hàng
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
