import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Settings,
  MessageSquare, Database, FileText, Newspaper,
  LogOut, ChevronRight, User, BarChart3, Menu, X, Bell,
  Search, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { group: 'QUẢN LÝ CHÍNH' },
    { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Sản phẩm', icon: Package },
    { to: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
    { group: 'NỘI DUNG' },
    { to: '/admin/categories', label: 'Danh mục', icon: FileText },
    { to: '/admin/attributes', label: 'Thuộc tính', icon: Database },
    { to: '/admin/news', label: 'Tin tức', icon: Newspaper },
    { to: '/admin/comments', label: 'Bình luận', icon: MessageSquare },
    { group: 'CHĂM SÓC' },
    { to: '/admin/consultations', label: 'Tư vấn', icon: MessageSquare },
    { to: '/admin/users', label: 'Khách hàng', icon: User },
    { group: 'HỆ THỐNG' },
    { to: '/admin/reports', label: 'Báo cáo', icon: BarChart3 },
    { to: '/admin/settings', label: 'Cấu hình', icon: Settings },
  ];

  const getBreadcrumb = () => {
    const path = location.pathname.replace('/admin', '').replace(/^\//, '');
    if (!path) return 'Dashboard';
    const item = navItems.find(n => 'to' in n && n.to === `/admin/${path.split('/')[0]}`);
    return (item as any)?.label || path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1a2420] text-gray-400">
      {/* Brand Logo */}
      <div className={`h-20 flex items-center border-b border-white/5 ${sidebarOpen ? 'px-6' : 'justify-center'}`}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#bca37f] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-[#bca37f]/20 flex-shrink-0">H</div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold text-white tracking-tight">HerbSpa</h2>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-bold text-[#bca37f] uppercase tracking-widest">Admin Center</p>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className={`flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar ${sidebarOpen ? 'px-4' : 'px-2'}`}>
        {navItems.map((item, idx) => {
          if ('group' in item) {
            return sidebarOpen ? (
              <p key={idx} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 pt-4 pb-2">
                {item.group}
              </p>
            ) : <div key={idx} className="h-px bg-white/5 my-4" />;
          }

          return (
            <NavLink
              key={item.to}
              to={item.to!}
              end={item.end}
              className={({ isActive }) => `
                flex items-center group relative ${sidebarOpen ? 'px-4 py-2.5' : 'justify-center py-3'} rounded-xl font-medium transition-all duration-200
                ${isActive
                  ? 'bg-[#bca37f] text-white shadow-lg shadow-[#bca37f]/20'
                  : 'hover:bg-white/5 hover:text-white'}
              `}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? 'group-hover:scale-110' : ''}`} />
                {sidebarOpen && <span className="text-[13px] tracking-wide">{item.label}</span>}
              </div>
              {sidebarOpen && (
                <ChevronRight className={`w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0`} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className={`p-4 border-t border-white/5 bg-black/10`}>
        {sidebarOpen ? (
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#bca37f] flex items-center justify-center font-bold text-white text-sm shrink-0 border-2 border-white/10 uppercase">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@herbspalab.com'}</p>
              </div>
              <button 
                onClick={logout} 
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={logout} title="Đăng xuất" className="w-full py-4 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] font-sans text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      
      {/* Mobile Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-screen w-72 bg-[#1a2420] z-50 transform transition-transform duration-300 lg:hidden shadow-2xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden">
          <X className="w-6 h-6" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar Container */}
      <aside className={`hidden lg:flex ${sidebarOpen ? 'w-72' : 'w-20'} sticky top-0 h-screen z-30 transition-all duration-300 shadow-xl`}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-500 hover:text-[#1a2420] lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-2 text-gray-400 hover:text-[#1a2420] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-[13px] font-medium text-gray-500">
              <span className="hover:text-gray-900 cursor-pointer transition-colors">Hệ thống</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-[#1a2420] font-bold">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-1.5 mr-4 border border-gray-200 focus-within:border-[#bca37f] transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Tìm nhanh..." className="bg-transparent border-none outline-none text-xs ml-2 w-48 text-gray-600" />
            </div>

            <Link to="/" target="_blank" className="p-2 text-gray-400 hover:text-[#bca37f] transition-colors" title="Xem trang chủ">
              <Globe className="w-5 h-5" />
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <button className="relative p-2 text-gray-400 hover:text-[#1a2420] transition-all hover:bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
            </button>

            <button className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-xl transition-all ml-2">
              <div className="w-8 h-8 rounded-lg bg-sage/10 text-sage flex items-center justify-center font-bold text-xs uppercase border border-sage/20">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </button>
          </div>
        </header>

        {/* Scrolling Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
