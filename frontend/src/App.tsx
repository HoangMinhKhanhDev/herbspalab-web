import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Component, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import './App.css';

// Components (eager - always needed)
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import CustomCursor from './components/common/CustomCursor';

// Pages (lazy loaded for code splitting)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const SkinQuiz = lazy(() => import('./pages/SkinQuiz'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const ProductEdit = lazy(() => import('./pages/admin/ProductEdit'));
const OrderList = lazy(() => import('./pages/admin/OrderList'));
const OrderDetail = lazy(() => import('./pages/admin/OrderDetail'));
const CategoryManager = lazy(() => import('./pages/admin/CategoryManager'));
const AttributeManager = lazy(() => import('./pages/admin/AttributeManager'));
const ConsultationManager = lazy(() => import('./pages/admin/ConsultationManager'));
const NewsManager = lazy(() => import('./pages/admin/NewsManager'));
const NewsEdit = lazy(() => import('./pages/admin/NewsEdit'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));

import ScrollToTop from './components/common/ScrollToTop';
import { useAuth } from './context/AuthContext';

const PageLoader = () => (
  <div className="fixed top-0 left-0 w-full z-[10000] pointer-events-none">
    <div className="h-1 bg-sage animate-loading-bar shadow-[0_0_10px_rgba(26,36,32,0.3)]"></div>
  </div>
);

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
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const isAtAdmin = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  if (isLoading) return <PageLoader />;

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
              <Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
          <Footer />
          <ScrollToTop />
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
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/skin-quiz" element={<SkinQuiz />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
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
                  <Route path="comments" element={<AdminComments />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!isAtAdmin && <Footer />}
      <ScrollToTop />
      <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#1a1a1a', color: '#fff', borderRadius: '1rem', fontSize: '14px' } }} />
    </div>
  );
}

export default App;
