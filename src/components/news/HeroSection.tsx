import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import { articles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const HeroSection = () => {
  const featuredArticles = articles.filter(a => a.isFeatured).slice(0, 4);
  const mainArticle = featuredArticles[0];
  const sideArticles = featuredArticles.slice(1, 4);

  if (!mainArticle) return null;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      national: 'bg-blue-500',
      international: 'bg-purple-500',
      economy: 'bg-amber-500',
      environment: 'bg-green-500',
      technology: 'bg-cyan-500',
      culture: 'bg-pink-500',
      editorial: 'bg-gray-500',
      society: 'bg-orange-500',
      'untold-stories': 'bg-red-500',
    };
    return colors[category] || 'bg-primary';
  };

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Main Featured Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link to={`/article/${mainArticle.slug}`} className="group relative block overflow-hidden rounded-xl">
              <div className="aspect-[16/10] lg:aspect-[16/9]">
                <img
                  src={mainArticle.featuredImage}
                  alt={mainArticle.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
                <Badge className={`${getCategoryColor(mainArticle.category)} mb-3 text-white border-0`}>
                  {mainArticle.category.replace('-', ' ')}
                </Badge>
                <h2 className="font-display text-xl font-bold text-white md:text-2xl lg:text-3xl xl:text-4xl">
                  {mainArticle.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-white/80 md:text-base">
                  {mainArticle.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(mainArticle.publishedAt, { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {mainArticle.views.toLocaleString()} views
                  </span>
                  <span>By {mainArticle.author.name}</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side Articles */}
          <div className="flex flex-col gap-4">
            {sideArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/article/${article.slug}`}
                  className="group flex gap-4 rounded-lg bg-card p-3 transition-colors hover:bg-muted"
                >
                  <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-md md:h-24 md:w-32">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Badge variant="outline" className="mb-1 w-fit text-[10px]">
                      {article.category.replace('-', ' ')}
                    </Badge>
                    <h3 className="line-clamp-2 font-display text-sm font-semibold text-foreground md:text-base">
                      {article.title}
                    </h3>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
