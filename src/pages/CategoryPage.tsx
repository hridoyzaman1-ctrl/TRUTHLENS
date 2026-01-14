import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { articles, categories } from '@/data/mockData';
import { ArticleCard } from '@/components/news/ArticleCard';
import { ArticleCardSkeleton } from '@/components/ui/skeletons';
import { Category } from '@/types/news';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  const category = categories.find(c => c.id === categoryId);
  const categoryArticles = articles.filter(a => a.category === categoryId as Category);

  // Simulate loading state (will be real when connected to Cloud)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [categoryId]);

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Category Not Found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary py-6 md:py-8 mb-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80">{category.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : categoryArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No articles in this category yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
