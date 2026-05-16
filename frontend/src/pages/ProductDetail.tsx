import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Heart, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/common/SEO';
import { fetchProductById } from '../api/productApi';
import { fetchReviews, createReview } from '../api/reviewApi';
import toast from 'react-hot-toast';

interface ProductImage { url: string; }

interface ProductVariantOption {
  attributeValue: { value: string; attribute: { name: string } };
}

interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  options: ProductVariantOption[];
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductDetailData {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: ProductImage[];
  thumbnail?: string | null;
  category?: { name: string; slug: string } | null;
  description: string;
  shortDescription?: string | null;
  stock: number;
  badge?: string | null;
  rating: number;
  numReviews: number;
  variants: ProductVariant[];
  reviews: Review[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  isPreorder?: boolean;
  videoUrl?: string | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    fetchProductById(id)
      .then(res => {
        const data = res.data;
        // Merge thumbnail into images for the gallery if it exists
        if (data.thumbnail && !data.images.some((img: any) => img.url === data.thumbnail)) {
          data.images = [{ url: data.thumbnail }, ...data.images];
        }
        setProduct(data);
        if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Load reviews from API
  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    fetchReviews(id)
      .then(res => {
        const reviewsData = res.data?.data ?? res.data;
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setReviewsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load reviews', err);
        setReviewsLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const displayPrice = selectedVariant?.price ?? product.salePrice ?? product.price;
    addToCart({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: product.thumbnail || product.images?.[0]?.url || '',
      category: product.category?.name,
    }, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.salePrice ?? product.price,
        image: product.thumbnail || product.images?.[0]?.url || '',
        category: product.category?.name,
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !id) return;
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    setSubmittingReview(true);
    try {
      await createReview(id, { rating: reviewForm.rating, comment: reviewForm.comment });
      toast.success('Đánh giá của bạn đã được gửi thành công!');
      setReviewForm({ rating: 5, comment: '' });
      // Reload reviews
      const res = await fetchReviews(id);
      const reviewsData = res.data?.data ?? res.data;
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const displayPrice = selectedVariant?.price ?? product?.salePrice ?? product?.price;
  const originalPrice = product?.price;

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  if (error || !product) return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="text-center bg-white p-12 rounded-lg shadow-sm max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-400 mb-6 text-[14px]">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        <button onClick={() => navigate('/products')} className="flex items-center gap-2 mx-auto px-6 py-3 bg-[var(--clr-mint)] text-white rounded font-medium text-[14px] hover:opacity-90 transition-opacity">
          <ArrowLeft size={16} /> Quay lại cửa hàng
        </button>
      </div>
    </div>
  );

  const discountPct = product.salePrice && product.price > product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100) : null;
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : product.rating || 0;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <SEO
        title={product.metaTitle || `${product.name} | HerbSpa Lab`}
        description={product.metaDescription || product.shortDescription || product.description?.substring(0, 160)}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-[13px] text-gray-500">
            <Link to="/" className="hover:text-[var(--clr-mint)]">Trang chủ</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[var(--clr-mint)]">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr] gap-0">

            {/* Vertical Thumbnails */}
            {product.images?.length > 1 && (
              <div className="hidden lg:flex flex-col gap-2 p-4 border-r border-gray-100 w-[80px]">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-[64px] h-[64px] rounded overflow-hidden border-2 transition-all flex-shrink-0 ${activeImg === i ? 'border-[var(--clr-mint)]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative bg-gray-50 aspect-square lg:aspect-auto lg:min-h-[500px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images?.[activeImg]?.url || product.thumbnail || 'https://via.placeholder.com/600x600'}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {discountPct && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[12px] font-bold px-2 py-1 rounded">
                  -{discountPct}%
                </span>
              )}
              {product.badge && !discountPct && (
                <span className="absolute top-3 left-3 bg-[var(--clr-mint)] text-white text-[12px] font-bold px-2 py-1 rounded">
                  {product.badge}
                </span>
              )}
              {product.images?.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => Math.max(0, i - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setActiveImg(i => Math.min(product.images.length - 1, i + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              {/* Mobile thumbnails */}
              {product.images?.length > 1 && (
                <div className="lg:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-2 h-2 rounded-full transition-all ${activeImg === i ? 'bg-[var(--clr-mint)] w-5' : 'bg-white/60'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col gap-4 border-l border-gray-100">
              {product.category && (
                <span className="text-[12px] text-gray-500 uppercase tracking-widest">{product.category.name}</span>
              )}

              <h1 className="text-[20px] font-semibold text-gray-800 leading-snug">{product.name}</h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <span className="text-[var(--clr-gold)] font-bold text-[15px] underline">{avgRating.toFixed(1)}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill={i < Math.round(avgRating) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                    ))}
                  </div>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-[13px] text-gray-500 underline">{reviews.length} đánh giá</span>
                {product.stock <= 5 && product.stock > 0 && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="text-[13px] text-red-500 font-medium">Còn {product.stock} sản phẩm</span>
                  </>
                )}
                {product.stock === 0 && !product.isPreorder && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="text-[13px] text-red-500 font-medium">Hết hàng</span>
                  </>
                )}
              </div>

              {/* Price block */}
              <div className="bg-gray-50 -mx-6 px-6 py-4 flex items-baseline gap-3 flex-wrap">
                <span className="text-[28px] font-semibold text-[#e53935]">{displayPrice?.toLocaleString()}₫</span>
                {product.salePrice && originalPrice && originalPrice > (displayPrice ?? 0) && (
                  <>
                    <span className="text-[16px] text-gray-400 line-through">{originalPrice.toLocaleString()}₫</span>
                    {discountPct && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[11px] font-bold rounded">-{discountPct}%</span>
                    )}
                  </>
                )}
              </div>

              {/* Voucher/Promo */}
              <div className="flex items-start gap-3">
                <span className="text-[13px] text-gray-500 shrink-0 pt-0.5">Ưu đãi</span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] border border-[var(--clr-mint)] text-[var(--clr-mint)] px-2 py-0.5 rounded">Freeship</span>
                  <span className="text-[11px] border border-[var(--clr-mint)] text-[var(--clr-mint)] px-2 py-0.5 rounded">Chính hãng 100%</span>
                  <span className="text-[11px] border border-[var(--clr-mint)] text-[var(--clr-mint)] px-2 py-0.5 rounded">Đổi trả 7 ngày</span>
                </div>
              </div>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="flex items-start gap-3">
                  <span className="text-[13px] text-gray-500 shrink-0 pt-1">Phân loại</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        disabled={v.stock === 0}
                        className={`px-3 py-1.5 text-[13px] rounded border transition-all ${selectedVariant?.id === v.id ? 'border-[var(--clr-mint)] text-[var(--clr-mint)] bg-[var(--clr-mint)]/5' : 'border-gray-200 text-gray-600 hover:border-[var(--clr-mint)]'} disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {v.options.map(o => o.attributeValue.value).join(' / ')}
                        {v.price !== product.price && <span className="ml-1 text-[var(--clr-mint)]">+{(v.price - product.price).toLocaleString()}₫</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-gray-500 shrink-0">Số lượng</span>
                <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-200">
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-[14px] font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-200">
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-[12px] text-gray-400">{product.stock} có sẵn</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 && !product.isPreorder}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[var(--clr-mint)] text-[var(--clr-mint)] rounded font-semibold text-[14px] hover:bg-[var(--clr-mint)]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={16} />
                  {addedFeedback ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
                </button>
                <button
                  onClick={() => { handleAddToCart(); navigate('/cart'); }}
                  disabled={product.stock === 0 && !product.isPreorder}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--clr-mint)] text-white rounded font-semibold text-[14px] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {product.isPreorder ? 'Đặt trước ngay' : 'Mua ngay'}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded hover:border-red-300 transition-colors shrink-0"
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? '#ef4444' : 'none'} stroke={isInWishlist(product.id) ? '#ef4444' : '#888'} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                {[
                  { Icon: ShieldCheck, text: 'Cam kết 100% thảo mộc tự nhiên, không hóa chất' },
                  { Icon: Truck, text: 'Giao hàng nhanh toàn quốc (2-4 ngày làm việc)' },
                  { Icon: RefreshCw, text: 'Đổi trả trong vòng 7 ngày nếu lỗi sản phẩm' },
                ].map(({ Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13px] text-gray-500">
                    <Icon size={15} className="text-[var(--clr-mint)] shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video */}
        {product.videoUrl && (
          <div className="bg-white rounded-lg shadow-sm mt-3 p-6">
            <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Video Sản phẩm</h2>
            <div className="max-w-3xl mx-auto rounded-lg overflow-hidden bg-black aspect-video">
              {product.videoUrl.startsWith('/uploads/') ? (
                <video src={product.videoUrl} controls className="w-full h-full" />
              ) : (
                <iframe width="100%" height="100%"
                  src={product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be')
                    ? product.videoUrl.replace('watch?v=', 'embed/').split('&')[0] : product.videoUrl}
                  title="Product Video" frameBorder="0" allowFullScreen
                />
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm mt-3">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-800 uppercase tracking-wide">Mô tả sản phẩm</h2>
          </div>
          <div className="p-6 prose prose-sm max-w-none text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description || '<p>Chưa có mô tả sản phẩm.</p>' }}
          />
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-sm mt-3">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-800 uppercase tracking-wide">Đánh giá sản phẩm</h2>
          </div>
          <div className="p-6">
            {/* Rating Overview */}
            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-100">
              <div className="text-center shrink-0">
                <div className="text-[48px] font-bold text-[#e53935] leading-none">{avgRating.toFixed(1)}</div>
                <div className="flex justify-center gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(avgRating) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                  ))}
                </div>
                <div className="text-[12px] text-gray-400 mt-1">trên 5</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500 shrink-0 w-4">{star}</span>
                      <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#f59e0b] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[12px] text-gray-400 shrink-0 w-6">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="text-center py-8 text-gray-400">Đang tải đánh giá...</div>
            ) : reviews.length > 0 ? (
              <div className="flex flex-col gap-6">
                {reviews.map(review => (
                  <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-9 h-9 rounded-full bg-[var(--clr-mint)]/10 flex items-center justify-center text-[var(--clr-mint)] font-bold text-[14px] shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800 text-[14px]">{review.name}</span>
                        <span className="text-gray-300 text-[12px]">|</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} fill={i < review.rating ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-[14px] leading-relaxed">{review.comment}</p>
                      <p className="text-gray-400 text-[12px] mt-1">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <Star size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-[14px]">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
              </div>
            )}

            {/* Review Form */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-[14px] font-semibold text-gray-700 mb-5">Viết đánh giá của bạn</h3>
              {!isAuthenticated ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500 text-[14px] mb-4">Vui lòng đăng nhập để đánh giá sản phẩm</p>
                  <Link to="/login" className="inline-block px-6 py-2.5 bg-[var(--clr-mint)] text-white rounded font-medium text-[14px] hover:opacity-90 transition-opacity">
                    Đăng nhập ngay
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="max-w-xl">
                  <div className="mb-5">
                    <label className="block text-[13px] text-gray-600 mb-2">Đánh giá của bạn</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button key={rating} type="button" onClick={() => setReviewForm({ ...reviewForm, rating })} className="p-1 hover:scale-110 transition-transform">
                          <Star size={28} fill={rating <= reviewForm.rating ? '#f59e0b' : 'none'} stroke={rating <= reviewForm.rating ? '#f59e0b' : '#ccc'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-[13px] text-gray-600 mb-2">Nhận xét</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      required rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded text-[14px] focus:border-[var(--clr-mint)] outline-none resize-none"
                    />
                  </div>
                  <button type="submit" disabled={submittingReview}
                    className="px-8 py-3 bg-[var(--clr-mint)] text-white rounded font-semibold text-[14px] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-4 pb-6">
          <Link to="/products" className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-[var(--clr-mint)] transition-colors w-fit">
            <ArrowLeft size={14} /> Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
