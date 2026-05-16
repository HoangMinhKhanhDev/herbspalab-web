import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, X, ChevronDown, SlidersHorizontal, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import Breadcrumb from '../components/common/Breadcrumb';

import { fetchProducts } from '../api/productApi';
import { fetchCategories } from '../api/categoryApi';

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  rating?: number;
  numReviews?: number;
  thumbnail?: string;
  images: { url: string }[];
  categoryId?: string;
  category?: { name: string };
  description?: string;
  badge?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [activeSkinType, setActiveSkinType] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState(10000000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(10000000);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isSkinOpen, setIsSkinOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const skinTypes = ['Tất cả', 'Da dầu', 'Da khô', 'Da nhạy cảm', 'Da hỗn hợp'];

  useEffect(() => {
    fetchCategories()
      .then(res => {
        const cats = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setCategories(cats);
      })
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (activeCategoryId !== 'all') params.categoryId = activeCategoryId;
    fetchProducts(params)
      .then(res => {
        const data = res.data?.data ?? res.data;
        const items = Array.isArray(data) ? data : [];
        setProducts(items);
        if (items.length > 0) {
          const max = Math.max(...items.map((p: Product) => p.price));
          const roundedMax = Math.ceil(max / 1000000) * 1000000;
          setMaxPriceLimit(Math.max(roundedMax, 10000000));
          setPriceRange(Math.max(max, 10000000));
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      });
  }, [activeCategoryId]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchPrice = p.price <= priceRange;
      const matchSkin = activeSkinType === 'Tất cả' || (p.description && p.description.includes(activeSkinType));
      return matchPrice && matchSkin;
    });
    switch (sortBy) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'name-asc': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result = [...result].sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'rating': result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    return result;
  }, [priceRange, products, activeSkinType, sortBy]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return (
    <div className="loader-container" style={{ flexDirection: 'column', gap: '1rem', color: 'var(--secondary)' }}>
      <p>{error}</p>
      <button className="btn-outline" onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <SEO
        title="Bộ Sưu Tập Thảo Mộc Cao Cấp | HerbSpa Lab"
        description="Trải nghiệm các dòng sản phẩm chăm sóc da thảo dược thượng hạng."
      />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-3">
          <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Sản phẩm' }]} />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
        <div className="container">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategoryId('all')}
              className={`shrink-0 px-4 py-2 rounded-sm text-[13px] font-medium transition-colors whitespace-nowrap ${activeCategoryId === 'all' ? 'bg-[var(--clr-mint)] text-white' : 'text-gray-600 hover:text-[var(--clr-mint)]'}`}
            >
              Tất cả
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategoryId(c.id)}
                className={`shrink-0 px-4 py-2 rounded-sm text-[13px] font-medium transition-colors whitespace-nowrap ${activeCategoryId === c.id ? 'bg-[var(--clr-mint)] text-white' : 'text-gray-600 hover:text-[var(--clr-mint)]'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort + Filter Row */}
          <div className="flex items-center gap-2 py-2 border-t border-gray-100 flex-wrap">
            <span className="text-[12px] text-gray-400 mr-1 hidden sm:block">Sắp xếp theo:</span>
            {[
              { value: 'default', label: 'Phổ biến' },
              { value: 'rating', label: 'Đánh giá' },
              { value: 'price-asc', label: 'Giá thấp' },
              { value: 'price-desc', label: 'Giá cao' },
              { value: 'name-asc', label: 'A - Z' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1.5 text-[12px] rounded border transition-all ${sortBy === opt.value ? 'border-[var(--clr-mint)] text-[var(--clr-mint)] bg-[var(--clr-mint)]/5' : 'border-gray-200 text-gray-500 hover:border-[var(--clr-mint)] hover:text-[var(--clr-mint)]'}`}
              >
                {opt.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {/* Skin type dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setIsSkinOpen(o => !o); setIsPriceOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-gray-200 rounded text-gray-600 hover:border-[var(--clr-mint)] transition-colors"
                >
                  Loại da: <span className="font-medium text-[var(--clr-mint)]">{activeSkinType}</span>
                  <ChevronDown size={12} />
                </button>
                {isSkinOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded shadow-lg z-40 min-w-[140px]">
                    {skinTypes.map(s => (
                      <button
                        key={s}
                        onClick={() => { setActiveSkinType(s); setIsSkinOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 transition-colors ${activeSkinType === s ? 'text-[var(--clr-mint)] font-medium' : 'text-gray-700'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setIsPriceOpen(o => !o); setIsSkinOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-gray-200 rounded text-gray-600 hover:border-[var(--clr-mint)] transition-colors"
                >
                  Giá <ChevronDown size={12} />
                </button>
                {isPriceOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded shadow-lg z-40 p-4 min-w-[220px]">
                    <p className="text-[12px] text-gray-500 mb-3">Dưới <span className="font-semibold text-[var(--clr-mint)]">{priceRange.toLocaleString()}₫</span></p>
                    <input
                      type="range"
                      min="0"
                      max={maxPriceLimit}
                      step="100000"
                      value={priceRange}
                      onChange={e => setPriceRange(Number(e.target.value))}
                      className="w-full accent-[var(--clr-mint)]"
                    />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>0₫</span>
                      <span>{maxPriceLimit.toLocaleString()}₫</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-gray-200 rounded text-gray-600"
              >
                <SlidersHorizontal size={12} /> Lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-800">Bộ lọc</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}><X size={20} /></button>
                </div>
                <div className="mb-6">
                  <p className="text-[12px] font-semibold text-gray-400 uppercase mb-3">Loại da</p>
                  <div className="flex flex-wrap gap-2">
                    {skinTypes.map(s => (
                      <button key={s} onClick={() => setActiveSkinType(s)}
                        className={`px-3 py-1.5 text-[13px] rounded-full border ${activeSkinType === s ? 'bg-[var(--clr-mint)] text-white border-[var(--clr-mint)]' : 'border-gray-200 text-gray-600'}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-[12px] font-semibold text-gray-400 uppercase mb-3">Mức giá</p>
                  <p className="text-[13px] text-gray-600 mb-2">Dưới {priceRange.toLocaleString()}₫</p>
                  <input type="range" min="0" max={maxPriceLimit} step="100000" value={priceRange}
                    onChange={e => setPriceRange(Number(e.target.value))} className="w-full accent-[var(--clr-mint)]"
                  />
                </div>
                <button onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-[var(--clr-mint)] text-white rounded font-semibold text-[14px]">
                  Xem {filteredProducts.length} sản phẩm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] text-gray-500">
            <span className="font-medium text-gray-800">{filteredProducts.length}</span> sản phẩm
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p, i) => {
              const displayImg = p.thumbnail || p.images?.[0]?.url || '/assets/images/product_placeholder.png';
              const discountPct = p.salePrice && p.price > p.salePrice
                ? Math.round((1 - p.salePrice / p.price) * 100) : null;
              const showPrice = p.salePrice ?? p.price;

              return (
                <motion.div
                  layout key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  className="bg-white rounded shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-square bg-gray-50">
                    <Link to={`/product/${p.id}`} className="block w-full h-full">
                      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                        <LazyImage src={displayImg} alt={p.name} width={300} height={300} />
                      </div>
                    </Link>
                    {discountPct && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{discountPct}%
                      </span>
                    )}
                    {p.badge && !discountPct && (
                      <span className="absolute top-2 left-2 bg-[var(--clr-mint)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {p.badge}
                      </span>
                    )}
                    <button
                      onClick={() => isInWishlist(p.id)
                        ? removeFromWishlist(p.id)
                        : addToWishlist({ id: p.id, name: p.name, price: showPrice, image: displayImg, category: p.category?.name })}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    >
                      <Heart size={13} fill={isInWishlist(p.id) ? '#ef4444' : 'none'} stroke={isInWishlist(p.id) ? '#ef4444' : '#555'} />
                    </button>
                    {/* Add to cart - Shopee style bottom overlay */}
                    <button
                      onClick={() => addToCart({ id: p.id, name: p.name, price: showPrice, image: displayImg })}
                      className="absolute bottom-0 left-0 right-0 py-2 bg-[var(--clr-mint)]/90 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                    >
                      <ShoppingBag size={13} /> Thêm vào giỏ
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <Link to={`/product/${p.id}`}>
                      <p className="text-[13px] text-gray-700 leading-[1.4] line-clamp-2 mb-1.5 hover:text-[var(--clr-mint)] transition-colors min-h-[36px]">
                        {p.name}
                      </p>
                    </Link>
                    <div className="flex items-center gap-1 mb-1.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={10} fill={idx < Math.round(p.rating || 0) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                      ))}
                      {p.numReviews ? <span className="text-[11px] text-gray-400 ml-0.5">({p.numReviews})</span> : null}
                    </div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-[14px] font-bold text-[#e53935]">{showPrice.toLocaleString()}₫</span>
                      {p.salePrice && p.price > p.salePrice && (
                        <span className="text-[11px] text-gray-400 line-through">{p.price.toLocaleString()}₫</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-400 text-[14px] mb-6">Thử thay đổi bộ lọc hoặc danh mục khác.</p>
            <button
              onClick={() => { setActiveCategoryId('all'); setActiveSkinType('Tất cả'); setPriceRange(maxPriceLimit); }}
              className="px-6 py-2.5 border border-[var(--clr-mint)] text-[var(--clr-mint)] rounded text-[14px] font-medium hover:bg-[var(--clr-mint)] hover:text-white transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
