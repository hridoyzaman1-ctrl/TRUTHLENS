import { useState } from 'react';
import { Save, Newspaper, Layout, Settings2, GripVertical, X, Plus, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { articles } from '@/data/mockData';
import { featuredSettings as initialSettings } from '@/data/adminMockData';
import { toast } from 'sonner';

const AdminFeatured = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [breakingNewsIds, setBreakingNewsIds] = useState<string[]>(settings.breakingNewsIds);
  const [heroFeaturedIds, setHeroFeaturedIds] = useState<string[]>(settings.heroFeaturedIds);

  const availableArticles = articles.filter(a => a.status === 'published');

  const getArticleById = (id: string) => availableArticles.find(a => a.id === id);

  const addToBreakingNews = (id: string) => {
    if (!breakingNewsIds.includes(id) && breakingNewsIds.length < settings.maxBreakingNews) {
      setBreakingNewsIds([...breakingNewsIds, id]);
    }
  };

  const removeFromBreakingNews = (id: string) => {
    setBreakingNewsIds(breakingNewsIds.filter(i => i !== id));
  };

  const addToHeroFeatured = (id: string) => {
    if (!heroFeaturedIds.includes(id) && heroFeaturedIds.length < settings.maxHeroArticles) {
      setHeroFeaturedIds([...heroFeaturedIds, id]);
    }
  };

  const removeFromHeroFeatured = (id: string) => {
    setHeroFeaturedIds(heroFeaturedIds.filter(i => i !== id));
  };

  const handleSave = () => {
    // In a real app, this would save to database
    toast.success('Featured settings saved successfully');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      national: 'bg-blue-500',
      international: 'bg-purple-500',
      economy: 'bg-amber-500',
      environment: 'bg-emerald-500',
      technology: 'bg-cyan-500',
      sports: 'bg-green-500',
      entertainment: 'bg-fuchsia-500',
    };
    return colors[category] || 'bg-primary';
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Featured Content Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Control which articles appear in breaking news ticker and hero section
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Breaking News Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <CardTitle>Breaking News Ticker</CardTitle>
              </div>
              <Badge variant="outline">{breakingNewsIds.length}/{settings.maxBreakingNews}</Badge>
            </div>
            <CardDescription>
              Select articles to display in the breaking news ticker at the top of the page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Settings */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.breakingAutoSwipe ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <Label>Auto-swipe</Label>
                </div>
                <Switch
                  checked={settings.breakingAutoSwipe}
                  onCheckedChange={(checked) => setSettings({ ...settings, breakingAutoSwipe: checked })}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Swipe Interval: {settings.autoSwipeInterval / 1000}s
                </Label>
                <Slider
                  value={[settings.autoSwipeInterval]}
                  onValueChange={([v]) => setSettings({ ...settings, autoSwipeInterval: v })}
                  min={3000}
                  max={10000}
                  step={1000}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Max Headlines: {settings.maxBreakingNews}
                </Label>
                <Slider
                  value={[settings.maxBreakingNews]}
                  onValueChange={([v]) => setSettings({ ...settings, maxBreakingNews: v })}
                  min={3}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Selected Articles */}
            <div>
              <Label className="text-sm font-medium">Selected Breaking News</Label>
              <div className="space-y-2 mt-2">
                {breakingNewsIds.map((id, index) => {
                  const article = getArticleById(id);
                  if (!article) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="text-xs font-bold text-muted-foreground w-6">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{article.title}</p>
                        <Badge className={`${getCategoryColor(article.category)} text-white text-[10px] border-0`}>
                          {article.category}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFromBreakingNews(id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Article */}
            {breakingNewsIds.length < settings.maxBreakingNews && (
              <div>
                <Label className="text-sm text-muted-foreground">Add Article</Label>
                <Select onValueChange={addToBreakingNews}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an article to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableArticles
                      .filter(a => !breakingNewsIds.includes(a.id))
                      .map((article) => (
                        <SelectItem key={article.id} value={article.id}>
                          <span className="truncate">{article.title}</span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                <CardTitle>Hero Section</CardTitle>
              </div>
              <Badge variant="outline">{heroFeaturedIds.length}/{settings.maxHeroArticles}</Badge>
            </div>
            <CardDescription>
              Select articles to display in the main hero carousel on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Settings */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.heroAutoSwipe ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <Label>Auto-swipe</Label>
                </div>
                <Switch
                  checked={settings.heroAutoSwipe}
                  onCheckedChange={(checked) => setSettings({ ...settings, heroAutoSwipe: checked })}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Max Articles: {settings.maxHeroArticles}
                </Label>
                <Slider
                  value={[settings.maxHeroArticles]}
                  onValueChange={([v]) => setSettings({ ...settings, maxHeroArticles: v })}
                  min={3}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Selected Articles */}
            <div>
              <Label className="text-sm font-medium">Featured Hero Articles</Label>
              <div className="space-y-2 mt-2">
                {heroFeaturedIds.map((id, index) => {
                  const article = getArticleById(id);
                  if (!article) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="text-xs font-bold text-muted-foreground w-6">{index + 1}</span>
                      <img 
                        src={article.featuredImage} 
                        alt="" 
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{article.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getCategoryColor(article.category)} text-white text-[10px] border-0`}>
                            {article.category}
                          </Badge>
                          {article.hasVideo && (
                            <Badge variant="outline" className="text-[10px]">Video</Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFromHeroFeatured(id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Article */}
            {heroFeaturedIds.length < settings.maxHeroArticles && (
              <div>
                <Label className="text-sm text-muted-foreground">Add Article</Label>
                <Select onValueChange={addToHeroFeatured}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an article to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableArticles
                      .filter(a => !heroFeaturedIds.includes(a.id))
                      .map((article) => (
                        <SelectItem key={article.id} value={article.id}>
                          <span className="truncate">{article.title}</span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Info */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <CardTitle>Quick Tips</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Drag articles to reorder their display priority</li>
            <li>• Breaking news appears in the red ticker at the top of the page</li>
            <li>• Hero articles are featured in the main carousel with large images</li>
            <li>• Changes will be reflected immediately after saving</li>
            <li>• Articles with video content will show a play icon indicator</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeatured;
