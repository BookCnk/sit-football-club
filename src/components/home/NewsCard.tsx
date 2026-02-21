import Image from 'next/image';
import type { NewsArticle } from '@/types';
import FadeUp from '@/components/ui/FadeUp';

interface Props {
  article: NewsArticle;
  index?: number;
}

export default function NewsCard({ article, index = 0 }: Props) {
  return (
    <FadeUp delay={index * 100}>
      <div className="group cursor-pointer bg-neutral-900/30 border border-white/5 rounded-lg overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="h-48 bg-neutral-800 overflow-hidden relative">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 filter grayscale group-hover:grayscale-0"
          />
          <div className="absolute top-3 left-3 bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white z-10">
            {article.category}
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display font-medium leading-tight group-hover:text-white transition-colors text-neutral-300 mb-2">
              {article.title}
            </h3>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-4 pt-4 border-t border-white/5">
            {article.date}
          </span>
        </div>
      </div>
    </FadeUp>
  );
}
