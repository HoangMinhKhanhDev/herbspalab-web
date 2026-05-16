import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Settings,
  MessageSquare, Database, FileText, Newspaper,
  LogOut, ChevronRight, User, BarChart3, Menu, X, Bell,
  Search, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarContentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navItems: any[];
  logout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ sidebarOpen, setSidebarOpen, navItems, logout }) => (
  <div className="flex flex-col h-full bg-[#1a2420] text-gray-400">
    {/* Brand Header */}
    <div className={`h-20 flex items-center border-b border-white/5 ${sidebarOpen ? 'px-4' : 'px-3'} gap-2`}>
      {/* Toggle Button - Same size/alignment as nav items */}
      <div className={sidebarOpen ? 'w-12' : 'w-full aspect-square'}>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`w-full h-full flex items-center justify-center rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300
            ${sidebarOpen ? 'p-2.5' : ''}`}
          title={sidebarOpen ? "Thu gọn" : "Mở rộng"}
        >
          <Menu size={22} className={sidebarOpen ? '' : 'text-[#bca37f]'} />
        </button>
      </div>

      {/* Brand Identity - Positioned to the right of the toggle */}
      {sidebarOpen && (
        <Link to="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-10 h-10 bg-white/5 rounded-xl p-2 flex items-center justify-center flex-shrink-0 group-hover:bg-[#bca37f]/20 transition-all duration-300">
            <img src="/assets/images/logo.svg" alt="HerbSpa" className="w-full h-full object-contain" />
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            <h2 className="text-base font-black text-white tracking-tight leading-none mb-0.5">HerbSpaLab</h2>
            <p className="text-[10px] font-bold text-[#bca37f] uppercase tracking-widest">Admin</p>
          </div>
        </Link>
      )}
    </div>

    {/* Nav Links */}
    <nav className={`flex-1 overflow-y-auto py-10 space-y-4 custom-scrollbar-hidden ${sidebarOpen ? 'px-4' : 'px-3'}`}>
      {navItems.map((item, idx) => {
        if ('group' in item) {
          return sidebarOpen ? (
            <p key={idx} className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] px-5 pt-12 pb-4">
              {item.group}
            </p>
          ) : <div key={idx} className="h-px bg-white/5 my-8 mx-2" />;
        }

        return (
          <NavLink
            key={item.to}
            to={item.to!}
            end={item.end}
            className={({ isActive }) => `
              flex items-center group relative transition-all duration-300 rounded-2xl font-bold
              ${sidebarOpen ? 'px-6 py-5' : 'justify-center w-full aspect-square'}
              ${isActive
                ? 'bg-[#bca37f] text-white shadow-xl shadow-[#bca37f]/25 ring-1 ring-white/10'
                : 'hover:bg-white/5 hover:text-white text-gray-400'}
            `}
            title={!sidebarOpen ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center ${sidebarOpen ? 'gap-6' : 'justify-center'}`}>
                  <item.icon className={`transition-all duration-500 ${sidebarOpen ? 'w-6.5 h-6.5 group-hover:scale-110' : 'w-7.5 h-7.5'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {sidebarOpen && <span className="text-[16px] tracking-wide whitespace-nowrap">{item.label}</span>}
                </div>
                
                {sidebarOpen && (
                  <ChevronRight className={`w-4.5 h-4.5 ml-auto opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0`} />
                )}
                
                {!sidebarOpen && (
                  <div className="fixed left-24 px-4 py-2 bg-[#1a2420] text-white text-xs font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl border border-white/10 z-50 whitespace-nowrap translate-x-[-10px] group-hover:translate-x-0">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>

    {/* Logout Link */}
    <div className={`p-6 border-t border-white/5 bg-black/20`}>
        <button 
          onClick={logout}
          className={`flex items-center rounded-2xl font-bold transition-all duration-300 group
            ${sidebarOpen ? 'px-5 py-3.5 w-full' : 'justify-center w-full aspect-square'}
            text-gray-400 hover:bg-red-500/10 hover:text-red-400`}
        >
          <div className={`flex items-center ${sidebarOpen ? 'gap-4' : 'justify-center'}`}>
            <LogOut size={22} className="transition-transform group-hover:rotate-12" />
            {sidebarOpen && <span className="text-[14px] tracking-wide whitespace-nowrap">Đăng xuất</span>}
          </div>
        </button>
    </div>
  </div>
);

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
    { to: '/admin/users', label: 'Người dùng', icon: User },
    { group: 'HỆ THỐNG' },
    { to: '/admin/reports', label: 'Báo cáo', icon: BarChart3 },
    { to: '/admin/settings', label: 'Cấu hình', icon: Settings },
  ];

  const getBreadcrumb = () => {
    const path = location.pathname.replace('/admin', '').replace(/^\//, '');
    if (!path) return 'Dashboard';
    const firstSegment = path.split('/')[0];
    const item = navItems.find(n => 'to' in n && n.to === `/admin/${firstSegment}`);
    return (item as any)?.label || firstSegment;
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans selection:bg-[#bca37f]/30">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col flex-shrink-0 bg-[#1a2420] border-r border-white/5 relative z-30 shadow-2xl transition-[width] duration-500 ease-in-out overflow-hidden ${
          sidebarOpen ? 'w-[300px]' : 'w-[100px]'
        }`}
      >
        <SidebarContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navItems={navItems}
          logout={logout}
        />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-[#1a2420] z-[101] lg:hidden transition-transform duration-500 ease-out shadow-2xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
           <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#bca37f] text-white rounded-xl flex items-center justify-center font-bold text-xl">H</div>
                <h2 className="text-lg font-bold text-white tracking-tight">HerbSpa</h2>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">
                <X size={20} />
              </button>
           </div>
           <div className="flex-1 overflow-y-auto">
              <SidebarContent
                sidebarOpen={true}
                setSidebarOpen={() => setMobileOpen(false)}
                navItems={navItems}
                logout={logout}
              />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-500 ease-in-out bg-white">
        {/* Global Header */}
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-14 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileOpen(true)} className="p-3 text-gray-500 hover:text-[#1a2420] lg:hidden bg-gray-50 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center gap-3 text-[14px] font-semibold text-gray-400 pl-16">
              <span className="hover:text-[#1a2420] cursor-pointer transition-colors">Hệ thống</span>
              <ChevronRight className="w-4 h-4 text-gray-200" />
              <span className="text-[#1a2420] font-black">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center bg-gray-50 rounded-2xl px-5 py-2.5 border border-gray-100 focus-within:border-[#bca37f] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#bca37f]/5 transition-all group">
              <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#bca37f]" />
              <input type="text" placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none outline-none text-sm ml-3 w-64 text-gray-600 placeholder:text-gray-400" />
            </div>

            <Link to="/" target="_blank" className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-[#bca37f] hover:bg-[#bca37f]/5 rounded-1.5xl transition-all" title="Xem trang chủ">
              <Globe className="w-5.5 h-5.5" />
            </Link>

            <div className="h-8 w-px bg-gray-100 mx-2"></div>

            <button className="relative w-11 h-11 flex items-center justify-center text-gray-400 hover:text-[#1a2420] transition-all hover:bg-gray-50 rounded-1.5xl">
              <Bell className="w-5.5 h-5.5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
            </button>

            <button className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-2xl transition-all ml-2 group border border-transparent hover:border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2420] to-[#2c3b2e] text-[#bca37f] flex items-center justify-center font-black text-sm uppercase shadow-lg shadow-[#1a2420]/10">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden lg:block text-left mr-2">
                 <p className="text-[13px] font-black text-[#1a2420] leading-none mb-1">{user?.name || 'Administrator'}</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Admin</p>
              </div>
            </button>
          </div>
        </header>

        {/* Scrolling Content */}
        <main className="flex-1 overflow-y-auto p-12 lg:p-20 custom-scrollbar bg-white">
          <div className="w-full mx-auto pb-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
