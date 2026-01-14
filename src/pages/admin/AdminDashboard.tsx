import { FileText, Eye, Users, TrendingUp } from 'lucide-react';
import { articles } from '@/data/mockData';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Articles', value: articles.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Views', value: articles.reduce((a, b) => a + b.views, 0).toLocaleString(), icon: Eye, color: 'bg-green-500' },
    { label: 'Authors', value: '3', icon: Users, color: 'bg-purple-500' },
    { label: 'Breaking News', value: articles.filter(a => a.isBreaking).length, icon: TrendingUp, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-card p-6 border border-border">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} mb-4`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl bg-card p-6 border border-border">
        <h2 className="font-display text-lg font-semibold mb-4">Recent Articles</h2>
        <div className="space-y-3">
          {articles.slice(0, 5).map((article) => (
            <div key={article.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-foreground truncate flex-1">{article.title}</span>
              <span className="text-xs text-muted-foreground ml-4">{article.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
