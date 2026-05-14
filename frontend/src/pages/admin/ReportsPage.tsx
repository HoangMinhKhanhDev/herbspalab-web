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

  if (loading) return <div className="p-16 text-center text-sage/40 text-sm">Đang tải báo cáo...</div>;

  const deviceIcons: any = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600/80 font-bold text-[10px] uppercase tracking-[0.2em] mb-1"><BarChart3 className="w-3.5 h-3.5" /> Analytics</div>
          <h1 className="text-3xl font-bold text-sage tracking-tight">Báo cáo Chuyên sâu</h1>
        </div>
        <button onClick={fetchData} className="p-2.5 bg-white border border-black/5 rounded-xl text-sage/30 hover:text-sage transition-all shadow-sm"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-2">
        {[{ id: 'traffic', label: 'Lưu lượng truy cập', icon: Globe }, { id: 'customers', label: 'Phân khúc khách hàng', icon: Users }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${activeTab === tab.id ? 'bg-ink text-white border-ink shadow-md' : 'bg-white text-sage/40 border-black/5 hover:text-sage'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'traffic' && traffic && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-[10px] font-bold text-sage/30 uppercase tracking-wider mb-1">Tổng lượt xem</p>
              <h3 className="text-2xl font-bold text-sage">{traffic.totalViews.toLocaleString()}</h3>
            </div>
            {traffic.devices?.slice(0, 2).map((d: any, i: number) => {
              const Icon = deviceIcons[d.name] || Globe;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                  <p className="text-[10px] font-bold text-sage/30 uppercase tracking-wider mb-1 flex items-center gap-1"><Icon className="w-3 h-3" /> {d.name}</p>
                  <h3 className="text-2xl font-bold text-sage">{d.value.toLocaleString()}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Daily trend */}
            <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h3 className="text-sm font-bold text-sage mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-500" /> Xu hướng 30 ngày</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic.dailyTrend}>
                    <defs><linearGradient id="gTraffic" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a241b" stopOpacity={0.1} /><stop offset="95%" stopColor="#1a241b" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} interval={4} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', padding: '8px 12px' }} />
                    <Area type="monotone" dataKey="value" stroke="#1a241b" strokeWidth={2} fill="url(#gTraffic)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sources Pie */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h3 className="text-sm font-bold text-sage mb-4">Nguồn truy cập</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={traffic.sources} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                    {traffic.sources.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-3">
                {traffic.sources.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /><span className="text-sage/60 font-medium">{s.name}</span></div>
                    <span className="font-bold text-sage">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 bg-gray-50/30"><h3 className="text-sm font-bold text-sage">Trang được xem nhiều nhất</h3></div>
            <div className="divide-y divide-black/5">
              {traffic.topPages?.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-md bg-gray-100 text-sage/40 flex items-center justify-center text-xs font-bold">{i + 1}</span><span className="text-sm font-medium text-sage font-mono">{p.path}</span></div>
                  <span className="text-sm font-bold text-sage">{p.views}</span>
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
            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-[10px] font-bold text-sage/30 uppercase tracking-wider mb-1">Tổng khách hàng</p>
              <h3 className="text-2xl font-bold text-sage">{customers.totalCustomers}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-[10px] font-bold text-sage/30 uppercase tracking-wider mb-1">Khách mới (30 ngày)</p>
              <h3 className="text-2xl font-bold text-mint">{customers.newCustomers}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-[10px] font-bold text-sage/30 uppercase tracking-wider mb-1">LTV trung bình</p>
              <h3 className="text-2xl font-bold text-amber-600">{formatPrice(customers.avgLTV)}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Segments Bar */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h3 className="text-sm font-bold text-sage mb-4">Phân khúc khách hàng</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customers.segments} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} width={120} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', padding: '8px 12px' }} />
                    <Bar dataKey="value" fill="#1a241b" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h3 className="text-sm font-bold text-sage mb-4">Khách hàng mới (6 tháng)</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customers.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', padding: '8px 12px' }} />
                    <Bar dataKey="value" fill="#4a9d7c" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 bg-gray-50/30"><h3 className="text-sm font-bold text-sage">Top khách hàng thân thiết</h3></div>
            <div className="divide-y divide-black/5">
              {customers.topCustomers?.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <div><span className="font-bold text-sage text-sm">{c.name}</span><span className="text-[10px] text-sage/30 ml-2">{c.orderCount} đơn</span></div>
                  </div>
                  <span className="font-bold text-sage">{formatPrice(c.totalSpent)}</span>
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
