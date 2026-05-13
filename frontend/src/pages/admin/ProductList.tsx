import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Download, Filter, Tag, Calendar, PackageCheck } from 'lucide-react';
import { fetchProducts, deleteProduct } from '../../api/productApi';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetchProducts({ limit: 100 });
      // Robust data extraction
      const data = response?.data || (Array.isArray(response) ? response : []);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      toast.success('Xóa sản phẩm thành công');
      loadProducts();
    } catch (error) {
      toast.error('Lỗi khi xóa sản phẩm');
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  if (loading) return <div className="p-10 text-center font-display italic text-sage/40">Đang truy xuất kho hàng...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <PackageCheck className="w-4 h-4" />
            Inventory Management
          </div>
          <h1 className="text-4xl font-display font-bold text-sage">Quản lý Sản phẩm</h1>
          <p className="text-sage/60 text-lg italic mt-1">Quản lý danh mục sản phẩm thảo mộc cao cấp của bạn.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 border border-sage/10 rounded-2xl flex items-center gap-2 font-bold text-sage/60 hover:bg-white hover:text-sage hover:border-sage/20 transition-all shadow-sm">
            <Download className="w-5 h-5" />
            Export
          </button>
          <Link to="/admin/products/new" className="px-8 py-3.5 bg-sage text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-sage-dark shadow-xl shadow-sage/20 transition-all transform hover:-translate-y-1">
            <Plus className="w-5 h-5 text-gold" />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Luxury Filter Bar */}
      <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-sage/5 shadow-soft flex gap-6 items-center">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sage/30 group-focus-within:text-gold transition-colors" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-4 rounded-2xl bg-white border border-sage/5 focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none font-medium transition-all shadow-inner text-sage placeholder:text-sage/20" 
            placeholder="Tìm kiếm theo tên sản phẩm hoặc mã SKU..." 
          />
        </div>
        <button className="px-8 py-4 bg-sage/5 text-sage rounded-2xl hover:bg-sage/10 transition-all flex items-center gap-3 font-bold border border-sage/5">
          <Filter className="w-5 h-5 text-gold" />
          Lọc nâng cao
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-premium border border-sage/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sage/5 text-sage/40 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-10 py-6 font-black">Sản phẩm</th>
                <th className="px-10 py-6 font-black">Phân loại</th>
                <th className="px-10 py-6 font-black text-center">Giá trị</th>
                <th className="px-10 py-6 font-black text-center">Kho hàng</th>
                <th className="px-10 py-6 font-black text-right">Quản lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/5">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-sage/[0.01] transition-colors group/row">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={p.images?.[0]?.url || '/placeholder.png'} className="w-20 h-20 rounded-[1.5rem] object-cover bg-cream border border-sage/5 shadow-soft group-hover/row:scale-105 transition-transform duration-500" alt={p.name} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-sage-dark rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                          {p.badge || '★'}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sage text-xl group-hover/row:text-gold transition-colors">{p.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-sage/30 uppercase tracking-widest">{p.sku || 'NO-SKU'}</span>
                          <div className="w-1 h-1 bg-gold rounded-full" />
                          <div className="flex items-center gap-1 text-[10px] font-bold text-sage/40">
                            <Calendar className="w-3 h-3" />
                            Cập nhật 2 giờ trước
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="bg-sage/5 text-sage text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-[0.1em] border border-sage/10 inline-flex items-center gap-2">
                      <Tag className="w-3 h-3 text-gold" />
                      {p.category?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center font-display font-bold text-sage text-lg">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-sm font-black tracking-tighter ${p.stock < 10 ? 'text-red-500' : 'text-sage'}`}>
                        {p.stock}
                      </span>
                      <div className={`w-12 h-1 mt-1 rounded-full ${p.stock < 10 ? 'bg-red-200' : 'bg-sage/10'}`}>
                        <div 
                          className={`h-full rounded-full ${p.stock < 10 ? 'bg-red-500' : 'bg-sage'}`} 
                          style={{ width: `${Math.min(100, (p.stock/50)*100)}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                      <Link to={`/admin/products/${p.id}`} className="w-10 h-10 bg-sage/5 text-sage rounded-xl flex items-center justify-center hover:bg-sage hover:text-white transition-all shadow-sm border border-sage/5">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100">
                        <Trash2 className="w-5 h-5" />
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

export default ProductList;
