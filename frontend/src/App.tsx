import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Component } from 'react';
import type { ReactNode } from 'react';
import './App.css';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import News from './pages/News';
import SkinQuiz from './pages/SkinQuiz';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CustomCursor from './components/common/CustomCursor';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';
import CategoryManager from './pages/admin/CategoryManager';
import AttributeManager from './pages/admin/AttributeManager';
import ConsultationManager from './pages/admin/ConsultationManager';
import NewsManager from './pages/admin/NewsManager';
import NewsEdit from './pages/admin/NewsEdit';
import Settings from './pages/admin/Settings';
import UserManager from './pages/admin/UserManager';
import OrderDetail from './pages/admin/OrderDetail';
import ReportsPage from './pages/admin/ReportsPage';

import { Toaster } from 'react-hot-toast';

// ─── Error Boundary ──────────────────────────────────────────────────────────

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem',
          background: '#f8f5f0', padding: '2rem', textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--primary, #1a3a2a)', fontFamily: 'serif' }}>Đã xảy ra lỗi</h2>
          <pre style={{ background: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#e53e3e', maxWidth: '600px', whiteSpace: 'pre-wrap' }}>
            {this.state.error}
          </pre>
          <button
            onClick={() => { this.setState({ hasError: false, error: '' }); window.location.href = '/'; }}
            style={{ padding: '0.75rem 2rem', background: 'var(--secondary, #bca37f)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Quay về trang chủ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const { isAdmin, isAuthenticated } = useAuth();
  const isAtAdmin = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="app-wrapper auth-page" style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        backgroundImage: "linear-gradient(rgba(15, 23, 21, 0.82), rgba(15, 23, 21, 0.82)), url('/assets/images/auth_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <CustomCursor />
        <Navbar />
        <CartSidebar />
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 'var(--nav-height, 130px)', width: '100%', flexShrink: 0 }} />
          <div style={{ flex: '1 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '6rem 2rem' }}>
            <ErrorBoundary>
              <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </ErrorBoundary>
          </div>
          <Footer />
          <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#1a1a1a', color: '#fff', borderRadius: '1rem', fontSize: '14px' } }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`app-wrapper ${isAtAdmin ? 'admin-page' : ''}`}>
      <CustomCursor />
      {!isAtAdmin && <Navbar />}
      <CartSidebar />
      <main className="main-content">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/news" element={<News />} />
              <Route path="/skin-quiz" element={<SkinQuiz />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/login" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/:id" element={<ProductEdit />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="attributes" element={<AttributeManager />} />
                <Route path="consultations" element={<ConsultationManager />} />
                <Route path="news" element={<NewsManager />} />
                <Route path="news/:id" element={<NewsEdit />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="users" element={<UserManager />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      {!isAtAdmin && <Footer />}
      <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#1a1a1a', color: '#fff', borderRadius: '1rem', fontSize: '14px' } }} />
    </div>
  );
}

export default App;
