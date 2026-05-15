import React, { useEffect, useState, useRef } from 'react';
import { Search, Edit, Trash2, Download, Upload, ChevronLeft, ChevronRight, Copy, Plus } from 'lucide-react';
import { fetchProducts, deleteProduct, exportProductsCSV, importProductsCSV, duplicateProduct, bulkUpdateProducts } from '../../api/productApi';
import { getCategories } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

  const quickUpdate = async (id: string, updates: any) => {
    try {
      await bulkUpdateProducts([{ id, ...updates }]);
      toast.success('Đã cập nhật');
      loadProducts();
    } catch (error) {
      toast.error('Lỗi cập nhật nhanh');
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-sm text-gray-500">Xem và quản lý kho hàng mỹ phẩm của bạn</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Xuất CSV">
            <Download size={20} />
          </button>
          <button onClick={() => importRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Nhập CSV">
            <Upload size={20} />
          </button>
          <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
          <button 
            onClick={() => navigate('/admin/products/new')} 
            className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors font-bold text-sm"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedCategory} 
            onChange={e => { setSelectedCategory(e.target.value); setPage(1); }} 
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:border-sage outline-none"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            value={stockFilter} 
            onChange={e => { setStockFilter(e.target.value); setPage(1); }} 
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:border-sage outline-none"
          >
            <option value="">Tất cả trạng thái kho</option>
            <option value="low">Sắp hết hàng</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-sage outline-none"
            placeholder="Tìm theo tên hoặc SKU..."
          />
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Kho</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 text-sm">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || '/placeholder.png'} className="w-10 h-10 rounded border border-gray-100 object-cover" alt="" />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.category?.name || 'Mỹ phẩm'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">{p.sku || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      defaultValue={p.price}
                      onBlur={(e) => quickUpdate(p.id, { price: e.target.value })}
                      className="w-24 text-sm font-bold text-gray-700 bg-transparent hover:bg-gray-50 border-none focus:ring-1 focus:ring-sage rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => quickUpdate(p.id, { stock: e.target.value })}
                      className="w-16 text-sm text-gray-600 bg-transparent hover:bg-gray-50 border-none focus:ring-1 focus:ring-sage rounded px-2 py-1 text-center"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleDuplicate(p.id)} className="p-2 text-gray-400 hover:text-sage hover:bg-gray-100 rounded-lg transition-colors" title="Nhân bản">
                        <Copy size={16} />
                      </button>
                      <button onClick={() => navigate(`/admin/products/${p.id}`)} className="p-2 text-gray-400 hover:text-sage hover:bg-gray-100 rounded-lg transition-colors" title="Sửa">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Container */}
        {totalPages > 1 && !loading && products.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">Trang {page} / {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-900 disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-900 disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
