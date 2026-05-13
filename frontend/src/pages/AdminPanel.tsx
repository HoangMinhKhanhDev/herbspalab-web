import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, 
  ArrowLeft, MessageSquare, Database, FileText, Newspaper, 
  ExternalLink, LogOut, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Sản phẩm', icon: Package },
    { to: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
    { to: '/admin/categories', label: 'Danh mục', icon: FileText },
    { to: '/admin/attributes', label: 'Thuộc tính', icon: Database },
    { to: '/admin/consultations', label: 'Tư vấn', icon: MessageSquare },
    { to: '/admin/news', label: 'Tin tức', icon: Newspaper },
    { to: '/admin/users', label: 'Người dùng', icon: User },
    { to: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-cream font-sans text-sage selection:bg-gold/30 selection:text-sage">
      {/* Sidebar - Optimized Width */}
      <aside className="w-72 bg-sage-dark text-white flex flex-col sticky top-0 h-screen z-30 shadow-[10px_0_40px_rgba(0,0,0,0.15)] border-r border-white/5 flex-shrink-0">
        <div className="p-8 pb-6 border-b border-white/5 flex flex-col items-center">
          <Link to="/" className="group flex flex-col items-center">
            <h2 className="text-2xl font-display italic font-black tracking-tighter text-gold group-hover:text-gold-light transition-all duration-700">
              HerbSpaLab
            </h2>
            <div className="mt-2 px-3 py-1 bg-gold/5 border border-gold/10 rounded-full">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gold-light opacity-60">Admin Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 py-8 scroll-custom">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                flex items-center justify-between px-5 py-3.5 rounded-xl font-bold transition-all duration-500 group
                ${isActive 
                  ? 'bg-gold text-sage-dark shadow-lg ring-1 ring-gold/20' 
                  : 'text-white/30 hover:bg-white/5 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3.5">
                    <item.icon className={`w-4.5 h-4.5 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-gold'}`} />
                    <span className="text-[11px] tracking-widest uppercase font-black">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 transition-all duration-500 ${isActive ? 'opacity-40 translate-x-1' : 'group-hover:opacity-30'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/10 space-y-3">
          <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/70 backdrop-blur-3xl border-b border-sage/5 flex items-center justify-between px-10 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-sage text-gold rounded-xl flex items-center justify-center font-display text-lg font-black border border-white/20">
              H
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-sage italic leading-none">Management Hub</h3>
              <p className="text-[9px] font-bold text-gold uppercase tracking-[0.2em] opacity-60 mt-1">Live Environment</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-white border border-sage/10 rounded-2xl shadow-soft">
              <div className="text-right">
                <p className="text-[10px] font-black text-sage uppercase tracking-tight">Admin User</p>
                <p className="text-[8px] font-bold text-gold uppercase tracking-widest opacity-60">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-sage-dark text-gold rounded-full flex items-center justify-center font-black border-2 border-white/50 text-[10px]">
                AD
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto scroll-custom bg-cream/30">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
