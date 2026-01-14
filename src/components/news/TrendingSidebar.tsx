import { articles } from '@/data/mockData';
import { ArticleCard } from './ArticleCard';
import { TrendingUp, Eye } from 'lucide-react';

export const TrendingSidebar = () => {
  const trendingArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="rounded-xl bg-card p-4 border border-border">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h3 className="font-display text-lg font-bold text-foreground">Trending Now</h3>
      </div>
      
      <div className="space-y-1">
        {trendingArticles.map((article, index) => (
          <div key={article.id} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            <ArticleCard article={article} variant="compact" />
          </div>
        ))}
      </div>
    </div>
  );
};
