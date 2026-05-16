import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Search, Hash, ChevronDown, Mail, BookOpen, Moon, Sun } from 'lucide-react';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import { fetchBlogs } from '../api/blogApi';
import { formatDate } from '../utils/format';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const ITEMS_PER_PAGE = 6;

const calcReadTime = (content: string) => {
  if (!content) return 1;
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const News = () => {
  const { theme, toggleTheme } = useTheme();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchBlogs()
      .then(data => setArticles(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(a => {
      if (a.tags) a.tags.split(',').forEach((t: string) => tags.add(t.trim()));
    });
    return Array.from(tags).filter(Boolean);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    return articles.filter(a => {
      const matchesSearch =
        (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? a.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [articles, searchQuery, selectedTag]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => { setVisibleCount(c => c + ITEMS_PER_PAGE); setLoadingMore(false); }, 500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return toast.error('Email không hợp lệ');
    setSubscribing(true);
    await new Promise(r => setTimeout(r, 800));
    setSubscribing(false);
    setEmail('');
    toast.success('Đăng ký thành công! Cảm ơn bạn.');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--clr-mint)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const showHero = !searchQuery && !selectedTag && filteredArticles.length > 0;
  const featuredArticle = showHero ? filteredArticles[0] : null;
  const subFeatured = showHero ? filteredArticles.slice(1, 3) : [];
  const heroCount = showHero ? 1 + subFeatured.length : 0;
  const rest = filteredArticles.slice(heroCount);
  const gridArticles = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;

  return (
    <div className="bg-[var(--clr-cream)] min-h-screen">
      <SEO title="Tin tức & Sự kiện | HerbSpa Lab" description="Cập nhật những tin tức mới nhất và kiến thức chăm sóc da từ HerbSpa Lab." />

      {/* ── HEADER ──────────────────────────────── */}
      <header className="bg-white border-b border-[var(--clr-border,hsl(45,20%,90%))]">
        <div className="container py-14 md:py-20 text-center relative">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <p className="text-[var(--clr-mint)] text-[12px] font-semibold uppercase tracking-[0.25em] mb-4">
            Kiến thức & Cảm hứng
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--clr-ink)] mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tin tức & Sự kiện
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-[16px] md:text-[17px] mb-12 leading-[1.7]">
            Chia sẻ kiến thức chăm sóc da và phong cách sống lành mạnh từ chuyên gia.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-[var(--clr-cream)] border border-gray-200 focus:border-[var(--clr-mint)] focus:outline-none text-sm text-[var(--clr-ink)] placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="container pb-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-4 px-4">
              <button
                onClick={() => setSelectedTag(null)}
                className={`shrink-0 px-5 py-3 min-h-[48px] rounded-full text-[12px] font-semibold transition-all border ${!selectedTag ? 'bg-[var(--clr-sage)] text-white border-[var(--clr-sage)]' : 'border-gray-200 text-gray-500 hover:border-[var(--clr-mint)] hover:text-[var(--clr-mint)]'}`}
              >Tất cả</button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`shrink-0 px-5 py-3 min-h-[48px] rounded-full text-[12px] font-semibold transition-all border flex items-center gap-1.5 ${selectedTag === tag ? 'bg-[var(--clr-sage)] text-white border-[var(--clr-sage)]' : 'border-gray-200 text-gray-500 hover:border-[var(--clr-mint)] hover:text-[var(--clr-mint)]'}`}
                >
                  <Hash size={10} />{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="container py-16 md:py-20 space-y-20">

        {/* ── F-PATTERN HERO: Featured (left) + 2 sub-featured (right) ─── */}
        {featuredArticle && (
          <section>
            <p className="text-[12px] font-semibold text-[var(--clr-mint)] uppercase tracking-[0.2em] mb-6">Tin nổi bật</p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              {/* MAIN FEATURED — top-left F-pattern (8/12 cols) */}
              <Link to={`/news/${featuredArticle.slug}`} className="group block lg:col-span-8">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="relative overflow-hidden aspect-[16/9]">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                      <LazyImage src={featuredArticle.image || '/assets/images/blog_placeholder.png'} alt={featuredArticle.title} width={1200} height={675} />
                    </div>
                    {featuredArticle.tags && (
                      <span className="absolute top-5 left-5 px-3 py-1.5 bg-[var(--clr-mint)] text-white text-[11px] font-semibold uppercase tracking-wider rounded-full shadow-sm">
                        Tin VIP · {featuredArticle.tags.split(',')[0].trim()}
                      </span>
                    )}
                  </div>
                  <div className="p-8 md:p-10 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[13px] text-gray-400 mb-4">
                      <span className="flex items-center gap-1.5"><Clock size={13} />{formatDate(featuredArticle.createdAt)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5"><BookOpen size={13} />{calcReadTime(featuredArticle.content)} phút đọc</span>
                    </div>
                    <h2
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--clr-ink)] leading-[1.2] mb-4 group-hover:text-[var(--clr-mint)] transition-colors"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >{featuredArticle.title}</h2>
                    <p className="text-gray-500 text-[16px] leading-[1.7] line-clamp-3 mb-6">{featuredArticle.summary}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--clr-mint-light)] flex items-center justify-center text-[var(--clr-mint)]">
                          <User size={15} />
                        </div>
                        <span className="text-[14px] font-medium text-gray-600">{featuredArticle.author || 'HerbSpa Lab'}</span>
                      </div>
                      <span className="flex items-center gap-2 text-[var(--clr-mint)] font-semibold text-[14px]">
                        Đọc tiếp <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* SUB-FEATURED — right column F-pattern (4/12 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
                {subFeatured.map(article => (
                  <Link
                    key={article.id}
                    to={`/news/${article.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex-1 flex flex-col"
                  >
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
                        <LazyImage src={article.image || '/assets/images/blog_placeholder.png'} alt={article.title} width={600} height={375} />
                      </div>
                      {article.tags && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-[var(--clr-sage)] text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-sm">
                          {article.tags.split(',')[0].trim()}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                        <Clock size={11} /><span>{formatDate(article.createdAt)}</span>
                        <span>·</span>
                        <BookOpen size={11} /><span>{calcReadTime(article.content)} phút</span>
                      </div>
                      <h3
                        className="font-semibold text-[var(--clr-ink)] leading-[1.35] line-clamp-2 mb-2 group-hover:text-[var(--clr-mint)] transition-colors text-[16px]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >{article.title}</h3>
                      <p className="text-gray-500 text-[13px] line-clamp-2 leading-[1.6]">{article.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── ARTICLE GRID ─────────────────────── */}
        {gridArticles.length > 0 && (
          <section>
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-8">
              {searchQuery || selectedTag ? 'Kết quả tìm kiếm' : 'Tất cả bài viết'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
                      <LazyImage src={article.image || '/assets/images/blog_placeholder.png'} alt={article.title} width={800} height={600} />
                    </div>
                    {article.tags && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-[var(--clr-sage)] text-[11px] font-semibold uppercase tracking-wider rounded-full shadow-sm">
                        {article.tags.split(',')[0].trim()}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-3">
                      <Clock size={12} /><span>{formatDate(article.createdAt)}</span>
                      <span>·</span>
                      <BookOpen size={12} /><span>{calcReadTime(article.content)} phút</span>
                    </div>
                    <h3
                      className="font-semibold text-[var(--clr-ink)] leading-[1.4] line-clamp-2 mb-3 group-hover:text-[var(--clr-mint)] transition-colors text-[17px]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >{article.title}</h3>
                    <p className="text-gray-500 text-[14px] line-clamp-2 leading-[1.6] flex-1 mb-5">{article.summary}</p>
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <span className="text-[13px] text-gray-400">{article.author || 'HerbSpa Lab'}</span>
                      <span className="text-[var(--clr-mint)] font-semibold text-[13px] flex items-center gap-1 group-hover:gap-2 transition-all">
                        Đọc <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-3 px-10 py-4 min-h-[52px] border border-gray-200 bg-white text-[var(--clr-ink)] rounded-xl font-medium text-[15px] hover:border-[var(--clr-mint)] hover:text-[var(--clr-mint)] transition-all disabled:opacity-50"
                >
                  {loadingMore
                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : <ChevronDown size={16} />}
                  {loadingMore ? 'Đang tải...' : 'Xem thêm bài viết'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-[var(--clr-mint-light)] flex items-center justify-center mb-5">
              <Search className="w-6 h-6 text-[var(--clr-mint)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--clr-ink)] mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-400 text-sm mb-6">Thử tìm kiếm với từ khóa khác.</p>
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="px-8 py-3 min-h-[48px] bg-[var(--clr-ink)] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
              >Xóa bộ lọc</button>
            )}
          </div>
        )}

        {/* ── NEWSLETTER ───────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr]">
            <div className="bg-[var(--clr-mint-light)] p-12 flex flex-col justify-center">
              <div className="w-14 h-14 rounded-xl bg-[var(--clr-mint)]/20 flex items-center justify-center mb-6">
                <Mail size={24} className="text-[var(--clr-mint)]" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-[var(--clr-ink)] mb-4 leading-[1.2]"
                style={{ fontFamily: 'var(--font-display)' }}
              >Đừng bỏ lỡ tin tức mới nhất</h2>
              <p className="text-gray-500 text-[16px] leading-[1.7]">
                Nhận kiến thức skincare, ưu đãi độc quyền và xu hướng làm đẹp mỗi tuần.
              </p>
            </div>
            <div className="p-12 flex flex-col justify-center">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">Địa chỉ email</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1 px-5 py-4 min-h-[52px] rounded-xl border border-gray-200 bg-[var(--clr-cream)] text-[var(--clr-ink)] placeholder-gray-400 focus:border-[var(--clr-mint)] focus:outline-none text-[15px] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-8 py-4 min-h-[52px] bg-[var(--clr-mint)] text-white rounded-xl font-semibold text-[15px] hover:bg-[var(--clr-mint-dark)] transition-colors disabled:opacity-60 shrink-0"
                  >
                    {subscribing ? 'Đang xử lý...' : 'Đăng ký'}
                  </button>
                </div>
                <p className="text-[13px] text-gray-400">Chúng tôi tôn trọng quyền riêng tư của bạn. Huỷ đăng ký bất cứ lúc nào.</p>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default News;
