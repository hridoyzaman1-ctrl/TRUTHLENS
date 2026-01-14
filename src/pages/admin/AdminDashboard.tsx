import { FileText, Eye, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { articles } from '@/data/mockData';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ROLE_DISPLAY } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const { currentUser, hasPermission } = useAdminAuth();
  
  const canViewFullDashboard = hasPermission('viewFullDashboard');
  const canReview = hasPermission('reviewArticles');
  
  // Mock pending articles count
  const pendingArticles = 3;
  
  // Stats for full dashboard (admin/editor)
  const fullStats = [
    { label: 'Total Articles', value: articles.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Views', value: articles.reduce((a, b) => a + b.views, 0).toLocaleString(), icon: Eye, color: 'bg-green-500' },
    { label: 'Authors', value: '4', icon: Users, color: 'bg-purple-500' },
    { label: 'Breaking News', value: articles.filter(a => a.isBreaking).length, icon: TrendingUp, color: 'bg-red-500' },
  ];

  // Stats for authors/journalists (own stats only)
  const ownStats = [
    { label: 'Your Articles', value: '5', icon: FileText, color: 'bg-blue-500' },
    { label: 'Your Views', value: '12,450', icon: Eye, color: 'bg-green-500' },
    { label: 'Pending Review', value: '2', icon: Clock, color: 'bg-orange-500' },
    { label: 'Published', value: '3', icon: CheckCircle, color: 'bg-emerald-500' },
  ];

  const stats = canViewFullDashboard ? fullStats : ownStats;
  const roleInfo = currentUser ? ROLE_DISPLAY[currentUser.role] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          {currentUser && roleInfo && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Welcome back,</span>
              <span className="text-sm font-medium">{currentUser.name}</span>
              <Badge className={`${roleInfo.color} text-white text-xs border-0`}>
                {roleInfo.label}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Pending Review Alert for Editors/Admins */}
      {canReview && pendingArticles > 0 && (
        <Card className="mb-6 border-orange-500/50 bg-orange-500/10">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{pendingArticles} articles pending review</p>
              <p className="text-sm text-muted-foreground">New submissions are waiting for your approval</p>
            </div>
            <a href="/admin/articles" className="text-sm text-primary hover:underline">
              Review Now →
            </a>
          </CardContent>
        </Card>
      )}

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
        <h2 className="font-display text-lg font-semibold mb-4">
          {canViewFullDashboard ? 'Recent Articles' : 'Your Recent Articles'}
        </h2>
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
