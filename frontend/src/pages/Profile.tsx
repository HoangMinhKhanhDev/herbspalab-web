import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const orders = [
    { id: '#HSB-9921', date: '06/05/2026', total: '1.280.000₫', status: 'Đang xử lý' },
    { id: '#HSB-8812', date: '20/04/2026', total: '850.000₫', status: 'Đã giao' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page container section"
    >
      <SEO 
        title="Hồ Sơ Của Tôi | HerbSpa Lab" 
        description="Quản lý thông tin cá nhân, theo dõi đơn hàng và cài đặt tài khoản tại HerbSpa Lab." 
      />

      <div className="profile-layout" aria-label="Khu vực thành viên">
        {/* Profile Sidebar */}
        <aside className="profile-sidebar" aria-label="Thanh điều hướng hồ sơ">
          <div className="profile-user-info">
            <div className="profile-avatar-wrap">
              <LazyImage src={user.avatar} alt={`Ảnh đại diện của ${user.name}`} className="profile-avatar" />
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className="role-tag" aria-label={`Vai trò: ${user.role}`}>{user.role.toUpperCase()}</span>
          </div>
          <nav className="profile-nav" aria-label="Menu hồ sơ">
            <button className="active" aria-current="page"><User size={18} /> Thông tin cá nhân</button>
            <button><Package size={18} /> Đơn hàng của tôi</button>
            <button><MapPin size={18} /> Sổ địa chỉ</button>
            <button><Settings size={18} /> Cài đặt</button>
            {user.role === 'admin' && (
              <Link to="/admin" className="admin-access-btn" aria-label="Truy cập bảng điều khiển quản trị">
                <LayoutDashboard size={18} /> QUẢN TRỊ HỆ THỐNG
              </Link>
            )}
            <button className="logout-btn" onClick={handleLogout} aria-label="Đăng xuất khỏi tài khoản"><LogOut size={18} /> Đăng xuất</button>
          </nav>
        </aside>

        {/* Profile Main Content */}
        <main className="profile-main">
          <section className="profile-section" aria-labelledby="personal-info-heading">
            <div className="section-header-flex">
              <h2 id="personal-info-heading">Hồ sơ cá nhân</h2>
              <button className="btn btn-outline btn-sm" aria-label="Chỉnh sửa thông tin cá nhân">Chỉnh sửa</button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Họ và tên</label>
                <p>{user.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Số điện thoại</label>
                <p>098****321</p>
              </div>
              <div className="info-item">
                <label>Ngày tham gia</label>
                <p>01/05/2026</p>
              </div>
            </div>
          </section>

          <section className="profile-section mt-40" aria-labelledby="recent-orders-heading">
            <h2 id="recent-orders-heading">Đơn hàng gần đây</h2>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card" role="article" aria-label={`Đơn hàng ${order.id}`}>
                  <div className="order-info">
                    <strong>{order.id}</strong>
                    <span>Ngày đặt: {order.date}</span>
                  </div>
                  <div className="order-meta">
                    <span className="order-total" aria-label="Tổng tiền">{order.total}</span>
                    <span className={`status-pill ${order.status === 'Đã giao' ? 'success' : 'warning'}`} aria-label={`Trạng thái: ${order.status}`}>
                      {order.status}
                    </span>
                    <ChevronRight size={18} aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
};

export default Profile;
