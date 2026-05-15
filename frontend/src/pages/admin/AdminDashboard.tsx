import React, { useEffect, useState } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, ShoppingBag, MessageSquare, DollarSign,
  Star, RefreshCw, Clock, ChevronRight, Eye, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/format';

const COLORS = ['#1a241b', '#bca37f', '#4a9d7c', '#e8634a', '#6366f1', '#8b5cf6'];

const StatCard = ({ label, value, growth, icon: Icon, color }: any) => {
  const isPositive = growth >= 0;
  const colorClasses: any = {
    amber: 'text-amber-600 bg-amber-50',
    mint: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
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
    <div className="p-20 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Đang tải dữ liệu hệ thống...</p>
    </div>
  );
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-sm text-gray-500">Tổng quan hoạt động kinh doanh của HerbSpaLab</p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Doanh thu" value={formatPrice(stats.revenue)} growth={stats.revenueGrowth} icon={DollarSign} color="amber" />
        <StatCard label="Đơn hàng" value={stats.orderCount} growth={stats.orderGrowth} icon={ShoppingBag} color="mint" />
        <StatCard label="Khách hàng" value={stats.customerCount} growth={stats.customerGrowth} icon={Users} color="blue" />
        <StatCard label="Tư vấn" value={stats.consultationCount} growth={0} icon={MessageSquare} color="purple" />
      </div>

      {/* Action Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/orders" className="p-4 rounded-xl border border-amber-100 bg-amber-50 flex items-center justify-between hover:bg-amber-100 transition-colors">
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Đơn hàng mới</p>
            <h3 className="text-lg font-bold text-gray-900">{stats.orderCount || 0} Đang chờ duyệt</h3>
          </div>
          <Package className="text-amber-500" size={24} />
        </Link>
        <Link to="/admin/consultations" className="p-4 rounded-xl border border-green-100 bg-green-50 flex items-center justify-between hover:bg-green-100 transition-colors">
          <div>
            <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Tư vấn mới</p>
            <h3 className="text-lg font-bold text-gray-900">{stats.pendingConsultationCount || 0} Chưa liên hệ</h3>
          </div>
          <MessageSquare className="text-green-600" size={24} />
        </Link>
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Hệ thống</p>
            <h3 className="text-lg font-bold text-gray-900">Hoạt động ổn định</h3>
          </div>
          <TrendingUp className="text-blue-500" size={24} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Xu hướng Doanh thu</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">7 ngày gần đây</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bca37f" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#bca37f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  formatter={(val: any) => [formatPrice(Number(val)), 'Doanh thu']}
                />
                <Area type="monotone" dataKey="value" stroke="#bca37f" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 4, fill: '#bca37f', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Nguồn truy cập</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.trafficSourceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.trafficSourceBreakdown.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {stats.trafficSourceBreakdown.slice(0, 4).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-gray-500 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-fit">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Clock size={16} /> Hoạt động
            </h3>
          </div>
          <div className="p-2 divide-y divide-gray-50">
            {stats.activities?.slice(0, 6).map((act: any, idx: number) => (
              <div key={idx} className="p-3">
                <p className="text-xs text-gray-700 leading-snug">{act.text}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(act.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Đơn hàng vừa đặt</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-sage hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3">Mã đơn</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-sage">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.user?.name || 'Khách vãng lai'}</div>
                      <div className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status === 'delivered' ? 'Xong' : order.status === 'pending' ? 'Chờ' : 'Xử lý'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatPrice(order.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
