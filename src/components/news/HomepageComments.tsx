import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ThumbsUp, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { articles } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

// Mock comments data
const recentComments = [
  {
    id: '1',
    articleId: '1',
    articleTitle: 'Global Climate Summit Reaches Historic Agreement',
    author: 'John D.',
    avatar: 'https://ui-avatars.com/api/?name=John+D&background=random',
    content: 'This is exactly the kind of leadership we need. Finally, world leaders are taking climate change seriously!',
    likes: 24,
    createdAt: new Date('2026-01-14T09:30:00')
  },
  {
    id: '2',
    articleId: '3',
    articleTitle: 'Inside the Lives of Migrant Workers',
    author: 'Sarah M.',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+M&background=random',
    content: 'Powerful storytelling. These are the stories that need more attention in mainstream media.',
    likes: 18,
    createdAt: new Date('2026-01-14T08:15:00')
  },
  {
    id: '3',
    articleId: '10',
    articleTitle: 'World Cup Final: Historic Victory',
    author: 'Mike R.',
    avatar: 'https://ui-avatars.com/api/?name=Mike+R&background=random',
    content: 'What an incredible match! The underdog story of this tournament will be remembered for years.',
    likes: 45,
    createdAt: new Date('2026-01-14T11:00:00')
  },
  {
    id: '4',
    articleId: '4',
    articleTitle: 'Tech Giants Face New Regulations',
    author: 'Emily K.',
    avatar: 'https://ui-avatars.com/api/?name=Emily+K&background=random',
    content: 'Finally some accountability! Our data privacy has been at risk for far too long.',
    likes: 32,
    createdAt: new Date('2026-01-13T16:45:00')
  }
];

export const HomepageComments = () => {
  const getArticleSlug = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    return article?.slug || '';
  };

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              Reader Comments
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentComments.map((comment) => (
            <Link
              key={comment.id}
              to={`/article/${getArticleSlug(comment.articleId)}`}
              className="group block rounded-xl bg-card border border-border p-4 hover:shadow-lg transition-all"
            >
              {/* Article Reference */}
              <p className="text-xs text-primary font-medium line-clamp-1 mb-3">
                Re: {comment.articleTitle}
              </p>

              {/* Comment Content */}
              <p className="text-sm text-foreground line-clamp-3 mb-4">
                "{comment.content}"
              </p>

              {/* Author & Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-medium text-foreground">{comment.author}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {comment.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(comment.createdAt, { addSuffix: false })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
