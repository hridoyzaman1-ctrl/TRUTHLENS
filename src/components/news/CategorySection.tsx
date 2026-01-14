import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { articles } from '@/data/mockData';
import { ArticleCard } from './ArticleCard';
import { Category } from '@/types/news';

interface CategorySectionProps {
  category: Category;
  title: string;
  showMore?: boolean;
}

export const CategorySection = ({ category, title, showMore = true }: CategorySectionProps) => {
  const categoryArticles = articles.filter(a => a.category === category).slice(0, 4);

  if (categoryArticles.length === 0) return null;

  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between border-b-2 border-primary pb-2">
          <h2 className="font-display text-lg font-bold text-foreground md:text-xl">
            {title}
          </h2>
          {showMore && (
            <Link
              to={`/category/${category}`}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};
