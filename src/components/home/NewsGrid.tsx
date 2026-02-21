import Link from 'next/link';
import NewsCard from './NewsCard';
import type { NewsArticle } from '@/types';

interface Props {
  articles: NewsArticle[];
}

export default function NewsGrid({ articles }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
        <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tighter">
          THE LATEST <span className="text-neutral-600">FROM KEYS PARK</span>
        </h2>
        <Link
          href="#"
          className="hidden md:block text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors rounded-sm"
        >
          View Archive
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}
