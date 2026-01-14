import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { articles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Share2, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CommentSection } from '@/components/news/CommentSection';
const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);
  const relatedArticles = articles.filter(a => a.category === article?.category && a.id !== article?.id).slice(0, 3);

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Article Not Found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 lg:h-[500px]">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <article className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                {article.category.replace('-', ' ')}
              </Badge>
              {article.isBreaking && (
                <Badge className="bg-accent text-accent-foreground">Breaking</Badge>
              )}
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
              {article.title}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{article.author.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(article.publishedAt, 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="mt-8 prose prose-lg max-w-none dark:prose-invert">
            <p>{article.content}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
            <span className="text-sm font-medium text-foreground">Share:</span>
            <Button variant="outline" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments Section */}
          <CommentSection articleId={article.id} />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="mb-6 font-display text-xl font-bold text-foreground md:text-2xl border-b-2 border-primary pb-2">
            Related Articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ArticlePage;
