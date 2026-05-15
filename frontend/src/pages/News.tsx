import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Search, Hash } from 'lucide-react';
import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import { fetchBlogs } from '../api/blogApi';
import { formatDate } from '../utils/format';

const News = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(a => {
      if (a.tags) {
        a.tags.split(',').forEach((t: string) => tags.add(t.trim()));
      }
    });
    return Array.from(tags).filter(Boolean);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const title = a.title || '';
      const summary = a.summary || '';
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? a.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [articles, searchQuery, selectedTag]);

  if (loading) {
    return (
      <div className="container py-20 text-center min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-400 text-sm font-medium">Đang tải tin tức...</div>
        </div>
      </div>
    );
  }

  const featuredArticle = filteredArticles.length > 0 && !searchQuery && !selectedTag ? filteredArticles[0] : null;
  const regularArticles = featuredArticle ? filteredArticles.slice(1) : filteredArticles;

  return (
    <div className="pb-24 bg-gray-50/30">
      <SEO title="Tin tức & Sự kiện" description="Cập nhật những tin tức mới nhất và kiến thức chăm sóc da từ HerbSpa Lab." />
      
      <div className="container">
        <header className="pt-16 md:pt-24 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Tin tức & Sự kiện</h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg">Chia sẻ kiến thức chăm sóc da và phong cách sống lành mạnh từ chuyên gia.</p>
          
          {/* Search & Filter Bar */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm bài viết..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-xl bg-white border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage outline-none text-base shadow-sm transition-all"
              />
            </div>
            
            {allTags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button 
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${!selectedTag ? 'bg-sage text-white border-sage' : 'bg-white text-gray-600 border-gray-200 hover:border-sage hover:text-sage'}`}
                >
                  Tất cả
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${selectedTag === tag ? 'bg-sage text-white border-sage' : 'bg-white text-gray-600 border-gray-200 hover:border-sage hover:text-sage'}`}
                  >
                    <Hash size={12} /> {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] lg:aspect-auto relative overflow-hidden group">
                <Link to={`/news/${featuredArticle.slug}`}>
                  <LazyImage src={featuredArticle.image || '/assets/images/blog_placeholder.png'} alt={featuredArticle.title} />
                </Link>
              </div>
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <span className="text-sage font-bold text-xs uppercase tracking-widest mb-4">{featuredArticle.tags?.split(',')[0] || "TIN TỨC"}</span>
                <Link to={`/news/${featuredArticle.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 hover:text-sage transition-colors leading-tight">{featuredArticle.title}</h2>
                </Link>
                <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">{featuredArticle.summary}</p>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-6 text-gray-400 text-xs">
                    <span className="flex items-center gap-2"><User size={14} /> {featuredArticle.author || "HerbSpa Lab"}</span>
                    <span className="flex items-center gap-2"><Clock size={14} /> {formatDate(featuredArticle.createdAt)}</span>
                  </div>
                  <Link to={`/news/${featuredArticle.slug}`} className="flex items-center gap-2 text-sage font-bold uppercase tracking-widest text-xs">
                    Đọc tiếp <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article) => (
            <div 
              key={article.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <Link to={`/news/${article.slug}`}>
                  <LazyImage src={article.image || '/assets/images/blog_placeholder.png'} alt={article.title} />
                </Link>
                <div className="absolute top-4 left-4 px-2 py-1 bg-white/95 text-sage text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                  {article.tags?.split(',')[0] || "TIN TỨC"}
                </div>
              </div>
              <div className="p-6 flex flex-1 flex-col">
                <Link to={`/news/${article.slug}`} className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 hover:text-sage transition-colors leading-snug line-clamp-2">{article.title}</h3>
                </Link>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">{article.summary}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {formatDate(article.createdAt)}</span>
                  <Link to={`/news/${article.slug}`} className="font-bold text-sage uppercase tracking-widest">
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && !loading && (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 mt-8">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-400 text-sm">Thử tìm kiếm với từ khóa khác.</p>
            {(searchQuery || selectedTag) && (
              <button 
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="mt-6 px-6 py-2 bg-sage text-white rounded-lg text-xs font-bold uppercase tracking-widest"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
