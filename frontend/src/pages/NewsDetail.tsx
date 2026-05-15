import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2, Link as LinkIcon, ArrowRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import Breadcrumb from '../components/common/Breadcrumb';
import { fetchBlogBySlug, fetchBlogs, addBlogComment } from '../api/blogApi';
import { formatDate } from '../utils/format';
import toast from 'react-hot-toast';

const NewsDetail = () => {
  const { id: slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!commentName || !commentContent) return toast.error('Vui lòng nhập tên và nội dung');
    
    setIsSubmitting(true);
    try {
      await addBlogComment(article.id, { name: commentName, email: commentEmail, content: commentContent });
      toast.success('Bình luận đang chờ duyệt!');
      setCommentName('');
      setCommentEmail('');
      setCommentContent('');
    } catch (error) {
      toast.error('Gửi bình luận thất bại');
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

  return (
    <div className="bg-white pb-24">
      <SEO title={article.title} description={article.summary || article.title} />
      
      {/* Header Info */}
      <div className="bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <Breadcrumb items={[
            { label: 'Trang chủ', to: '/' }, 
            { label: 'Tin tức', to: '/news' }, 
            { label: article.title }
          ]} />
          
          <div className="mt-10">
            <span className="text-sage font-bold text-xs uppercase tracking-widest mb-4 block">{category}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs font-medium">
              <span className="flex items-center gap-2"><User size={14} /> {article.author || "HerbSpa Lab"}</span>
              <span className="flex items-center gap-2"><Clock size={14} /> {formatDate(article.createdAt)}</span>
              <span className="flex items-center gap-2">{article.comments?.length || 0} Bình luận</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl -mt-8 relative z-10">
        <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-sm mb-12 bg-white border border-gray-100 p-1">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <LazyImage src={article.image || '/assets/images/blog_placeholder.png'} alt={article.title} width={1200} height={800} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main Content */}
          <article className="max-w-none">
            {/* Share */}
            <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-8">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Share2 size={14} /> Chia sẻ:</span>
              <button onClick={() => handleShare('facebook')} className="px-3 py-1 bg-gray-50 text-gray-600 rounded text-[11px] font-bold hover:bg-sage hover:text-white transition-colors">Facebook</button>
              <button onClick={() => handleShare('twitter')} className="px-3 py-1 bg-gray-50 text-gray-600 rounded text-[11px] font-bold hover:bg-sage hover:text-white transition-colors">Twitter</button>
              <button onClick={() => handleShare('copy')} className="p-2 bg-gray-50 text-gray-600 rounded hover:bg-sage hover:text-white transition-colors"><LinkIcon size={14} /></button>
            </div>

            <div className="article-html-content text-gray-700 leading-relaxed text-[17px] space-y-6" dangerouslySetInnerHTML={{ __html: article.content }}></div>
            
            {/* CTA Banner */}
            <div className="my-12 p-8 bg-sage text-white rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-3">Đánh thức vẻ đẹp tự nhiên</h3>
              <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">Sản phẩm thảo mộc organic 100% từ thiên nhiên.</p>
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-sage rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm">
                Xem sản phẩm <ArrowRight size={14} />
              </Link>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 py-6 border-y border-gray-100 mt-12">
              <span className="text-xs font-bold text-gray-400 uppercase">Tags:</span>
              {article.tags?.split(',').map((tag: string) => (
                <Link key={tag} to="/news" className="px-3 py-1 bg-gray-50 text-gray-500 rounded-md text-xs font-medium hover:bg-sage hover:text-white transition-colors">{tag.trim()}</Link>
              ))}
            </div>

            {/* Comments */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Bình luận ({article.comments?.length || 0})</h3>
              
              <div className="space-y-6 mb-12">
                {article.comments?.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900 text-sm">{comment.name}</span>
                        <span className="text-gray-400 text-[11px]">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {(!article.comments || article.comments.length === 0) && (
                  <p className="text-gray-400 text-sm italic">Hãy là người đầu tiên bình luận.</p>
                )}
              </div>

              {/* Form */}
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h4 className="text-base font-bold text-gray-900 mb-6">Gửi bình luận</h4>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Tên của bạn *" value={commentName} onChange={(e) => setCommentName(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sage outline-none text-sm transition-colors" />
                    <input type="email" placeholder="Email" value={commentEmail} onChange={(e) => setCommentEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sage outline-none text-sm transition-colors" />
                  </div>
                  <textarea placeholder="Nội dung bình luận *" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} required rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sage outline-none text-sm transition-colors resize-none"></textarea>
                  <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-sage text-white rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors">
                    {isSubmitting ? 'Đang gửi...' : 'Gửi ngay'}
                  </button>
                </form>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 hidden lg:block">
            <div className="bg-gray-900 p-8 rounded-2xl text-center text-white">
              <span className="text-[10px] font-bold uppercase text-sage mb-3 block">Mã giảm giá</span>
              <h4 className="text-lg font-bold mb-4">Giảm 10% đơn hàng đầu tiên</h4>
              <div className="py-2 bg-white/10 rounded font-mono text-sage font-bold tracking-widest border border-dashed border-white/20 mb-6">
                BLOGREAD10
              </div>
              <Link to="/products" className="inline-block px-6 py-2 bg-sage text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">
                Mua ngay
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Chủ đề</h4>
              <div className="flex flex-wrap gap-2">
                {['Skincare', 'Organic', 'Beauty'].map(t => (
                  <Link key={t} to="/news" className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-md text-[11px] hover:bg-sage hover:text-white transition-colors">{t}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50/50 py-20 mt-12">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Link to={`/news/${post.slug}`}>
                      <LazyImage src={post.image || '/assets/images/blog_placeholder.png'} alt={post.title} />
                    </Link>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Link to={`/news/${post.slug}`} className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-sage transition-colors leading-snug line-clamp-2">{post.title}</h3>
                    </Link>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto text-[11px] text-gray-400">
                      <span>{formatDate(post.createdAt)}</span>
                      <Link to={`/news/${post.slug}`} className="font-bold text-sage uppercase tracking-widest">Xem thêm</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
