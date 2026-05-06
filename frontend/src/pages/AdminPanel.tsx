import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Newspaper, 
  Settings, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Doanh thu tháng', value: '128.500.000₫', icon: TrendingUp },
    { label: 'Đơn hàng mới', value: '42', icon: ShoppingCart },
    { label: 'Khách hàng', value: '1,240', icon: Users },
    { label: 'Hết hàng', value: '5', icon: AlertTriangle },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>ADMIN HUB</h2>
          <p>HERBSPA LAB LUXURY</p>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            className={activeTab === 'inventory' ? 'active' : ''} 
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={20} /> Kho hàng
          </button>
          <button 
            className={activeTab === 'news' ? 'active' : ''} 
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={20} /> Tin tức
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> Cài đặt
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="back-to-site">
            <ArrowLeft size={18} /> QUAY VỀ WEBSITE
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-info">
            <h1>{activeTab === 'dashboard' ? 'Bảng điều khiển' : activeTab.toUpperCase()}</h1>
            <p>Chào mừng quay trở lại, Admin.</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline btn-sm">Xuất báo cáo</button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-dashboard"
          >
            <div className="admin-stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="admin-stat-card">
                  <div className="stat-icon">
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">{stat.label}</span>
                    <h3 className="stat-value">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-content-grid">
              <div className="admin-card chart-card">
                <h3>Biểu đồ doanh thu (7 ngày qua)</h3>
                <div className="mock-chart">
                  {[40, 70, 45, 90, 55, 80, 60].map((h, i) => (
                    <div key={i} className="chart-bar-wrap">
                      <div className="chart-bar" style={{ height: `${h}%` }}></div>
                      <span className="chart-label">T{i+2}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card orders-card">
                <div className="card-header">
                  <h3>Đơn hàng gần đây</h3>
                  <button className="text-btn">Xem tất cả</button>
                </div>
                <div className="recent-orders">
                  {[1, 2, 3].map(id => (
                    <div key={id} className="order-row">
                      <div className="order-id">#ORD-862{id}</div>
                      <div className="order-price">1.250.000₫</div>
                      <div className="order-status success">Hoàn tất</div>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <div className="admin-card">
            <div className="card-header">
              <h3>Quản lý Kho hàng</h3>
              <button className="btn btn-primary btn-sm">Thêm sản phẩm</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Tồn kho</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Serum Phục Hồi</td>
                  <td>Dưỡng da</td>
                  <td>8</td>
                  <td>1.250.000₫</td>
                  <td><span className="status-pill warning">Sắp hết</span></td>
                </tr>
                <tr>
                  <td>Kem Dưỡng Thảo Mộc</td>
                  <td>Dưỡng da</td>
                  <td>24</td>
                  <td>850.000₫</td>
                  <td><span className="status-pill success">Còn hàng</span></td>
                </tr>
                <tr>
                  <td>Mặt Nạ Thải Độc</td>
                  <td>Làm sạch</td>
                  <td>12</td>
                  <td>450.000₫</td>
                  <td><span className="status-pill success">Còn hàng</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'news' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-content">
             <header className="admin-header flex-between">
              <h1>Quản lý Tin tức</h1>
              <button className="btn btn-primary"><Plus size={18} /> Viết bài mới</button>
            </header>
            <div className="news-editor-placeholder">
              <div className="editor-toolbar">
                <strong>B</strong> <em>I</em> <u>U</u> | 🔗 Ảnh | Danh sách
              </div>
              <textarea placeholder="Bắt đầu viết bài của bạn tại đây..." className="mock-editor"></textarea>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
