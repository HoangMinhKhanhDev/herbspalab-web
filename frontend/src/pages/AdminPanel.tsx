import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Settings,
  MessageSquare, Database, FileText, Newspaper,
  LogOut, ChevronRight, User, BarChart3, Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Sản phẩm', icon: Package },
    { to: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
    { to: '/admin/categories', label: 'Danh mục', icon: FileText },
    { to: '/admin/attributes', label: 'Thuộc tính', icon: Database },
    { to: '/admin/consultations', label: 'Tư vấn', icon: MessageSquare },
    { to: '/admin/reports', label: 'Báo cáo', icon: BarChart3 },
    { to: '/admin/news', label: 'Tin tức', icon: Newspaper },
    { to: '/admin/users', label: 'Người dùng', icon: User },
    { to: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ];

  // Get breadcrumb from current path
  const getBreadcrumb = () => {
    const path = location.pathname.replace('/admin', '').replace(/^\//, '');
    if (!path) return 'Tổng quan';
    const item = navItems.find(n => n.to === `/admin/${path.split('/')[0]}`);
    return item?.label || path;
  };

  const SidebarContent = () => (
    <>
      <div className={`p-8 border-b border-black/5 ${sidebarOpen ? '' : 'px-4'}`}>
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-11 h-11 bg-ink text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">H</div>
          {sidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <h2 className="text-xl font-bold tracking-tight text-sage uppercase leading-tight">
                HerbSpaLab
              </h2>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-mint mt-0.5 opacity-80">Administration</p>
            </div>
          )}
        </Link>
      </div>

      <nav className={`flex-1 overflow-y-auto py-6 space-y-1 scroll-custom ${sidebarOpen ? 'px-4' : 'px-2'}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              flex items-center ${sidebarOpen ? 'justify-between px-5 py-3.5' : 'justify-center px-2 py-3.5'} rounded-xl font-bold transition-all duration-300 group
              ${isActive
                ? 'bg-mint/10 text-mint shadow-sm'
                : 'text-sage/40 hover:bg-gray-50 hover:text-ink hover:opacity-100'}
            `}
            title={!sidebarOpen ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon className={`w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 flex-shrink-0`} />
                  {sidebarOpen && (
                    <span className="text-[11px] tracking-[0.15em] uppercase font-black">{item.label}</span>
                  )}
                </div>
                {sidebarOpen && (
                  <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`p-4 mt-auto border-t border-black/5 ${sidebarOpen ? '' : 'px-2'}`}>
        {sidebarOpen ? (
          <div className="bg-gray-50 rounded-2xl p-4 border border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center font-bold text-mint shadow-sm text-base flex-shrink-0">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-sage truncate uppercase tracking-[0.15em]">Quản trị viên</p>
                <button onClick={logout} className="text-[9px] text-sage/40 hover:text-red-500 font-bold uppercase tracking-[0.1em] transition-colors flex items-center gap-1.5 mt-0.5">
                  <LogOut className="w-3 h-3" /> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={logout} title="Đăng xuất" className="w-full p-3 flex items-center justify-center text-sage/30 hover:text-red-500 rounded-xl transition-all hover:bg-red-50">
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/80 font-sans text-sage">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-72 bg-white flex flex-col z-50 shadow-2xl transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setMobileOpen(false)} className="p-2 text-sage/40 hover:text-sage rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-[72px]'} bg-white flex-col sticky top-0 h-screen z-30 shadow-[4px_0_20px_rgba(0,0,0,0.02)] border-r border-black/5 flex-shrink-0 transition-all duration-300`}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-black/5 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button onClick={() => setMobileOpen(true)} className="p-2 text-sage/40 hover:text-sage rounded-xl transition-colors lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            {/* Desktop Toggle */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 text-sage/30 hover:text-sage rounded-xl transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
              <span className="text-sage/30">Admin</span>
              <ChevronRight className="w-3 h-3 text-sage/20" />
              <span className="text-sage">{getBreadcrumb()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-sage/30 hover:text-sage rounded-xl transition-colors hover:bg-gray-50">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-lg bg-mint/10 text-mint flex items-center justify-center font-bold text-sm border border-mint/10">A</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scroll-custom bg-transparent">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
