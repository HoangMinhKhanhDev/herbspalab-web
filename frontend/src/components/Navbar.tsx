import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Sun, Moon, Heart, Home, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SmartSearch from './common/SmartSearch';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Giới thiệu', path: '/about' },
    { name: 'Sản phẩm', path: '/products' },
    { name: 'Tư vấn da', path: '/skin-quiz' },
    { name: 'Tin tức', path: '/news' },
  ];

  const mobileNavItems = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: Leaf, label: 'Sản phẩm', path: '/products' },
    { icon: Search, label: 'Tìm kiếm', path: '#search' },
    { icon: Heart, label: 'Yêu thích', path: '/wishlist' },
    { icon: User, label: 'Tài khoản', path: isAuthenticated ? '/profile' : '/login' },
  ];

  return (
    <>
    <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Menu chính">
      <div className="container nav-wrap">
        <Link to="/" className="brand-logo" aria-label="HerbSpaLab - Quay về trang chủ">
          <img src="/assets/images/logo.svg" alt="HerbSpaLab Logo" className="nav-logo-img" />
          <span>HERBSPALAB</span>
        </Link>
        
        <div className="desktop-links" role="menubar">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={location.pathname === link.path ? 'active' : ''}
              aria-current={location.pathname === link.path ? 'page' : undefined}
              role="menuitem"
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="nav-utils">
          <button 
            className="util-icon theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Chuyển sang chế độ ${theme === 'light' ? 'tối' : 'sáng'}`}
          >
            {theme === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
          </button>
          
          <button 
            className="util-icon hide-mobile" 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Tìm kiếm sản phẩm"
          >
            <Search size={18} aria-hidden="true" />
          </button>
          
          <Link to="/wishlist" className="util-icon wishlist-util hide-mobile" aria-label={`Danh sách yêu thích (${wishlist.length} mục)`}>
            <Heart size={18} fill={wishlist.length > 0 ? "var(--secondary)" : "none"} stroke={wishlist.length > 0 ? "var(--secondary)" : "currentColor"} aria-hidden="true" />
            {wishlist.length > 0 && <span className="util-badge">{wishlist.length}</span>}
          </Link>
          
          <Link to={isAuthenticated ? "/profile" : "/login"} className="util-icon hide-mobile" aria-label={isAuthenticated ? "Hồ sơ cá nhân" : "Đăng nhập"}>
            <User size={18} aria-hidden="true" />
          </Link>
          
          <button 
            className="cart-util util-icon" 
            onClick={() => setIsCartOpen(true)}
            aria-label={`Giỏ hàng (${cartCount} sản phẩm)`}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span className="util-badge">{cartCount}</span>
          </button>
          
          <button 
            className="mobile-toggle util-icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu di động"}
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="side-menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="side-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu di động"
            >
              <div className="side-menu-header">
                <span className="hero-tag interactive">HERBSPALAB</span>
                <button className="close-side" onClick={() => setIsMenuOpen(false)} aria-label="Đóng menu"><X size={24} /></button>
              </div>
              
              <div className="side-menu-links">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={location.pathname === link.path ? 'active' : ''}
                  >
                    {link.name.toUpperCase()}
                  </Link>
                ))}
                
                <div className="side-divider"></div>
                
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>YÊU THÍCH ({wishlist.length})</Link>
                {isAuthenticated ? (
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>HỒ SƠ CỦA TÔI</Link>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>ĐĂNG NHẬP / ĐĂNG KÝ</Link>
                )}
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="admin-link">QUẢN TRỊ VIÊN</Link>
                
                <div className="side-theme-toggle">
                  <span>Chế độ {theme === 'light' ? 'Sáng' : 'Tối'}</span>
                  <button onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SmartSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>

    {/* Mobile Bottom Navigation - Glass Pill */}
    <div className="mobile-bottom-nav" aria-label="Điều hướng di động">
      {mobileNavItems.map((item) => (
        item.path === '#search' ? (
          <button
            key="search"
            className="bottom-nav-item"
            onClick={() => setIsSearchOpen(true)}
            aria-label={item.label}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ) : (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            aria-label={item.label}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        )
      ))}
    </div>
    </>
  );
};
