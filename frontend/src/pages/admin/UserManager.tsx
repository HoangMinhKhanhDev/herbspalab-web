import React, { useEffect, useState } from 'react';
import { User, Shield, Trash2, Mail, Calendar, Sparkles, ShieldCheck, ShieldAlert, UserCheck } from 'lucide-react';
import { adminFetchUsers, adminUpdateUserRole, adminDeleteUser } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await adminFetchUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminUpdateUserRole(userId, newRole);
      toast.success('Cập nhật quyền thành công');
      loadUsers();
    } catch (error) {
      toast.error('Lỗi khi cập nhật quyền');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Xóa người dùng này? Thao tác này không thể hoàn tác.')) return;
    try {
      await adminDeleteUser(userId);
      toast.success('Đã xóa người dùng');
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gold text-sage-dark rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-gold/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
          </div>
        );
      case 'staff':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-sage text-white rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-sage/20">
            <Shield className="w-3.5 h-3.5" /> Staff
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-cream text-sage/40 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-sage/10">
            <UserCheck className="w-3.5 h-3.5" /> Customer
          </div>
        );
    }
  };

  if (loading) return <div className="p-20 text-center font-display italic text-sage/40">Đang đồng bộ cơ sở dữ liệu nhân sự...</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-gold font-black text-[10px] uppercase tracking-[0.3em] mb-2 opacity-80">
            <ShieldAlert className="w-4 h-4" />
            Access Management
          </div>
          <h1 className="text-5xl font-display font-black text-sage tracking-tight">Quản lý <span className="text-gold italic">Người dùng</span></h1>
          <p className="text-sage/40 text-lg font-medium italic">Thiết lập quyền hạn và quản lý cộng đồng khách hàng HerbSpaLab.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-premium border border-sage/5 overflow-hidden transition-all duration-700 hover:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sage/[0.02] border-b border-sage/5">
                <th className="px-10 py-8 text-[11px] font-black text-sage/40 uppercase tracking-[0.3em]">Người dùng</th>
                <th className="px-10 py-8 text-[11px] font-black text-sage/40 uppercase tracking-[0.3em]">Vai trò hiện tại</th>
                <th className="px-10 py-8 text-[11px] font-black text-sage/40 uppercase tracking-[0.3em]">Ngày gia nhập</th>
                <th className="px-10 py-8 text-[11px] font-black text-sage/40 uppercase tracking-[0.3em] text-right">Phân quyền & Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/5">
              {users.map((u) => (
                <tr key={u.id} className="group/row hover:bg-sage/[0.01] transition-all duration-500">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-gold border border-sage/5 group-hover/row:scale-110 transition-transform">
                        <User className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="font-display font-black text-sage text-2xl block group-hover/row:text-gold transition-colors">{u.name}</span>
                        <div className="flex items-center gap-2 text-sage/40 text-[11px] font-bold mt-1">
                          <Mail className="w-3.5 h-3.5" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {getRoleBadge(u.role)}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-sage/60 font-bold text-sm">
                      <Calendar className="w-4 h-4 text-gold/40" />
                      {formatDate(u.createdAt)}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center justify-end gap-6">
                      <div className="relative group/select">
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="appearance-none bg-cream border border-sage/10 rounded-2xl px-6 py-3 pr-12 text-[10px] font-black uppercase tracking-widest text-sage focus:ring-4 focus:ring-gold/10 outline-none cursor-pointer transition-all hover:border-gold"
                        >
                          <option value="customer">Khách hàng</option>
                          <option value="staff">Nhân viên</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold pointer-events-none" />
                      </div>
                      
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="w-12 h-12 bg-red-50 text-red-200 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover/row:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
