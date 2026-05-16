import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Link as LinkIcon, ArrowRight, BookOpen, MessageCircle, Moon, Sun } from 'lucide-react';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import Breadcrumb from '../components/common/Breadcrumb';
import { fetchBlogBySlug, fetchBlogs, addBlogComment } from '../api/blogApi';
import { formatDate } from '../utils/format';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NewsDetail = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { id: slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, user: user?.name, userId: user?.id });
  }, [isAuthenticated, user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (slug) {
          const data = await fetchBlogBySlug(slug);
          setArticle(data);

          // Fetch related posts
          const allBlogs = await fetchBlogs();
          const related = allBlogs.filter((b: any) =>
            b.id !== data.id &&
            (b.tags?.split(',')[0] === data.tags?.split(',')[0])
          ).slice(0, 3);

          if (related.length < 3) {
            const more = allBlogs.filter((b: any) => b.id !== data.id && !related.find((r: any) => r.id === b.id)).slice(0, 3 - related.length);
            setRelatedPosts([...related, ...more]);
          } else {
            setRelatedPosts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${url}&text=${article?.title}`, '_blank');
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Đã sao chép liên kết!');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để gửi bình luận');
      return;
    }

    if (!commentContent) return toast.error('Vui lòng nhập nội dung bình luận');

    // Confirmation dialog
    const confirmed = window.confirm('Bạn có chắc muốn đăng bình luận này không?');
    if (!confirmed) return;

    console.log('Submitting comment:', { articleId: article.id, name: user?.name, email: user?.email, content: commentContent });

    setIsSubmitting(true);
    try {
      await addBlogComment(article.id, {
        name: user?.name || 'Anonymous',
        email: user?.email || '',
        avatar: user?.avatar || '',
        content: commentContent
      });
      toast.success('Bình luận đang chờ duyệt!');
      setCommentContent('');

      // Reload article to show new comments (if approved)
      if (slug) {
        const data = await fetchBlogBySlug(slug);
        setArticle(data);
      }
    } catch (error: any) {
      console.error('Comment submission error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Gửi bình luận thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 text-center min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-400 text-sm font-medium">Đang tải bài viết...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết không tồn tại</h2>
        <Link to="/news" className="px-6 py-2 bg-sage text-white rounded-lg">Quay lại Tin tức</Link>
      </div>
    );
  }

  const category = article.tags?.split(',')[0] || "TIN TỨC";
  const readTime = article.content ? Math.max(1, Math.round(article.content.replace(/<[^>]+>/g, '').split(/\s+/).length / 200)) : 1;

  return (
    <div className="bg-[var(--clr-cream)] pb-24">
      <SEO title={article.title} description={article.summary || article.title} />

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50"
        style={{ transform: 'translateZ(0)' }}
      >
        <div
          className="h-full bg-[var(--clr-mint)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container max-w-4xl pt-12 pb-16 relative">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Breadcrumb items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Tin tức', to: '/news' },
            { label: article.title }
          ]} />
          <div className="mt-10">
            <span className="inline-block px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-[var(--clr-mint)] text-white mb-6">
              {category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-7 text-[var(--clr-ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-gray-400 text-[14px]">
              <span className="flex items-center gap-2"><User size={14} /> {article.author || "HerbSpa Lab"}</span>
              <span className="flex items-center gap-2"><Clock size={14} /> {formatDate(article.createdAt)}</span>
              <span className="flex items-center gap-2"><BookOpen size={14} /> {readTime} phút đọc</span>
              <span className="flex items-center gap-2"><MessageCircle size={14} /> {article.comments?.length || 0} bình luận</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image — constrained height like magazine */}
      <div className="container max-w-4xl">
        <figure className="-mt-8 relative z-10 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-gray-100" style={{ maxHeight: '480px' }}>
            <div className="aspect-[16/9] max-h-[480px]">
              <LazyImage src={article.image || '/assets/images/blog_placeholder.png'} alt={article.title} width={1200} height={675} />
            </div>
          </div>
          {article.summary && (
            <figcaption className="text-center text-gray-500 text-[14px] italic mt-4 max-w-2xl mx-auto leading-[1.6]">
              {article.summary}
            </figcaption>
          )}
        </figure>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">
          {/* Main Content */}
          <article className="max-w-none min-w-0">

            <div className="article-html-content text-gray-700 leading-[1.8] text-[17px] space-y-7" dangerouslySetInnerHTML={{ __html: article.content }}></div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 py-7 border-y border-gray-200">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mr-2">Tags:</span>
              {article.tags?.split(',').map((tag: string) => (
                <Link key={tag} to="/news" className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-[13px] font-semibold hover:border-[var(--clr-mint)] hover:text-[var(--clr-mint)] transition-colors">
                  #{tag.trim()}
                </Link>
              ))}
            </div>

            {/* Comments */}
            <div className="mt-14">
              <h3 className="text-2xl font-bold text-[var(--clr-ink)] mb-10 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                <MessageCircle size={22} /> Bình luận ({article.comments?.length || 0})
              </h3>

              <div className="space-y-6 mb-12">
                {article.comments?.map((comment: any) => (
                  <div key={comment.id} className="flex gap-5 p-6 bg-white rounded-2xl border border-gray-100">
                    {comment.avatar ? (
                      <img src={comment.avatar} alt={comment.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[var(--clr-gold)] flex items-center justify-center text-white font-semibold shrink-0">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-[var(--clr-ink)] text-[15px]">{comment.name}</span>
                        <span className="text-gray-400 text-[12px]">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 text-[15px] leading-[1.6]">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {(!article.comments || article.comments.length === 0) && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <MessageCircle size={36} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 text-[15px]">Hãy là người đầu tiên bình luận.</p>
                  </div>
                )}
              </div>

              {/* Comment Form */}
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-[18px] font-semibold text-[var(--clr-ink)] mb-7">Gửi bình luận</h4>

                <form onSubmit={handleCommentSubmit} className="space-y-5">
                  {!isAuthenticated && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                      <p className="text-yellow-800 mb-3">Vui lòng đăng nhập để gửi bình luận</p>
                      <Link to="/login" className="inline-block px-6 py-2 bg-[var(--clr-mint)] text-white rounded-lg text-[13px] font-semibold hover:bg-[var(--clr-mint-dark)] transition-colors">
                        Đăng nhập
                      </Link>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="flex items-center gap-3 mb-4 p-4 bg-[var(--clr-cream)] rounded-xl">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--clr-mint)] flex items-center justify-center text-white font-bold shrink-0">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[var(--clr-ink)]">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  )}

                  <textarea
                    placeholder={isAuthenticated ? "Chia sẻ suy nghĩ của bạn..." : "Bạn cần đăng nhập để bình luận"}
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    required
                    rows={5}
                    disabled={!isAuthenticated}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:border-[var(--clr-mint)] outline-none text-[15px] transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
                    style={{ backgroundColor: '#1a2e1f', color: '#ffffff' }}
                    className="w-full px-10 py-4 min-h-[52px] rounded-xl text-[14px] font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:opacity-90"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                  </button>
                </form>
              </div>

              {/* Share Bar - at end of article */}
              <div className="mt-12 pt-8 border-t border-gray-200 bg-gray-100 -mx-8 px-8 py-6 rounded-xl shadow-inner">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
                    Chia sẻ bài viết:
                  </span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-[#1877F2] text-white text-[13px] font-semibold hover:bg-[#166fe5] transition-all shadow-md hover:shadow-lg"
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-black text-white text-[13px] font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X (Twitter)
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-[var(--clr-mint)] text-white text-[13px] font-semibold hover:bg-[var(--clr-mint-dark)] transition-all shadow-md hover:shadow-lg"
                  >
                    <LinkIcon size={14} /> Sao chép link
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-7 hidden lg:block">
            {/* Sidebar can be used for related content or widgets in the future */}
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white py-20 mt-20 border-t border-gray-100">
          <div className="container max-w-5xl">
            <div className="flex items-center gap-3 mb-12">
              <span className="w-8 h-0.5 bg-[var(--clr-gold)]"></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--clr-gold)]">Có thể bạn quan tâm</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {relatedPosts.map(post => (
                <Link key={post.id} to={`/news/${post.slug}`} className="group bg-[var(--clr-cream)] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <LazyImage src={post.image || '/assets/images/blog_placeholder.png'} alt={post.title} width={800} height={500} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-3">
                      <Clock size={11} /> {formatDate(post.createdAt)}
                    </div>
                    <h3 className="text-[16px] font-semibold text-[var(--clr-ink)] line-clamp-2 leading-[1.4] group-hover:text-[var(--clr-mint)] transition-colors mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                      {post.title}
                    </h3>
                    <span className="text-[var(--clr-mint)] font-semibold text-[12px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Đọc thêm <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
