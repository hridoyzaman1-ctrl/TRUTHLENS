import { Layout } from '@/components/layout/Layout';
import { BreakingNewsTicker } from '@/components/news/BreakingNewsTicker';
import { HeroSection } from '@/components/news/HeroSection';
import { LatestNews } from '@/components/news/LatestNews';
import { CategorySection } from '@/components/news/CategorySection';
import { TrendingSidebar } from '@/components/news/TrendingSidebar';
import { articles } from '@/data/mockData';
import { ArticleCard } from '@/components/news/ArticleCard';

const Index = () => {
  return (
    <Layout>
      <BreakingNewsTicker />
      <HeroSection />
      
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 font-display text-xl font-bold text-foreground md:text-2xl border-b-2 border-primary pb-2">
                Latest Stories
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {articles.slice(0, 6).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </section>

      <CategorySection category="untold-stories" title="Untold Stories" />
      <LatestNews />
      <CategorySection category="technology" title="Technology" />
      <CategorySection category="economy" title="Economy & Business" />
    </Layout>
  );
};

export default Index;
