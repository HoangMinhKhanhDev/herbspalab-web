import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Sun, Moon, Heart } from 'lucide-react';
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

  return (
    <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Menu chính">
      <div className="container nav-wrap">
        <Link to="/" className="brand-logo" aria-label="HerbSpa Lab - Quay về trang chủ">HERBSPA LAB</Link>
        
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
            className="util-icon" 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Tìm kiếm sản phẩm"
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <Link to="/wishlist" className="util-icon wishlist-util" aria-label={`Danh sách yêu thích (${wishlist.length} mục)`}>
            <Heart size={18} fill={wishlist.length > 0 ? "var(--secondary)" : "none"} stroke={wishlist.length > 0 ? "var(--secondary)" : "currentColor"} aria-hidden="true" />
            {wishlist.length > 0 && <span className="util-badge">{wishlist.length}</span>}
          </Link>
          <Link to={isAuthenticated ? "/profile" : "/login"} className="util-icon" aria-label={isAuthenticated ? "Hồ sơ cá nhân" : "Đăng nhập"}>
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
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="side-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di động"
          >
            <div className="side-menu-header">
               <button onClick={() => setIsMenuOpen(false)} aria-label="Đóng menu"><X aria-hidden="true" /></button>
            </div>
            <div className="side-menu-links">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  {link.name.toUpperCase()}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>ADMIN PANEL</Link>
              {isAuthenticated ? (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>HỒ SƠ CỦA TÔI</Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>ĐĂNG NHẬP</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SmartSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  );
};
