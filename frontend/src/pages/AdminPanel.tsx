import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, FileText, Settings, TrendingUp, Users, ShoppingCart, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Doanh thu tháng', value: '128.500.000₫', icon: TrendingUp, color: '#10b981' },
    { label: 'Đơn hàng mới', value: '42', icon: ShoppingCart, color: '#3b82f6' },
    { label: 'Khách hàng', value: '1,240', icon: Users, color: '#8b5cf6' },
    { label: 'Sản phẩm hết hàng', value: '5', icon: AlertCircle, color: '#ef4444' },
  ];

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h3>ADMIN HUB</h3>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>
            <Package size={20} /> Kho hàng
          </button>
          <button className={activeTab === 'news' ? 'active' : ''} onClick={() => setActiveTab('news')}>
            <FileText size={20} /> Tin tức
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Cài đặt
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-content">
            <header className="admin-header">
              <h1>Bảng điều khiển</h1>
              <p>Chào mừng quay trở lại, Admin.</p>
            </header>

            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                    <s.icon size={24} />
                  </div>
                  <div className="stat-info">
                    <span>{s.label}</span>
                    <h3>{s.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-charts-row">
              <div className="chart-placeholder">
                <h4>Biểu đồ doanh thu (7 ngày qua)</h4>
                <div className="mock-bar-chart">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} className="bar" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="recent-orders">
                <h4>Đơn hàng gần đây</h4>
                <div className="order-table-mini">
                  {[1, 2, 3].map(o => (
                    <div key={o} className="order-row-mini">
                      <span>#ORD-882{o}</span>
                      <span>1.250.000₫</span>
                      <span className="status-badge success">Hoàn tất</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-content">
            <header className="admin-header flex-between">
              <h1>Quản lý Kho hàng</h1>
              <button className="btn btn-primary"><Plus size={18} /> Thêm sản phẩm</button>
            </header>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="product-td"><img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=50&q=80" alt="" /> Serum Phục Hồi</td>
                  <td>Trị liệu</td>
                  <td>1.250.000₫</td>
                  <td><span className="stock-warning">5 (Sắp hết)</span></td>
                  <td className="actions-td">
                    <button><Edit size={16} /></button>
                    <button><Trash2 size={16} /></button>
                  </td>
                </tr>
                <tr>
                  <td className="product-td"><img src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=50&q=80" alt="" /> Kem Thảo Mộc</td>
                  <td>Dưỡng ẩm</td>
                  <td>850.000₫</td>
                  <td>45</td>
                  <td className="actions-td">
                    <button><Edit size={16} /></button>
                    <button><Trash2 size={16} /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
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
