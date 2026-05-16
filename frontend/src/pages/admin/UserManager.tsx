import React, { useEffect, useState } from 'react';
import { User, Trash2, Search, Shield, UserCheck, Users, ChevronRight, Mail, Calendar } from 'lucide-react';
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
    setLoading(true);
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
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest ring-4 ring-amber-500/5">
            <Shield size={12} strokeWidth={2.5} />
            Administrator
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest ring-4 ring-indigo-500/5">
            <UserCheck size={12} strokeWidth={2.5} />
            Staff Member
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-widest ring-4 ring-gray-500/5">
            <Users size={12} strokeWidth={2.5} />
            Customer
          </span>
        );
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Cơ sở dữ liệu Người dùng</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Quản lý quyền truy cập, bảo mật và thông tin cá nhân khách hàng HerbSpaLab.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sage transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo định danh hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-[13px] font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all shadow-sm" 
            />
          </div>
        </div>
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-6">Người dùng định danh</th>
                <th className="px-8 py-6">Phân cấp quyền</th>
                <th className="px-8 py-6">Ngày khởi tạo</th>
                <th className="px-8 py-6 text-right">Quản trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-32 text-center">
                    <div className="w-12 h-12 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Truy vấn cơ sở dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-32 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <User size={32} className="text-gray-200" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">Không tìm thấy người dùng nào phù hợp</p>
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-[#f8f9f8] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#1a2420] text-white rounded-[1rem] flex items-center justify-center font-black text-[15px] shadow-lg shadow-[#1a2420]/10 group-hover:scale-110 transition-transform overflow-hidden">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-[15px] tracking-tight group-hover:text-sage transition-colors">{u.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <Mail size={10} className="text-gray-300" />
                           <span className="text-[11px] text-gray-400 font-medium">{u.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {getRoleBadge(u.role)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold uppercase tracking-tighter">
                       <Calendar size={12} className="text-gray-300" />
                       {formatDate(u.createdAt)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="relative group/select">
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-white border border-gray-100 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer appearance-none pr-8"
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff Member</option>
                          <option value="admin">Administrator</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={12} />
                      </div>
                      
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                 {users.slice(0, 5).map((u, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center overflow-hidden">
                       {u.avatar ? (
                         <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-[10px] font-black text-sage uppercase">{u.name.charAt(0)}</span>
                       )}
                    </div>
                 ))}
                 {users.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-[#1a2420] text-white flex items-center justify-center text-[9px] font-black border-2 border-white">
                       +{users.length - 5}
                    </div>
                 )}
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active users in directory</span>
           </div>
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">HerbSpa Identity Services v3.0</p>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
