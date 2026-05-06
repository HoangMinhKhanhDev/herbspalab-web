import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import CustomCursor from './components/common/CustomCursor';

function App() {
  const location = useLocation();
  const { isAdmin, isAuthenticated } = useAuth();
  const isAtAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      <CustomCursor />
      {!isAtAdmin && <Navbar />}
      <CartSidebar />
      <main className="main-content">
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAtAdmin && <Footer />}
    </div>
  );
}

export default App;
