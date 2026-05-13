import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, MessageSquare, DollarSign, Package, Star, Calendar
} from 'lucide-react';
import { getAdminStats } from '../../api/adminApi';
import { formatPrice } from '../../utils/format';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="space-y-10 animate-pulse p-4">
      <div className="h-20 bg-white/50 rounded-3xl w-1/3 border border-sage/5" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-white rounded-[2rem] border border-sage/5 shadow-soft" />)}
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="h-96 bg-white rounded-[2.5rem] border border-sage/5 shadow-soft" />
        <div className="h-96 bg-white rounded-[2.5rem] border border-sage/5 shadow-soft" />
      </div>
    </div>
  );

  if (!stats) return (
    <div className="p-20 text-center flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <div className="w-24 h-24 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-8 shadow-inner border border-red-100/50">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-display font-bold text-sage mb-4">Lỗi kết nối máy chủ quản trị</h2>
      <p className="text-sage/40 max-w-md mx-auto italic text-lg leading-relaxed mb-8">
        Hệ thống không thể truy xuất dữ liệu thời gian thực. Vui lòng kiểm tra kết nối mạng hoặc liên hệ kỹ thuật viên để được hỗ trợ.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-12 py-4 bg-sage text-white rounded-2xl font-bold hover:bg-sage-dark shadow-xl shadow-sage/20 transition-all active:scale-95"
      >
        Thử tải lại trang
      </button>
    </div>
  );

  const statCards = [
    { label: 'Doanh thu thuần', value: formatPrice(stats.revenue), icon: DollarSign, color: 'text-gold', bg: 'bg-gold/5', border: 'border-gold/10' },
    { label: 'Đơn hàng mới', value: stats.orderCount, icon: ShoppingBag, color: 'text-sage', bg: 'bg-sage/5', border: 'border-sage/10' },
    { label: 'Khách hàng mới', value: stats.newCustomerCount, icon: Users, color: 'text-sage', bg: 'bg-sage/5', border: 'border-sage/10' },
    { label: 'Yêu cầu tư vấn', value: stats.consultationCount, icon: MessageSquare, color: 'text-gold', bg: 'bg-gold/5', border: 'border-gold/10' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-gold font-black text-[10px] uppercase tracking-[0.3em] mb-2 opacity-80">
            <Calendar className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-5xl font-display font-black text-sage tracking-tight">Chào mừng trở lại, <span className="text-gold italic">Admin</span></h1>
          <p className="text-sage/40 text-lg font-medium italic">Dưới đây là báo cáo phân tích hiệu quả kinh doanh của HerbSpaLab ngày hôm nay.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-sage/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-sage hover:border-gold transition-all shadow-soft">Xuất báo cáo</button>
          <button className="px-6 py-3 bg-sage text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sage-dark transition-all shadow-xl shadow-sage/10">Xem chi tiết</button>
        </div>
      </div>

      {/* Stats Grid - More Spacious */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, idx) => (
          <div key={idx} className={`bg-white p-10 rounded-[2.5rem] border ${card.border} shadow-soft hover:shadow-premium transition-all duration-700 group cursor-default relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-full -mr-16 -mt-16 opacity-50 transition-transform duration-700 group-hover:scale-125`} />
            <div className={`w-16 h-16 rounded-2xl ${card.bg} flex items-center justify-center mb-8 relative z-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] mb-2">{card.label}</p>
              <h3 className="text-3xl font-display font-black text-sage">{card.value}</h3>
              <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                <TrendingUp className="w-3 h-3" />
                +12% so với tháng trước
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts - Premium Glass Containers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="bg-white p-12 rounded-[3rem] border border-sage/5 shadow-soft hover:shadow-premium transition-all duration-700">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-display font-black text-sage flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-gold" />
                Xu hướng Doanh thu
              </h3>
              <p className="text-sage/40 text-xs font-bold uppercase tracking-[0.15em] mt-1 ml-12">Dữ liệu 7 ngày gần nhất</p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bca37f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#bca37f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f5f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#1a241b', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#1a241b', fontSize: 10, fontWeight: 900}} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px 30px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '15px', color: '#1a241b' }}
                  labelStyle={{ fontFamily: 'Playfair Display', fontWeight: 900, color: '#bca37f', fontSize: '18px', marginBottom: '8px', fontStyle: 'italic' }}
                  formatter={(val: number) => [formatPrice(val), 'Doanh thu']}
                />
                <Area type="monotone" dataKey="value" stroke="#bca37f" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[3rem] border border-sage/5 shadow-soft hover:shadow-premium transition-all duration-700">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-display font-black text-sage flex items-center gap-4">
                <Package className="w-8 h-8 text-sage" />
                Lượng truy cập
              </h3>
              <p className="text-sage/40 text-xs font-bold uppercase tracking-[0.15em] mt-1 ml-12">Lưu lượng truy cập hệ thống</p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.trafficTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f5f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#1a241b', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#1a241b', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                  cursor={{fill: '#fcfaf7'}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px 30px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '15px', color: '#1a241b' }}
                  labelStyle={{ fontFamily: 'Playfair Display', fontWeight: 900, color: '#1a241b', fontSize: '18px', marginBottom: '8px', fontStyle: 'italic' }}
                  formatter={(val: number) => [val, 'Lượt truy cập']}
                />
                <Bar dataKey="value" fill="#1a241b" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products - Editorial Table */}
      <div className="bg-white rounded-[4rem] shadow-soft border border-sage/5 overflow-hidden transition-all duration-700 hover:shadow-premium">
        <div className="p-12 border-b border-sage/5 bg-sage/[0.01] flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-display font-black text-sage flex items-center gap-5">
              <Star className="w-10 h-10 text-gold fill-gold animate-pulse" />
              Sản phẩm xuất sắc nhất
            </h3>
            <p className="text-sage/40 text-xs font-bold uppercase tracking-[0.2em] mt-2 ml-14">Top Performing Collections</p>
          </div>
          <button className="px-8 py-3 bg-gold/5 border border-gold/10 text-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-gold hover:text-white transition-all shadow-sm">
            Tất cả sản phẩm
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sage/[0.03] text-sage/40 text-[11px] uppercase tracking-[0.3em]">
                <th className="px-12 py-8 font-black">Thứ hạng & Sản phẩm</th>
                <th className="px-12 py-8 font-black">Lượng tiêu thụ</th>
                <th className="px-12 py-8 font-black text-right">Giá trị mang lại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/5">
              {stats.topProducts.map((p: any, idx: number) => (
                <tr key={idx} className="hover:bg-sage/[0.01] transition-all duration-500 group/row">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 bg-sage/5 text-gold rounded-2xl flex items-center justify-center font-display text-2xl font-black border border-gold/10 group-hover/row:bg-gold group-hover/row:text-white transition-all">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-display font-black text-sage text-2xl group-hover/row:text-gold transition-colors block mb-1">{p.name}</span>
                        <span className="text-[10px] font-bold text-sage/30 uppercase tracking-[0.1em]">Collection 2026</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gold rounded-full" />
                      <span className="text-sage font-black text-lg">
                        {p.qty} <span className="text-xs font-bold text-sage/40 uppercase tracking-widest ml-1">Đơn vị</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <span className="text-sage font-display font-black text-3xl tracking-tight group-hover/row:text-gold transition-colors">{formatPrice(p.revenue)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
