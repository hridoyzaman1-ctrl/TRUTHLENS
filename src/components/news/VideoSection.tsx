import { useState } from 'react';
import { articles } from '@/data/mockData';
import { PlayCircle, Video, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VideoPlayerModal } from './VideoPlayerModal';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types/news';

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    national: 'bg-blue-500',
    international: 'bg-purple-500',
    economy: 'bg-amber-500',
    environment: 'bg-emerald-500',
    technology: 'bg-cyan-500',
    culture: 'bg-pink-500',
    editorial: 'bg-slate-500',
    society: 'bg-orange-500',
    'untold-stories': 'bg-red-600',
    sports: 'bg-green-500',
    entertainment: 'bg-fuchsia-500',
  };
  return colors[category] || 'bg-primary';
};

interface VideoCardProps {
  article: Article;
  onPlay: () => void;
}

const VideoCard = ({ article, onPlay }: VideoCardProps) => (
  <div 
    onClick={onPlay}
    className="group block overflow-hidden rounded-xl bg-card border border-border transition-shadow hover:shadow-lg h-full cursor-pointer"
  >
    <div className="aspect-video overflow-hidden relative flex-shrink-0">
      <img
        src={article.featuredImage}
        alt={article.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <PlayCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        </div>
      </div>
      <Badge className={`absolute top-2 left-2 ${getCategoryColor(article.category)} text-white border-0 text-[10px]`}>
        {article.category.replace('-', ' ')}
      </Badge>
    </div>
    <div className="p-3 md:p-4">
      <h3 className="font-display text-sm md:text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem] md:min-h-[3rem]">
        {article.title}
      </h3>
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 flex-shrink-0" />
          {article.views.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

export const VideoSection = () => {
  const videoArticles = articles.filter(a => a.hasVideo && a.videoUrl).slice(0, 4);
  const [selectedVideo, setSelectedVideo] = useState<Article | null>(null);

  if (videoArticles.length === 0) return null;

  return (
    <>
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
                <VideoCard 
                  article={article} 
                  onPlay={() => setSelectedVideo(article)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedVideo && selectedVideo.videoUrl && (
        <VideoPlayerModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.videoUrl}
          title={selectedVideo.title}
        />
      )}
    </>
  );
};
