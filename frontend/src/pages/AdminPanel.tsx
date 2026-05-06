import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Plus,
  X,
  Save,
  Image as ImageIcon,
  DollarSign,
  Search,
  Database,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [activeSubTab, setActiveSubTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Cơ bản', icon: Package },
    { id: 'pricing', label: 'Giá cả', icon: DollarSign },
    { id: 'media', label: 'Hình ảnh', icon: ImageIcon },
    { id: 'seo', label: 'SEO & Meta', icon: Globe },
    { id: 'advanced', label: 'Nâng cao', icon: Database },
  ];

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="admin-modal"
      >
        <div className="modal-header">
          <div className="header-titles">
            <h2>Chỉnh sửa sản phẩm</h2>
            <p>ID: #PROD-76292</p>
          </div>
          <button className="close-modal" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`modal-tab-item ${activeSubTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSubTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="modal-body scroll-custom">
          {activeSubTab === 'general' && (
            <div className="form-grid">
              <div className="form-group full">
                <label>Tên sản phẩm</label>
                <input type="text" defaultValue="Serum Phục Hồi Nhân Sâm Đỏ" className="admin-input" />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <select className="admin-input">
                  <option>Dưỡng da</option>
                  <option>Làm sạch</option>
                  <option>Trang điểm</option>
                </select>
              </div>
              <div className="form-group">
                <label>Thương hiệu</label>
                <input type="text" defaultValue="HerbSpa Lab" className="admin-input" />
              </div>
              <div className="form-group full">
                <label>Mô tả ngắn</label>
                <textarea rows={4} className="admin-input"></textarea>
              </div>
            </div>
          )}

          {activeSubTab === 'pricing' && (
            <div className="form-grid">
              <div className="form-group">
                <label>Giá niêm yết</label>
                <input type="text" defaultValue="1.250.000" className="admin-input" />
              </div>
              <div className="form-group">
                <label>Giá khuyến mãi</label>
                <input type="text" placeholder="Để trống nếu không có" className="admin-input" />
              </div>
              <div className="form-group">
                <label>Giá vốn (COGS)</label>
                <input type="text" defaultValue="450.000" className="admin-input" />
              </div>
            </div>
          )}

          {activeSubTab === 'media' && (
            <div className="media-upload-zone">
              <div className="upload-placeholder">
                <ImageIcon size={48} />
                <p>Kéo thả ảnh vào đây hoặc nhấn để chọn</p>
                <span>Hỗ trợ JPG, PNG, WebP (Tối đa 2MB)</span>
              </div>
              <div className="media-preview-grid">
                {[1,2,3].map(i => (
                  <div key={i} className="media-item">
                    <img src={`https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80`} alt="preview" />
                    <button className="del-media"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'seo' && (
            <div className="form-grid">
              <div className="form-group full">
                <label>Meta Title</label>
                <input type="text" className="admin-input" />
              </div>
              <div className="form-group full">
                <label>Meta Description</label>
                <textarea rows={3} className="admin-input"></textarea>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-modal-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="btn-modal-save" onClick={onClose}>
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: 'Doanh thu tháng', value: '128.500.000₫', icon: TrendingUp, trend: '+12.5%' },
    { label: 'Đơn hàng mới', value: '42', icon: ShoppingCart, trend: '+8.2%' },
    { label: 'Khách hàng', value: '1,240', icon: Users, trend: '+4.1%' },
    { label: 'Tỷ lệ chuyển đổi', value: '3.8%', icon: TrendingUp, trend: '+1.2%' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar - Glassmorphism */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>ADMIN HUB</h2>
          <p>HERBSPA LAB PREMIUM</p>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> 
            <span>Dashboard</span>
          </button>
          <button 
            className={activeTab === 'inventory' ? 'active' : ''} 
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={20} /> 
            <span>Kho hàng</span>
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} /> 
            <span>Đơn hàng</span>
          </button>
          <button 
            className={activeTab === 'news' ? 'active' : ''} 
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={20} /> 
            <span>Tin tức</span>
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> 
            <span>Cài đặt</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="back-to-site">
            <ArrowLeft size={18} /> 
            <span>QUAY VỀ WEBSITE</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-info">
            <h1>{activeTab === 'dashboard' ? 'Tổng quan' : activeTab === 'inventory' ? 'Kho hàng' : 'Quản lý'}</h1>
            <p>Xin chào, chúc bạn một ngày làm việc hiệu quả.</p>
          </div>
          <div className="header-user-profile">
            <img src="https://ui-avatars.com/api/?name=Admin&background=499e78&color=fff" alt="admin" className="admin-avatar" />
            <span>Quản trị viên</span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-dashboard-view"
          >
            <div className="admin-stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="admin-stat-card">
                  <div className="stat-icon">
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">{stat.label}</span>
                    <h3 className="stat-value">{stat.value}</h3>
                    <span className="stat-trend">{stat.trend} so với tháng trước</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-content-grid">
              <div className="admin-card">
                <div className="card-header">
                  <h3>Doanh thu theo thời gian</h3>
                  <select className="period-select">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                  </select>
                </div>
                <div className="mock-chart">
                  {[40, 70, 45, 90, 55, 80, 60, 85, 45, 95, 65, 75].map((h, i) => (
                    <div key={i} className="chart-bar-wrap">
                      <div className="chart-bar" style={{ height: `${h}%` }}></div>
                      <span className="chart-label">{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card">
                <div className="card-header">
                  <h3>Đơn hàng mới nhất</h3>
                  <button className="text-btn">Tất cả đơn hàng</button>
                </div>
                <div className="order-list-mini">
                  {[1, 2, 3, 4].map(id => (
                    <div key={id} className="order-row">
                      <div className="order-id">#ORD-99{id}</div>
                      <div className="order-price">1.250.000₫</div>
                      <div className="order-status success">Hoàn tất</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <div className="admin-card fade-in">
            <div className="card-header">
              <div className="search-wrap">
                <Search size={18} />
                <input type="text" placeholder="Tìm kiếm sản phẩm..." className="search-input" />
              </div>
              <button className="btn-premium btn-sm" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} />
                Thêm sản phẩm
              </button>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Phân loại</th>
                  <th>Kho hàng</th>
                  <th>Giá bán</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td>
                      <div className="table-product">
                        <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=40&q=80" alt="p" />
                        <span>Serum Phục Hồi #{i}</span>
                      </div>
                    </td>
                    <td>Dưỡng da</td>
                    <td>{i * 12} cái</td>
                    <td>1.250.000₫</td>
                    <td><span className={`status-pill ${i % 2 === 0 ? 'success' : 'warning'}`}>{i % 2 === 0 ? 'Còn hàng' : 'Sắp hết'}</span></td>
                    <td>
                      <button className="action-link" onClick={() => setIsModalOpen(true)}>Chỉnh sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AdminPanel;
