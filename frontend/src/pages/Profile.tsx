import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, Package, MapPin, Settings, LogOut, 
  ChevronRight, LayoutDashboard, Camera, Save, Edit3, Phone, Mail, Calendar
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { getMyOrders } from '../api/orderApi';
import { updateProfile } from '../api/authApi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setFormData({
      name: user.name,
      phone: user.phone || '',
      avatar: user.avatar || ''
    });
    getMyOrders()
      .then(res => setOrders(res.data || []))
      .catch(() => toast.error('Không thể tải danh sách đơn hàng'));
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile(formData);
      updateUser(data);
      setIsEditing(false);
      toast.success('Cập nhật hồ sơ thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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

      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Hồ sơ cá nhân' }]} />

      <div className="profile-layout" aria-label="Khu vực thành viên">
        {/* Profile Sidebar */}
        <aside className="profile-sidebar" aria-label="Thanh điều hướng hồ sơ">
          <div className="profile-user-info">
            <div className="profile-avatar-wrap group relative">
              <div className="relative overflow-hidden rounded-full border-4 border-white shadow-xl bg-secondary flex items-center justify-center text-white text-4xl font-bold w-32 h-32 mx-auto">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" />
                    <input 
                      type="text" 
                      className="hidden" 
                      placeholder="URL ảnh đại diện"
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    />
                  </label>
                )}
              </div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-ink">{user.name}</h3>
            <p className="text-sage font-medium">{user.email}</p>
            <span className="role-tag mt-3 inline-block px-4 py-1 bg-mint/10 text-mint text-[10px] font-bold tracking-widest rounded-full border border-mint/20">
              {user.role.toUpperCase()}
            </span>
          </div>
          <nav className="profile-nav mt-12 space-y-2">
            <button className="active flex items-center gap-3 w-full p-4 rounded-2xl bg-sage/5 text-ink font-semibold border-r-4 border-mint"><User size={18} /> Thông tin cá nhân</button>
            <button className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-sage/5 transition-colors text-sage"><Package size={18} /> Đơn hàng của tôi</button>
            <button className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-sage/5 transition-colors text-sage"><MapPin size={18} /> Sổ địa chỉ</button>
            <button className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-sage/5 transition-colors text-sage"><Settings size={18} /> Cài đặt</button>
            {user.role === 'admin' && (
              <Link to="/admin" className="admin-access-btn flex items-center gap-3 w-full p-4 rounded-2xl bg-gold/10 text-gold font-bold border border-gold/20 hover:bg-gold/20 transition-all mt-4">
                <LayoutDashboard size={18} /> QUẢN TRỊ HỆ THỐNG
              </Link>
            )}
            <button className="logout-btn flex items-center gap-3 w-full p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors mt-8" onClick={handleLogout}><LogOut size={18} /> Đăng xuất</button>
          </nav>
        </aside>

        {/* Profile Main Content */}
        <main className="profile-main flex-1">
          <section className="profile-section bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5" aria-labelledby="personal-info-heading">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 id="personal-info-heading" className="text-2xl font-bold text-ink">Hồ sơ cá nhân</h2>
                <p className="text-sage mt-1">Quản lý thông tin chi tiết về tài khoản của bạn</p>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-mint text-white rounded-full font-bold hover:bg-mint-dark transition-all shadow-lg shadow-mint/20"
                >
                  <Edit3 size={16} /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 bg-gray-100 text-sage rounded-full font-bold hover:bg-gray-200 transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-ink text-white rounded-full font-bold hover:bg-black transition-all shadow-lg shadow-ink/20 disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : <><Save size={16} /> Lưu thay đổi</>}
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.form 
                  key="edit-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                  onSubmit={handleUpdateProfile}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Họ và tên</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-sage/5 border border-black/5 rounded-2xl focus:outline-none focus:border-mint transition-colors font-medium text-ink"
                        placeholder="Nhập họ tên của bạn"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-6 py-4 bg-sage/5 border border-black/5 rounded-2xl focus:outline-none focus:border-mint transition-colors font-medium text-ink"
                        placeholder="Ví dụ: 0987654321"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Email (Không thể thay đổi)</label>
                      <input 
                        type="email" 
                        value={user.email}
                        disabled
                        className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-sage font-medium cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">URL Ảnh đại diện</label>
                      <input 
                        type="text" 
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        className="w-full px-6 py-4 bg-sage/5 border border-black/5 rounded-2xl focus:outline-none focus:border-mint transition-colors font-medium text-ink"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="view-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-10"
                >
                  <div className="flex items-start gap-5 p-6 rounded-3xl bg-sage/5 border border-black/5">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-mint shadow-sm">
                      <User size={24} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sage uppercase tracking-widest">Họ và tên</label>
                      <p className="text-lg font-bold text-ink mt-1">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 p-6 rounded-3xl bg-sage/5 border border-black/5">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-mint shadow-sm">
                      <Mail size={24} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sage uppercase tracking-widest">Địa chỉ Email</label>
                      <p className="text-lg font-bold text-ink mt-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 p-6 rounded-3xl bg-sage/5 border border-black/5">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-mint shadow-sm">
                      <Phone size={24} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sage uppercase tracking-widest">Số điện thoại</label>
                      <p className="text-lg font-bold text-ink mt-1">{user.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 p-6 rounded-3xl bg-sage/5 border border-black/5">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-mint shadow-sm">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sage uppercase tracking-widest">Ngày tham gia</label>
                      <p className="text-lg font-bold text-ink mt-1">{new Date(user.createdAt!).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section className="profile-section mt-12" aria-labelledby="recent-orders-heading">
            <div className="flex items-center justify-between mb-8">
              <h2 id="recent-orders-heading" className="text-2xl font-bold text-ink">Đơn hàng gần đây</h2>
              <Link to="/orders" className="text-mint font-bold text-sm hover:underline">Xem tất cả</Link>
            </div>
            <div className="space-y-4">
              {orders.length > 0 ? orders.map((order: any) => (
                <motion.div 
                  key={order.id} 
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-6 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-sage/5 flex items-center justify-center text-sage group-hover:bg-mint/10 group-hover:text-mint transition-colors">
                      <Package size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-lg">#{order.id?.slice(-8).toUpperCase()}</h4>
                      <p className="text-sage text-sm">Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10 text-right">
                    <div>
                      <p className="font-bold text-ink text-lg">{order.totalPrice?.toLocaleString()}₫</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status === 'delivered' ? 'Đã giao' : order.status === 'cancelled' ? 'Đã hủy' : 'Đang xử lý'}
                      </span>
                    </div>
                    <ChevronRight size={20} className="text-sage group-hover:text-mint transition-colors" />
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-20 bg-sage/5 rounded-[2.5rem] border border-dashed border-sage/30">
                  <Package className="mx-auto text-sage/30 mb-4" size={48} />
                  <p className="text-sage font-medium">Bạn chưa có đơn hàng nào.</p>
                  <Link to="/products" className="inline-block mt-4 text-mint font-bold hover:underline">Khám phá sản phẩm ngay</Link>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
};

export default Profile;

