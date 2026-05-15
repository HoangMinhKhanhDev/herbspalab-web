import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { BarChart3, Users, Globe, Smartphone, Monitor, Tablet, TrendingUp, RefreshCw } from 'lucide-react';
import { getTrafficReport, getCustomerReport } from '../../api/adminApi';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';

const COLORS = ['#1a241b', '#bca37f', '#4a9d7c', '#e8634a', '#6366f1', '#8b5cf6'];

const ReportsPage: React.FC = () => {
  const [traffic, setTraffic] = useState<any>(null);
  const [customers, setCustomers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('traffic');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [t, c] = await Promise.all([getTrafficReport(), getCustomerReport()]);
      setTraffic(t); setCustomers(c);
    } catch { toast.error('Lỗi tải báo cáo'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
    </div>
  );

  const deviceIcons: any = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo Phân tích</h1>
          <p className="text-sm text-gray-500">Thống kê lưu lượng truy cập và dữ liệu khách hàng</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-2 bg-gray-50 p-1 rounded-lg w-fit border border-gray-200">
        {[{ id: 'traffic', label: 'Lưu lượng truy cập', icon: Globe }, { id: 'customers', label: 'Khách hàng', icon: Users }].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'traffic' && traffic && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tổng lượt xem</p>
              <h3 className="text-2xl font-bold text-gray-900">{traffic.totalViews.toLocaleString()}</h3>
            </div>
            {traffic.devices?.slice(0, 2).map((d: any, i: number) => {
              const Icon = deviceIcons[d.name] || Globe;
              return (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Icon size={14} /> {d.name}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{d.value.toLocaleString()}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-sage" /> Xu hướng 30 ngày</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic.dailyTrend}>
                    <defs><linearGradient id="gTraffic" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b9a8b" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b9a8b" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} interval={4} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#8b9a8b" strokeWidth={2} fill="url(#gTraffic)" dot={{ r: 3, fill: '#8b9a8b' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sources Pie */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Nguồn truy cập</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={traffic.sources} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {traffic.sources.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-6">
                {traffic.sources.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600">{s.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50"><h3 className="font-bold text-gray-900">Trang được xem nhiều nhất</h3></div>
            <div className="divide-y divide-gray-100">
              {traffic.topPages?.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-700 font-mono truncate max-w-[200px] sm:max-w-md">{p.path}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{p.views}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && customers && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tổng khách hàng</p>
              <h3 className="text-2xl font-bold text-gray-900">{customers.totalCustomers}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Khách mới (30 ngày)</p>
              <h3 className="text-2xl font-bold text-green-600">{customers.newCustomers}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">LTV trung bình</p>
              <h3 className="text-2xl font-bold text-amber-600">{formatPrice(customers.avgLTV)}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Segments Bar */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Phân khúc khách hàng</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customers.segments} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }} width={100} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="value" fill="#8b9a8b" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Khách hàng mới (6 tháng)</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customers.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="value" fill="#a7bca7" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50"><h3 className="font-bold text-gray-900">Top khách hàng thân thiết</h3></div>
            <div className="divide-y divide-gray-100">
              {customers.topCustomers?.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <div>
                      <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({c.orderCount} đơn)</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{formatPrice(c.totalSpent)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
