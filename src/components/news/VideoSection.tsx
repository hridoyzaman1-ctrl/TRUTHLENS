import { Link } from 'react-router-dom';
import { articles } from '@/data/mockData';
import { ArticleCard } from './ArticleCard';
import { PlayCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const VideoSection = () => {
  const videoArticles = articles.filter(a => a.hasVideo).slice(0, 4);

  if (videoArticles.length === 0) return null;

  return (
    <section className="py-8 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Video className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              Video Stories
            </h2>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {videoArticles.map((article) => (
            <div key={article.id} className="relative isolate">
              <ArticleCard article={article} variant="video" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
