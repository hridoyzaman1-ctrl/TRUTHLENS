import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { articles } from '@/data/mockData';

export const BreakingNewsTicker = () => {
  const breakingNews = articles.filter(a => a.isBreaking);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (breakingNews.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container mx-auto flex items-center px-4 py-2">
        <div className="flex items-center gap-2 bg-accent-foreground/10 px-3 py-1 rounded-full">
          <AlertCircle className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Breaking</span>
        </div>
        
        <div className="ml-4 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/article/${breakingNews[currentIndex].slug}`}
                className="flex items-center gap-2 text-sm font-medium hover:underline"
              >
                <span className="line-clamp-1">{breakingNews[currentIndex].title}</span>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {breakingNews.length > 1 && (
          <div className="ml-4 flex gap-1">
            {breakingNews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-accent-foreground' : 'bg-accent-foreground/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
