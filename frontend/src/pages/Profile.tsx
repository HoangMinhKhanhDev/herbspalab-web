import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  User, Package, MapPin, LogOut,
  LayoutDashboard, Camera, Save, Edit3,
  Lock, Plus, Navigation
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { getMyOrders } from '../api/orderApi';
import { updateProfile } from '../api/authApi';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/addressApi';
import { uploadSingleFile } from '../api/uploadApi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    gender: user?.gender || '',
    birthday: user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
    password: '',
    confirmPassword: ''
  });

  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detail: '',
    isDefault: false
  });
  const [gettingLocation, setGettingLocation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setFormData({
      name: user.name,
      phone: user.phone || '',
      avatar: user.avatar || '',
      gender: user.gender || '',
      birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
      password: '',
      confirmPassword: ''
    });
    
    if (activeTab === 'orders') {
      getMyOrders()
        .then(res => setOrders(res.data || []))
        .catch(() => toast.error('Không thể tải danh sách đơn hàng'));
    }

    if (activeTab === 'address') {
      loadAddresses();
    }
  }, [user, navigate, activeTab]);

  const loadAddresses = async () => {
    try {
      const { data } = await getAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error('Lỗi khi tải địa chỉ');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Mật khẩu xác nhận không khớp');
    }

    setLoading(true);
    try {
      const { data } = await updateProfile(formData);
      console.log('Updated user data:', data); // Debug log
      updateUser(data);
      setIsEditing(false);
      setFormData(p => ({ ...p, password: '', confirmPassword: '' }));
      toast.success('Cập nhật hồ sơ thành công');
    } catch (error: any) {
      console.error('Update profile error:', error); // Debug log
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
        toast.success('Đã cập nhật địa chỉ');
      } else {
        await addAddress(addressData);
        toast.success('Đã thêm địa chỉ mới');
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      loadAddresses();
    } catch (error) {
      toast.error('Lỗi thao tác địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      loadAddresses();
      toast.success('Đã thiết lập địa chỉ mặc định');
    } catch (error) {
      toast.error('Thất bại');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Xóa địa chỉ này?')) return;
    try {
      await deleteAddress(id);
      loadAddresses();
      toast.success('Đã xóa địa chỉ');
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const res = await uploadSingleFile(file);
      const avatarUrl = res.data?.url || res.data;
      console.log('Avatar URL from server:', avatarUrl); // Debug log
      // Convert relative URL to absolute URL
      const absoluteUrl = avatarUrl.startsWith('http') ? avatarUrl : `${window.location.origin}${avatarUrl}`;
      console.log('Absolute avatar URL:', absoluteUrl); // Debug log
      setFormData({ ...formData, avatar: absoluteUrl });
      toast.success('Đã tải lên ảnh đại diện');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải lên ảnh. Vui lòng thử lại.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Trình duyệt không hỗ trợ định vị');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use OpenStreetMap Nominatim API for reverse geocoding (free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          if (data.address) {
            const addr = data.address;
            setAddressData({
              ...addressData,
              province: addr.city || addr.province || addr.state || '',
              district: addr.district || addr.county || addr.city_district || '',
              ward: addr.suburb || addr.town || addr.village || '',
              detail: addr.road ? `${addr.house_number || ''} ${addr.road}` : ''
            });
            toast.success('Đã lấy vị trí hiện tại');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          toast.error('Không thể chuyển đổi tọa độ thành địa chỉ');
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Không thể lấy vị trí hiện tại. Vui lòng cấp quyền truy cập.');
        setGettingLocation(false);
      }
    );
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
            <div className="profile-avatar-wrap group relative flex justify-center">
              <div className="relative overflow-hidden rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-4xl font-bold w-32 h-32 transition-transform group-hover:scale-105" style={{ backgroundColor: 'var(--clr-gold)' }}>
                {isEditing && formData.avatar ? (
                  <img src={formData.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  (user?.name || 'U').charAt(0).toUpperCase()
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploadingAvatar ? (
                      <span className="text-white text-sm">Đang tải...</span>
                    ) : (
                      <Camera className="text-white" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </label>
                )}
              </div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-ink text-center">{user.name}</h3>
            <p className="text-sage font-medium text-center">{user.email}</p>
          </div>

          <nav className="profile-nav mt-12 space-y-2">
            {[
              { id: 'profile', icon: User, label: 'Hồ sơ của tôi' },
              { id: 'address', icon: MapPin, label: 'Địa chỉ' },
              { id: 'orders', icon: Package, label: 'Đơn hàng' },
              { id: 'password', icon: Lock, label: 'Đổi mật khẩu' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-semibold ${
                  activeTab === tab.id ? 'bg-sage/5 text-ink border-r-4 border-mint' : 'hover:bg-sage/5 text-sage'
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}

            {user.role === 'admin' && (
              <Link to="/admin" className="admin-access-btn flex items-center gap-3 w-full p-4 rounded-2xl bg-gold/10 text-gold font-bold border border-gold/20 hover:bg-gold/20 transition-all mt-4">
                <LayoutDashboard size={18} /> QUẢN TRỊ VIÊN
              </Link>
            )}
            
            <button className="logout-btn flex items-center gap-3 w-full p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors mt-8" onClick={handleLogout}>
              <LogOut size={18} /> Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Profile Main Content */}
        <main className="profile-main flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.section 
                key="profile-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5"
              >
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-black/5">
                  <div>
                    <h2 className="text-2xl font-bold text-ink">Hồ sơ của tôi</h2>
                    <p className="text-sage mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-full font-bold transition-all shadow-lg" style={{ backgroundColor: 'var(--clr-mint)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--clr-mint-dark)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--clr-mint)'}>
                      <Edit3 size={16} /> Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-gray-100 text-sage rounded-full font-bold hover:bg-gray-200">Hủy</button>
                      <button onClick={handleUpdateProfile} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-full font-bold disabled:opacity-50" style={{ backgroundColor: 'var(--clr-ink)', border: 'none' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#000000'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--clr-ink)'}>
                        {loading ? 'Đang lưu...' : <><Save size={16} /> Lưu</>}
                      </button>
                    </div>
                  )}
                </div>

                <form className="space-y-8" onSubmit={handleUpdateProfile}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Tên người dùng</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full px-6 py-4 rounded-2xl border transition-all font-medium ${isEditing ? 'bg-sage/5 border-black/5 focus:border-mint' : 'bg-gray-50 border-transparent cursor-not-allowed text-sage'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Email</label>
                        <input type="email" value={user.email} disabled className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sage font-medium cursor-not-allowed" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Số điện thoại</label>
                        <input 
                          type="tel" 
                          disabled={!isEditing}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-6 py-4 rounded-2xl border transition-all font-medium ${isEditing ? 'bg-sage/5 border-black/5 focus:border-mint' : 'bg-gray-50 border-transparent cursor-not-allowed text-sage'}`}
                          placeholder="Chưa thiết lập"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Giới tính</label>
                        <div className="flex gap-6 px-4 py-4">
                          {['Nam', 'Nữ', 'Khác'].map(g => (
                            <label key={g} className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="radio" 
                                name="gender" 
                                disabled={!isEditing}
                                checked={formData.gender === g}
                                onChange={() => setFormData({ ...formData, gender: g })}
                                className="w-4 h-4 accent-mint"
                              />
                              <span className={`text-sm font-bold ${formData.gender === g ? 'text-mint' : 'text-sage'}`}>{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Ngày sinh</label>
                        <input 
                          type="date" 
                          disabled={!isEditing}
                          value={formData.birthday}
                          onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                          className={`w-full px-6 py-4 rounded-2xl border transition-all font-medium ${isEditing ? 'bg-sage/5 border-black/5 focus:border-mint' : 'bg-gray-50 border-transparent cursor-not-allowed text-sage'}`}
                        />
                      </div>
                   </div>
                </form>
              </motion.section>
            )}

            {activeTab === 'address' && (
              <motion.section 
                key="address-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-ink">Địa chỉ của tôi</h2>
                  <button 
                    onClick={() => { setEditingAddress(null); setAddressData({ fullName: '', phone: '', province: '', district: '', ward: '', detail: '', isDefault: false }); setShowAddressModal(true); }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-ink text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                  >
                    <Plus size={16} /> Thêm địa chỉ mới
                  </button>
                </div>

                <div className="space-y-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-lg font-bold text-ink border-r border-gray-200 pr-4">{addr.fullName}</span>
                            <span className="text-sage font-medium">{addr.phone}</span>
                          </div>
                          <p className="text-sage text-sm mb-1">{addr.detail}</p>
                          <p className="text-sage text-sm">{`${addr.ward}, ${addr.district}, ${addr.province}`}</p>
                          {addr.isDefault && (
                            <span className="inline-block mt-3 px-2 py-0.5 bg-mint/10 text-mint text-[9px] font-black uppercase tracking-widest border border-mint/20 rounded">Mặc định</span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-3">
                           <div className="flex gap-4">
                             <button onClick={() => { setEditingAddress(addr); setAddressData(addr); setShowAddressModal(true); }} className="text-blue-500 text-sm font-bold hover:underline">Cập nhật</button>
                             {!addr.isDefault && (
                               <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 text-sm font-bold hover:underline">Xóa</button>
                             )}
                           </div>
                           {!addr.isDefault && (
                             <button onClick={() => handleSetDefault(addr.id)} className="px-4 py-1 border border-gray-200 rounded text-xs font-bold text-sage hover:bg-gray-50 transition-colors">Thiết lập mặc định</button>
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === 'orders' && (
               <motion.section 
                key="orders-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
               >
                  <h2 className="text-2xl font-bold text-ink mb-8">Lịch sử mua hàng</h2>
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-xs font-black text-mint uppercase tracking-widest">#{order.id.slice(-8)}</span>
                           <span className="text-xs font-bold text-sage">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <p className="text-lg font-bold text-ink">Tổng tiền: {order.totalPrice.toLocaleString()}₫</p>
                           <span className="px-4 py-1 bg-sage/5 text-sage text-[10px] font-black uppercase tracking-widest rounded-full">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </motion.section>
            )}

            {activeTab === 'password' && (
               <motion.section 
                key="password-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-black/5"
               >
                  <h2 className="text-2xl font-bold text-ink mb-10 pb-6 border-b border-black/5">Thay đổi mật khẩu</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-lg">
                     <div className="space-y-2">
                        <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Mật khẩu mới</label>
                        <input 
                          type="password" 
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-6 py-4 bg-sage/5 border border-black/5 rounded-2xl focus:border-mint outline-none font-medium"
                          placeholder="********"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-bold text-sage uppercase tracking-widest px-4">Xác nhận mật khẩu mới</label>
                        <input 
                          type="password" 
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full px-6 py-4 bg-sage/5 border border-black/5 rounded-2xl focus:border-mint outline-none font-medium"
                          placeholder="********"
                        />
                     </div>
                     <button type="submit" className="w-full py-4 bg-ink text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-ink/20">Cập nhật mật khẩu</button>
                  </form>
               </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
           >
              <div className="px-10 py-8 border-b border-black/5 flex justify-between items-center bg-gray-50/50">
                 <h3 className="text-2xl font-bold text-ink">{editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                 <button onClick={() => setShowAddressModal(false)} className="text-sage hover:text-ink"><X size={24}/></button>
              </div>
              <form onSubmit={handleAddressAction} className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Họ và tên" className="w-full px-6 py-3.5 bg-sage/5 rounded-xl border-none outline-none font-bold text-ink text-sm" value={addressData.fullName} onChange={e => setAddressData({...addressData, fullName: e.target.value})} />
                    <input required placeholder="Số điện thoại" className="w-full px-6 py-3.5 bg-sage/5 rounded-xl border-none outline-none font-bold text-ink text-sm" value={addressData.phone} onChange={e => setAddressData({...addressData, phone: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <input required placeholder="Tỉnh/Thành phố" className="w-full px-4 py-3 bg-sage/5 rounded-xl border-none outline-none font-bold text-ink text-xs" value={addressData.province} onChange={e => setAddressData({...addressData, province: e.target.value})} />
                    <input required placeholder="Quận/Huyện" className="w-full px-4 py-3 bg-sage/5 rounded-xl border-none outline-none font-bold text-ink text-xs" value={addressData.district} onChange={e => setAddressData({...addressData, district: e.target.value})} />
                    <input required placeholder="Phường/Xã" className="w-full px-4 py-3 bg-sage/5 rounded-xl border-none outline-none font-bold text-ink text-xs" value={addressData.ward} onChange={e => setAddressData({...addressData, ward: e.target.value})} />
                 </div>
                 <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={gettingLocation}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-mint/10 text-mint rounded-xl font-bold text-sm hover:bg-mint/20 transition-all disabled:opacity-50"
                 >
                    <Navigation size={16} />
                    {gettingLocation ? 'Đang lấy vị trí...' : 'Sử dụng vị trí hiện tại'}
                 </button>
                 <textarea required placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)" className="w-full px-6 py-4 bg-sage/5 rounded-xl border-none outline-none font-bold text-ink text-sm min-h-[100px]" value={addressData.detail} onChange={e => setAddressData({...addressData, detail: e.target.value})} />
                 
                 <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={addressData.isDefault} onChange={e => setAddressData({...addressData, isDefault: e.target.checked})} className="w-5 h-5 accent-mint" />
                    <span className="text-sm font-bold text-sage">Đặt làm địa chỉ mặc định</span>
                 </label>

                 <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-4 bg-gray-100 text-sage rounded-2xl font-black text-xs uppercase tracking-widest">Hủy</button>
                    <button type="submit" className="flex-1 py-4 bg-ink text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-ink/20">Hoàn thành</button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const X = ({size, ...p}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export default Profile;
