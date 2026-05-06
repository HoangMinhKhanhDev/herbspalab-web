import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Sun, Moon, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();

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
    <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-wrap">
        <Link to="/" className="brand-logo">HERBSPA LAB</Link>
        
        <div className="desktop-links">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={location.pathname === link.path ? 'active' : ''}
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="nav-utils">
          <button className="util-icon theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Search size={18} className="util-icon" />
          <Link to="/wishlist" className="util-icon wishlist-util">
            <Heart size={18} fill={wishlist.length > 0 ? "var(--secondary)" : "none"} stroke={wishlist.length > 0 ? "var(--secondary)" : "currentColor"} />
            {wishlist.length > 0 && <span className="util-badge">{wishlist.length}</span>}
          </Link>
          <Link to="/login" className="util-icon"><User size={18} /></Link>
          <div className="cart-util util-icon" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={18} />
            <span className="util-badge">{cartCount}</span>
          </div>
          <button className="mobile-toggle util-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          >
            <div className="side-menu-header">
               <button onClick={() => setIsMenuOpen(false)}><X /></button>
            </div>
            <div className="side-menu-links">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name.toUpperCase()}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>ADMIN PANEL</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
