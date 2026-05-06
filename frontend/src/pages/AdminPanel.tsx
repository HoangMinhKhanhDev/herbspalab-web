import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, User } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminPanel = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/stats`).then(res => res.json()).then(setStats);
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-nav">
        <div className="admin-brand">HERBSPA ADMIN</div>
        <nav>
          <div className="nav-item active"><LayoutDashboard size={18} /> Tổng quan</div>
          <div className="nav-item"><Package size={18} /> Sản phẩm</div>
          <div className="nav-item"><ShoppingCart size={18} /> Đơn hàng</div>
          <div className="nav-item"><Users size={18} /> Thành viên</div>
          <div className="nav-item"><Settings size={18} /> Cài đặt</div>
        </nav>
      </div>
      <div className="admin-main">
        <header className="admin-header">
          <h2>Bảng điều khiển</h2>
          <div className="admin-user-profile">
            <User size={20} />
            <span>Quản trị viên</span>
          </div>
        </header>
        <div className="admin-stats-container">
          <div className="admin-stat-box">
            <div className="stat-label">Doanh thu tháng</div>
            <div className="stat-num">{stats?.totalRevenue?.toLocaleString()}₫</div>
            <div className="stat-trend">+12% so với tháng trước</div>
          </div>
          <div className="admin-stat-box">
            <div className="stat-label">Đơn hàng mới</div>
            <div className="stat-num">{stats?.newOrders}</div>
            <div className="stat-trend">+5% so với tuần trước</div>
          </div>
          <div className="admin-stat-box">
            <div className="stat-label">Lượng truy cập</div>
            <div className="stat-num">4.829</div>
            <div className="stat-trend">+18% tăng trưởng</div>
          </div>
        </div>
        <div className="admin-table-section">
          <h3>Đơn hàng cần xử lý</h3>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Trạng thái</th>
                <th>Tổng cộng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-8821</td>
                <td>Phạm Minh T</td>
                <td><span className="st-badge success">Hoàn thành</span></td>
                <td>1.250.000₫</td>
                <td><button className="table-action">Chi tiết</button></td>
              </tr>
              <tr>
                <td>#ORD-8822</td>
                <td>Lê Hoàng N</td>
                <td><span className="st-badge pending">Đang chờ</span></td>
                <td>3.450.000₫</td>
                <td><button className="table-action">Chi tiết</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
