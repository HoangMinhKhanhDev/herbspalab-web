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
    { to: '/admin/comments', label: 'Bình luận', icon: MessageSquare },
    { to: '/admin/users', label: 'Người dùng', icon: User },
    { to: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ];

  const getBreadcrumb = () => {
    const path = location.pathname.replace('/admin', '').replace(/^\//, '');
    if (!path) return 'Tổng quan';
    const item = navItems.find(n => n.to === `/admin/${path.split('/')[0]}`);
    return item?.label || path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className={`p-6 border-b border-slate-800 ${sidebarOpen ? '' : 'px-4'}`}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage text-white rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">H</div>
          {sidebarOpen && (
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">HerbSpa</h2>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Admin Center</p>
            </div>
          )}
        </Link>
      </div>

      <nav className={`flex-1 overflow-y-auto py-6 space-y-1 ${sidebarOpen ? 'px-4' : 'px-2'}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              flex items-center ${sidebarOpen ? 'justify-between px-4 py-3' : 'justify-center px-2 py-3'} rounded-lg font-medium transition-colors
              ${isActive
                ? 'bg-sage text-white'
                : 'hover:bg-slate-800 hover:text-white'}
            `}
            title={!sidebarOpen ? item.label : undefined}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </div>
          </NavLink>
        ))}
      </nav>

      <div className={`p-4 border-t border-slate-800 ${sidebarOpen ? '' : 'px-2'}`}>
        {sidebarOpen ? (
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">Administrator</p>
                <button onClick={logout} className="text-[10px] text-slate-400 hover:text-red-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <LogOut className="w-3 h-3" /> Thoát
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={logout} title="Đăng xuất" className="w-full p-3 flex items-center justify-center text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 z-50 transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-20'} sticky top-0 h-screen z-30 transition-all duration-300`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-500 hover:text-gray-900 lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-2 text-gray-400 hover:text-gray-900">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <span className="hidden sm:inline">Quản trị</span>
              <ChevronRight className="w-3 h-3 text-gray-300 hidden sm:inline" />
              <span className="text-gray-900 font-bold">{getBreadcrumb()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
