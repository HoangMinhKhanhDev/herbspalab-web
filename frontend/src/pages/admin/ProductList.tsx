import React, { useEffect, useState, useRef } from 'react';
import { Search, Edit, Trash2, Download, Upload, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { fetchProducts, deleteProduct, exportProductsCSV, importProductsCSV, duplicateProduct, bulkUpdateProducts } from '../../api/productApi';
import { getCategories } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminLoadingSkeleton from '../../components/admin/AdminLoadingSkeleton';
import { PackageSearch } from 'lucide-react';

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

  const navigate = useNavigate();

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
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
             <PackageSearch className="w-3.5 h-3.5" /> Inventory Management
          </div>
          <h1 className="text-5xl font-display italic text-sage tracking-tight">Sản phẩm</h1>
        </div>

        <div className="flex items-center gap-6 pb-1">
          <div className="flex items-center gap-4 border-r border-black/10 pr-6">
            <button onClick={handleExportCSV} className="flex items-center gap-2 text-[10px] font-bold text-sage/40 uppercase tracking-widest hover:text-sage transition-all group">
              <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Xuất CSV
            </button>
            <button onClick={() => importRef.current?.click()} className="flex items-center gap-2 text-[10px] font-bold text-sage/40 uppercase tracking-widest hover:text-sage transition-all group">
              <Upload className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Nhập CSV
            </button>
            <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
          </div>
          
          <button 
            onClick={() => navigate('/admin/products/new')} 
            className="px-10 py-4 bg-ink text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mint transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            + THÊM SẢN PHẨM
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex items-center gap-4 bg-white/30 backdrop-blur-sm p-2 rounded-2xl">
        <select 
          value={selectedCategory} 
          onChange={e => { setSelectedCategory(e.target.value); setPage(1); }} 
          className="px-6 py-3 rounded-xl bg-white border border-black/5 text-xs font-bold text-sage outline-none focus:border-mint transition-all cursor-pointer shadow-sm min-w-[200px]"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select 
          value={stockFilter} 
          onChange={e => { setStockFilter(e.target.value); setPage(1); }} 
          className="px-6 py-3 rounded-xl bg-white border border-black/5 text-xs font-bold text-sage outline-none focus:border-mint transition-all cursor-pointer shadow-sm min-w-[150px]"
        >
          <option value="">Tất cả</option>
          <option value="low">Sắp hết</option>
          <option value="out">Hết hàng</option>
        </select>
        <form onSubmit={handleSearch} className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/10 w-4 h-4 group-focus-within:text-mint transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-6 py-3 rounded-xl bg-white border border-black/5 focus:border-mint outline-none text-xs font-medium text-sage placeholder:text-sage/10 transition-all shadow-sm"
            placeholder="Tìm tên, SKU..."
          />
        </form>
      </div>

      {/* Table Container */}
      {loading ? (
        <AdminLoadingSkeleton type="table" count={10} />
      ) : products.length === 0 ? (
        <AdminEmptyState
          icon={PackageSearch}
          title="Không tìm thấy sản phẩm"
          description="Thử thay đổi bộ lọc hoặc thêm sản phẩm mới vào hệ thống."
          actionLabel="+ THÊM MỚI"
          onAction={() => navigate('/admin/products/new')}
        />
      ) : (
        <div className="bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-gold text-[9px] font-bold uppercase tracking-[0.3em] border-b border-black/5">
                  <th className="px-8 py-6 text-left w-12">
                     <input type="checkbox" className="w-4 h-4 rounded-md accent-mint cursor-pointer" />
                  </th>
                  <th className="px-8 py-6 text-left">ẢNH</th>
                  <th className="px-8 py-6 text-left">SẢN PHẨM</th>
                  <th className="px-8 py-6 text-left">SKU</th>
                  <th className="px-8 py-6 text-center">GIÁ</th>
                  <th className="px-8 py-6 text-center">KHO</th>
                  <th className="px-8 py-6 text-center">TRẠNG THÁI</th>
                  <th className="px-8 py-6 text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {products.map((p) => (
                  <tr key={p.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <input type="checkbox" className="w-4 h-4 rounded-md accent-mint cursor-pointer" />
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-12 h-12 rounded-lg bg-white border border-black/5 overflow-hidden shadow-sm">
                        <img src={p.images?.[0]?.url || '/placeholder.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <h4 className="font-bold text-sage text-sm tracking-tight">{p.name}</h4>
                      <p className="text-[9px] text-sage/30 uppercase tracking-widest font-bold mt-0.5">{p.category?.name || 'Mỹ phẩm'}</p>
                    </td>
                    <td className="px-8 py-6 text-xs text-sage/20 font-mono font-bold uppercase">{p.sku || 'N/A'}</td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                         <input 
                           type="number"
                           defaultValue={p.price}
                           onBlur={(e) => quickUpdate(p.id, { price: e.target.value })}
                           className="w-24 text-center bg-transparent border border-transparent hover:border-black/10 focus:border-mint focus:bg-white px-2 py-1.5 rounded-lg font-bold text-sage text-xs outline-none transition-all cursor-text hover:bg-gray-50/50"
                         />
                         {p.salePrice && <span className="text-[9px] text-mint font-black mt-0.5">Sale</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <input 
                        type="number"
                        defaultValue={p.stock}
                        onBlur={(e) => quickUpdate(p.id, { stock: e.target.value })}
                        className="w-16 text-center bg-transparent border border-transparent hover:border-black/10 focus:border-mint focus:bg-white px-2 py-1.5 rounded-lg font-bold text-sage text-xs outline-none transition-all cursor-text hover:bg-gray-50/50"
                      />
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {p.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => handleDuplicate(p.id)} className="p-2 text-sage/20 hover:text-gold hover:bg-gold/5 rounded-lg transition-colors" title="Nhân bản"><Copy className="w-4 h-4" /></button>
                        <button onClick={() => navigate(`/admin/products/${p.id}`)} className="p-2 text-sage/20 hover:text-mint hover:bg-mint/5 rounded-lg transition-colors" title="Sửa"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-sage/20 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* Pagination Container */}
        {totalPages > 1 && !loading && products.length > 0 && (
          <div className="flex items-center justify-between px-10 py-6 border-t border-black/5 bg-gray-50/20">
            <span className="text-[10px] font-black text-sage/30 uppercase tracking-[0.2em]">Trang {page} / {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2.5 rounded-xl border border-black/5 bg-white text-sage/30 hover:text-sage disabled:opacity-20 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2.5 rounded-xl border border-black/5 bg-white text-sage/30 hover:text-sage disabled:opacity-20 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductList;
