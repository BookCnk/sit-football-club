import HeroSection from '@/components/home/HeroSection';
import MatchDataCenter from '@/components/home/MatchDataCenter';
import NewsGrid from '@/components/home/NewsGrid';
import SquadSection from '@/components/home/SquadSection';
import HistorySection from '@/components/home/HistorySection';
import ShopSection from '@/components/home/ShopSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { NEXT_MATCH, LAST_RESULT, NEWS_ARTICLES, PLAYERS, PRODUCTS } from '@/lib/data';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MatchDataCenter nextMatch={NEXT_MATCH} lastResult={LAST_RESULT} />
      {/* <NewsGrid articles={NEWS_ARTICLES} /> */}
      <SquadSection players={PLAYERS} />
      <HistorySection />
      <ShopSection products={PRODUCTS} />
      <NewsletterSection />
    </>
  );
}
