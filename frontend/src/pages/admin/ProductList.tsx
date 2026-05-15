import React, { useEffect, useState, useRef } from 'react';
import { Search, Edit, Trash2, Download, Upload, ChevronLeft, ChevronRight, Copy, Plus, Filter, MoreVertical, ExternalLink, Database } from 'lucide-react';
import { fetchProducts, deleteProduct, exportProductsCSV, importProductsCSV, duplicateProduct } from '../../api/productApi';
import { getCategories } from '../../api/adminApi';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/format';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  
  const importRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [page, selectedCategory, stockFilter]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 20, page };
      if (selectedCategory) params.categoryId = selectedCategory;
      if (search) params.search = search;
      const response = await fetchProducts(params);
      const resData = response?.data;
      const data = resData?.data || (Array.isArray(resData) ? resData : []);
      let filtered = Array.isArray(data) ? data : [];
      if (stockFilter === 'low') filtered = filtered.filter((p: any) => p.stock < 10);
      else if (stockFilter === 'out') filtered = filtered.filter((p: any) => p.stock === 0);
      setProducts(filtered);
      setTotalPages(resData?.pages || 1);
    } catch (error: any) {
      toast.error('Lỗi khi tải sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      toast.success('Xóa sản phẩm thành công');
      loadProducts();
    } catch (error: any) {
      toast.error('Lỗi khi xóa');
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!window.confirm('Nhân bản sản phẩm này?')) return;
    try {
      await duplicateProduct(id);
      toast.success('Nhân bản thành công');
      loadProducts();
    } catch (error: any) {
      toast.error('Lỗi khi nhân bản');
    }
  };


  const handleExportCSV = async () => {
    try {
      const response = await exportProductsCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Xuất CSV thành công');
    } catch (error: any) {
      toast.error('Lỗi khi xuất CSV');
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { data } = await importProductsCSV(file);
      toast.success(`Nhập thành công ${data.imported} sản phẩm`);
      loadProducts();
    } catch (error: any) {
      toast.error('Lỗi khi nhập CSV');
    }
    if (importRef.current) importRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1a2420] tracking-tight">Quản lý Sản phẩm</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Hệ thống có tổng cộng {products.length} sản phẩm đang được niêm yết.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            <button onClick={handleExportCSV} className="p-2 text-gray-500 hover:text-sage hover:bg-sage/5 rounded-lg transition-all" title="Xuất CSV">
              <Download size={18} />
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <button onClick={() => importRef.current?.click()} className="p-2 text-gray-500 hover:text-sage hover:bg-sage/5 rounded-lg transition-all" title="Nhập CSV">
              <Upload size={18} />
            </button>
          </div>
          <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
          <button 
            onClick={() => navigate('/admin/products/new')} 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2420] text-white rounded-xl hover:bg-[#2c3b2e] transition-all font-bold text-xs shadow-lg shadow-[#1a2420]/10"
          >
            <Plus size={16} strokeWidth={3} />
            Tạo sản phẩm mới
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-2">
        <form onSubmit={handleSearch} className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sage w-4 h-4 transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border-none rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all placeholder:text-gray-400"
            placeholder="Tìm kiếm sản phẩm theo tên, SKU hoặc ID..."
          />
        </form>
        
        <div className="flex items-center gap-2 p-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <Filter size={14} className="text-gray-400" />
            <select 
              value={selectedCategory} 
              onChange={e => { setSelectedCategory(e.target.value); setPage(1); }} 
              className="bg-transparent border-none text-[13px] font-bold text-gray-600 outline-none min-w-[140px] appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <Database size={14} className="text-gray-400" />
            <select 
              value={stockFilter} 
              onChange={e => { setStockFilter(e.target.value); setPage(1); }} 
              className="bg-transparent border-none text-[13px] font-bold text-gray-600 outline-none min-w-[140px] appearance-none cursor-pointer"
            >
              <option value="">Trạng thái kho</option>
              <option value="low">Sắp hết hàng</option>
              <option value="out">Hết hàng</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                <th className="px-7 py-5">Thông tin sản phẩm</th>
                <th className="px-7 py-5">SKU Hệ thống</th>
                <th className="px-7 py-5">Giá bán niêm yết</th>
                <th className="px-7 py-5 text-center">Tồn kho</th>
                <th className="px-7 py-5">Trạng thái</th>
                <th className="px-7 py-5 text-right">Quản lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="w-12 h-12 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Đang truy xuất dữ liệu...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Search size={32} className="text-gray-200" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">Không tìm thấy sản phẩm nào phù hợp</p>
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id} className="group hover:bg-[#f8f9f8] transition-all">
                  <td className="px-7 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0 group-hover:scale-105 transition-transform">
                        <img src={p.thumbnail || p.images?.[0]?.url || '/placeholder.png'} className="w-12 h-12 rounded-xl border border-gray-100 object-cover shadow-sm bg-gray-50" alt="" />
                        {p.isNew && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" title="Sản phẩm mới"></span>}
                      </div>
                      <div className="min-w-0">
                        <Link to={`/products/${p.id}`} target="_blank" className="font-bold text-gray-900 text-[14px] hover:text-sage transition-colors truncate block max-w-[240px] flex items-center gap-1.5">
                          {p.name}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="text-[10px] font-black text-gray-400 uppercase mt-0.5 tracking-wider">{p.category?.name || 'Chưa phân loại'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 py-4 text-[11px] text-gray-500 font-black font-mono tracking-tighter uppercase">{p.sku || '---'}</td>
                  <td className="px-7 py-4">
                    <div className="flex flex-col">
                       <span className="text-[14px] font-black text-[#1a2420] tracking-tight">{formatPrice(p.price)}</span>
                       {p.salePrice && <span className="text-[10px] text-red-500 font-bold line-through opacity-50">{formatPrice(p.salePrice)}</span>}
                    </div>
                  </td>
                  <td className="px-7 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-xs border-2 ${
                      p.stock === 0 ? 'bg-red-50 text-red-600 border-red-100' : 
                      p.stock < 10 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-green-50 text-sage border-green-100'
                    }`}>
                      {p.stock}
                    </div>
                  </td>
                  <td className="px-7 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${p.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {p.stock > 0 ? 'Sẵn sàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="px-7 py-4 text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDuplicate(p.id)} className="p-2.5 text-gray-400 hover:text-sage hover:bg-sage/5 rounded-xl transition-all" title="Nhân bản">
                        <Copy size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => navigate(`/admin/products/${p.id}`)} className="p-2.5 text-gray-400 hover:text-sage hover:bg-sage/5 rounded-xl transition-all" title="Chỉnh sửa">
                        <Edit size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa bỏ">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="group-hover:hidden flex justify-end">
                       <MoreVertical size={16} className="text-gray-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Professional Pagination */}
        {totalPages > 1 && !loading && products.length > 0 && (
          <div className="flex items-center justify-between px-7 py-5 border-t border-gray-50 bg-gray-50/30">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Hiển thị trang <span className="text-gray-900">{page}</span> trên tổng số <span className="text-gray-900">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))} 
                disabled={page === 1} 
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-black text-gray-600 hover:border-sage hover:text-sage disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all shadow-sm"
              >
                <ChevronLeft size={14} /> Trước
              </button>
              <div className="flex gap-1">
                 {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                   const pNum = i + 1;
                   return (
                     <button 
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${page === pNum ? 'bg-sage text-white shadow-lg shadow-sage/20' : 'bg-white text-gray-400 border border-gray-200 hover:border-sage'}`}
                     >
                       {pNum}
                     </button>
                   );
                 })}
              </div>
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))} 
                disabled={page === totalPages} 
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-black text-gray-600 hover:border-sage hover:text-sage disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all shadow-sm"
              >
                Sau <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
