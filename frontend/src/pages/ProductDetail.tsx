import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Heart, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/common/SEO';
import { fetchProductById } from '../api/productApi';

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
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

  const displayPrice = selectedVariant?.price ?? product?.salePrice ?? product?.price;
  const originalPrice = product?.price;

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  
  if (error || !product) return (
    <div className="container section" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Không tìm thấy sản phẩm</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>
        <ArrowLeft size={18} /> Quay lại cửa hàng
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page container section"
    >
      <SEO
        title={product.metaTitle || `${product.name} | HerbSpa Lab`}
        description={product.metaDescription || product.shortDescription || product.description?.substring(0, 160)}
      />

      <Link to="/products" className="btn-link" style={{ color: 'var(--primary)', marginBottom: '40px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={20} /> Quay lại cửa hàng
      </Link>

      <div className="product-detail-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '2rem' }}>
        {/* Image Gallery */}
        <div>
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', aspectRatio: '3/4', background: '#f5f0e8' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={product.images?.[activeImg]?.url || 'https://via.placeholder.com/600x800'}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AnimatePresence>
            {product.images?.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => Math.max(0, i - 1))} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setActiveImg(i => Math.min(product.images.length - 1, i + 1))} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            {product.badge && (
              <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--secondary)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                {product.badge}
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden', border: activeImg === i ? '2px solid var(--secondary)' : '2px solid transparent', padding: 0, cursor: 'pointer' }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {product.category && (
            <Link to={`/products?category=${product.category.slug}`} className="detail-category" style={{ color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 600, textDecoration: 'none' }}>
              {product.category.name}
            </Link>
          )}

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--primary)' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.rating) ? 'var(--secondary)' : 'none'} color="var(--secondary)" />
              ))}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.numReviews} đánh giá)</span>
            {product.stock <= 5 && product.stock > 0 && (
              <span style={{ color: '#e53e3e', fontSize: '0.85rem', fontWeight: 600 }}>Chỉ còn {product.stock} sản phẩm!</span>
            )}
            {product.stock === 0 && !product.isPreorder && (
              <span style={{ color: '#e53e3e', fontSize: '0.85rem', fontWeight: 600 }}>Hết hàng</span>
            )}
            {product.isPreorder && (
              <span style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Đặt trước</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{displayPrice?.toLocaleString()}₫</span>
            {product.salePrice && originalPrice && originalPrice > (displayPrice ?? 0) && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{originalPrice.toLocaleString()}₫</span>
            )}
          </div>

          {product.shortDescription && (
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{product.shortDescription}</p>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Lựa chọn:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: `2px solid ${selectedVariant?.id === v.id ? 'var(--secondary)' : 'rgba(0,0,0,0.15)'}`,
                      background: selectedVariant?.id === v.id ? 'rgba(188,163,127,0.1)' : 'transparent',
                      cursor: v.stock > 0 ? 'pointer' : 'not-allowed',
                      opacity: v.stock > 0 ? 1 : 0.4,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    {v.options.map(o => o.attributeValue.value).join(' / ')}
                    {v.price !== product.price && ` (${v.price.toLocaleString()}₫)`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Minus size={16} />
              </button>
              <span style={{ padding: '0 1.25rem', fontWeight: 600, minWidth: '2rem', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Plus size={16} />
              </button>
            </div>

            <motion.button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0 && !product.isPreorder}
              whileTap={{ scale: 0.97 }}
              style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
            >
              <ShoppingBag size={18} />
              {addedFeedback ? '✓ Đã thêm vào giỏ!' : product.isPreorder ? 'Đặt trước ngay' : 'Thêm vào giỏ hàng'}
            </motion.button>

            <button
              onClick={handleWishlist}
              style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Heart size={20} fill={isInWishlist(product.id) ? 'var(--secondary)' : 'none'} color="var(--secondary)" />
            </button>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', marginTop: '0.5rem' }}>
            {[
              { Icon: ShieldCheck, text: 'Cam kết 100% thảo mộc tự nhiên, không hóa chất' },
              { Icon: Truck, text: 'Giao hàng nhanh toàn quốc (2-4 ngày làm việc)' },
              { Icon: RefreshCw, text: 'Đổi trả trong vòng 7 ngày nếu lỗi sản phẩm' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <Icon size={18} color="var(--secondary)" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      {product.videoUrl && (
        <div style={{ marginTop: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Video Sản phẩm</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', background: '#000', aspectVideo: '16/9' }}>
            {product.videoUrl.startsWith('/uploads/') ? (
              <video src={product.videoUrl} controls className="w-full h-full" style={{ width: '100%', display: 'block' }} />
            ) : (
              <iframe
                width="100%"
                height="450"
                src={product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') 
                  ? product.videoUrl.replace('watch?v=', 'embed/').split('&')[0] 
                  : product.videoUrl}
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}

      {/* Description + Reviews */}
      <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
        {/* Description */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Mô tả sản phẩm</h2>
          <div
            style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}
            dangerouslySetInnerHTML={{ __html: product.description || '' }}
          />
        </div>

        {/* Reviews */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Đánh giá ({product.numReviews})</h2>
          {product.reviews?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.reviews.map(review => (
                <div key={review.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? 'var(--secondary)' : 'none'} color="var(--secondary)" />
                    ))}
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>{review.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
