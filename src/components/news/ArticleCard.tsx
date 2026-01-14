import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export const ArticleCard = ({ article, variant = 'default' }: ArticleCardProps) => {
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

  if (variant === 'compact') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group flex gap-3 py-3 border-b border-border last:border-0"
      >
        <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {article.title}
          </h4>
          <span className="text-xs text-muted-foreground mt-1 block">
            {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
          </span>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group relative block overflow-hidden rounded-xl"
      >
        <div className="aspect-[4/3]">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Badge className={`${getCategoryColor(article.category)} mb-2 text-white border-0`}>
            {article.category.replace('-', ' ')}
          </Badge>
          <h3 className="font-display text-lg font-bold text-white">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group block overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-lg"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <Badge className={`${getCategoryColor(article.category)} mb-2 text-white border-0 text-[10px]`}>
          {article.category.replace('-', ' ')}
        </Badge>
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {article.views.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
};
