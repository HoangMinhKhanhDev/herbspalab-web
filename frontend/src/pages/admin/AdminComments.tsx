import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Trash2, MessageSquare, 
  Search, Filter, ExternalLink, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetchComments, adminUpdateCommentStatus, adminDeleteComment } from '../../api/adminApi';
import { formatDate } from '../../utils/format';

const AdminComments: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchComments = async () => {
    try {
      const data = await adminFetchComments();
      setComments(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminUpdateCommentStatus(id, status);
      toast.success(status === 'APPROVED' ? 'Đã duyệt bình luận' : 'Đã từ chối bình luận');
      fetchComments();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      await adminDeleteComment(id);
      toast.success('Đã xóa bình luận');
      fetchComments();
    } catch (error) {
      toast.error('Lỗi khi xóa bình luận');
    }
  };

  const filteredComments = comments.filter(c => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center gap-6 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Quản lý Bình luận</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Phê duyệt hoặc gỡ bỏ các bình luận trên hệ thống HerbSpaLab.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo tên người gửi hoặc nội dung..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-sage focus:ring-1 focus:ring-sage outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:border-sage focus:ring-1 focus:ring-sage outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Nội dung & Bài viết</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
                  </td>
                </tr>
              ) : filteredComments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 text-sm italic">
                    Không tìm thấy bình luận nào
                  </td>
                </tr>
              ) : filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm">{comment.name}</div>
                    <div className="text-xs text-gray-500">{comment.email || 'Không có email'}</div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">{comment.content}</p>
                    <div className="flex items-center gap-1 text-[10px] text-sage font-bold uppercase tracking-wider">
                      <ExternalLink size={10} />
                      {comment.blog?.title || 'Bài viết không xác định'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={12} />
                      {formatDate(comment.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      comment.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      comment.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {comment.status === 'APPROVED' ? 'Đã duyệt' : 
                       comment.status === 'REJECTED' ? 'Đã từ chối' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {comment.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Duyệt"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Từ chối"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {comment.status === 'REJECTED' && (
                        <button 
                          onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Duyệt lại"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {comment.status === 'APPROVED' && (
                        <button 
                          onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Gỡ bỏ"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

export default AdminComments;
