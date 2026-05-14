import React, { useEffect, useState } from 'react';
import { User, Trash2, Search } from 'lucide-react';
import { adminFetchUsers, adminUpdateUserRole, adminDeleteUser } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/format';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await adminFetchUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminUpdateUserRole(userId, newRole);
      toast.success('Cập nhật quyền thành công');
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật quyền');
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
        return <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[9px] font-bold uppercase tracking-wider border border-gold/20">Admin</span>;
      case 'staff':
        return <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-[9px] font-bold uppercase tracking-wider border border-blue-100">Staff</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[9px] font-bold uppercase tracking-wider border border-gray-100">Customer</span>;
    }
  };

  if (loading) return <div className="p-20 text-center font-display italic text-sage/60">Đang đồng bộ cơ sở dữ liệu nhân sự...</div>;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-4">
        <div>
          <div className="flex items-center gap-3 text-gold font-bold text-[11px] uppercase tracking-[0.3em] mb-2">
            <User className="w-4 h-4" />
            Access Management & Governance
          </div>
          <h1 className="text-5xl font-display italic text-sage leading-tight tracking-tight">Quản lý Người dùng</h1>
          <p className="text-sage/40 text-[12px] font-bold uppercase tracking-[0.2em] mt-2">Quản trị nhân sự, phân quyền & Bảo mật tài khoản</p>
        </div>
        <div className="w-full sm:w-96">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-sage/30 group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-4.5 rounded-[2rem] bg-white border border-black/5 focus:border-gold outline-none text-[15px] transition-all shadow-sm text-sage placeholder:text-sage/20 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-sage/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Định danh người dùng</th>
                <th className="px-10 py-6">Phân quyền</th>
                <th className="px-10 py-6">Ngày tham gia</th>
                <th className="px-10 py-6 text-right">Điều chỉnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-gray-50 transition-all">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-mint/10 text-mint rounded-2xl flex items-center justify-center font-bold text-2xl border border-mint/10 shadow-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sage text-xl leading-tight group-hover:text-gold transition-colors">{u.name}</div>
                        <div className="text-[11px] text-sage/40 font-medium uppercase tracking-tight mt-1">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {getRoleBadge(u.role)}
                  </td>
                  <td className="px-10 py-8 text-sm text-sage/40 font-bold uppercase tracking-widest">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-5">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-gray-50 border border-black/5 rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest focus:border-gold outline-none text-sage cursor-pointer transition-all shadow-sm hover:bg-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-3.5 bg-gray-50 text-sage/20 hover:text-red-500 hover:bg-white rounded-xl transition-all border border-black/5 shadow-sm"
                        >
                          <Trash2 className="w-6 h-6" />
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
