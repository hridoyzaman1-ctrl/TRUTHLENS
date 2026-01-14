import { useState } from 'react';
import { Save, Newspaper, Layout, Settings2, X, Play, Pause } from 'lucide-react';
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
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTouchSortable } from '@/hooks/useTouchSortable';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableArticleProps {
  id: string;
  index: number;
  article: {
    title: string;
    category: string;
    featuredImage?: string;
    hasVideo?: boolean;
  };
  showImage?: boolean;
  onRemove: () => void;
  getCategoryColor: (category: string) => string;
}

const DraggableArticle = ({ id, index, article, showImage, onRemove, getCategoryColor }: DraggableArticleProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-1.5 sm:gap-2 p-2 bg-card border border-border rounded-lg touch-manipulation',
        isDragging && 'z-50 opacity-90 shadow-lg scale-[1.02] bg-muted'
      )}
    >
      <button
        type="button"
        className={cn(
          'flex-shrink-0 p-1 rounded cursor-grab active:cursor-grabbing touch-manipulation',
          'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary',
          isDragging && 'cursor-grabbing'
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
      </button>
      <span className="text-[10px] sm:text-xs font-bold text-muted-foreground w-4 sm:w-6 flex-shrink-0">{index + 1}</span>
      {showImage && article.featuredImage && (
        <img 
          src={article.featuredImage} 
          alt="" 
          className="w-10 h-7 sm:w-12 sm:h-8 object-cover rounded flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium truncate">{article.title}</p>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Badge className={`${getCategoryColor(article.category)} text-white text-[9px] sm:text-[10px] border-0`}>
            {article.category}
          </Badge>
          {article.hasVideo && (
            <Badge variant="outline" className="text-[9px] sm:text-[10px]">Video</Badge>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0" onClick={onRemove}>
        <X className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};

const DragOverlayItem = ({ article, showImage, getCategoryColor }: { 
  article: { title: string; category: string; featuredImage?: string; hasVideo?: boolean };
  showImage?: boolean;
  getCategoryColor: (category: string) => string;
}) => (
  <div className="flex items-center gap-1.5 sm:gap-2 p-2 bg-card border-2 border-primary rounded-lg shadow-xl opacity-95">
    <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground w-4 sm:w-6 flex-shrink-0">•</span>
    {showImage && article.featuredImage && (
      <img 
        src={article.featuredImage} 
        alt="" 
        className="w-10 h-7 sm:w-12 sm:h-8 object-cover rounded flex-shrink-0"
      />
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium truncate">{article.title}</p>
      <Badge className={`${getCategoryColor(article.category)} text-white text-[9px] sm:text-[10px] border-0`}>
        {article.category}
      </Badge>
    </div>
  </div>
);

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

  // Breaking News drag-and-drop
  const breakingSortable = useTouchSortable({
    items: breakingNewsIds,
    getItemId: (id) => id,
    onReorder: (newIds) => {
      setBreakingNewsIds(newIds);
      toast.success('Breaking news order updated');
    },
  });

  // Hero drag-and-drop
  const heroSortable = useTouchSortable({
    items: heroFeaturedIds,
    getItemId: (id) => id,
    onReorder: (newIds) => {
      setHeroFeaturedIds(newIds);
      toast.success('Hero articles order updated');
    },
  });

  const getActiveArticle = (activeId: string | null) => {
    if (!activeId) return null;
    return getArticleById(activeId);
  };

  return (
    <div className="px-1 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Featured Content</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Control breaking news ticker and hero section
          </p>
        </div>
        <Button onClick={handleSave} size="sm" className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Breaking News Section */}
        <Card>
          <CardHeader className="pb-3 px-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base truncate">Breaking News</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs flex-shrink-0">{breakingNewsIds.length}/{settings.maxBreakingNews}</Badge>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Drag to reorder • Touch and hold on mobile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-6">
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

            {/* Selected Articles with Drag-and-Drop */}
            <div>
              <Label className="text-xs sm:text-sm font-medium">Selected Breaking News</Label>
              <DndContext
                sensors={breakingSortable.sensors}
                collisionDetection={closestCenter}
                onDragStart={breakingSortable.handleDragStart}
                onDragEnd={breakingSortable.handleDragEnd}
                onDragCancel={breakingSortable.handleDragCancel}
              >
                <SortableContext items={breakingNewsIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 mt-2">
                    {breakingNewsIds.map((id, index) => {
                      const article = getArticleById(id);
                      if (!article) return null;
                      return (
                        <DraggableArticle
                          key={id}
                          id={id}
                          index={index}
                          article={article}
                          onRemove={() => removeFromBreakingNews(id)}
                          getCategoryColor={getCategoryColor}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {breakingSortable.activeId && getActiveArticle(breakingSortable.activeId) && (
                    <DragOverlayItem
                      article={getActiveArticle(breakingSortable.activeId)!}
                      getCategoryColor={getCategoryColor}
                    />
                  )}
                </DragOverlay>
              </DndContext>
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
          <CardHeader className="pb-3 px-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Layout className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base truncate">Hero Section</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs flex-shrink-0">{heroFeaturedIds.length}/{settings.maxHeroArticles}</Badge>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Drag to reorder • Touch and hold on mobile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-6">
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

            {/* Selected Articles with Drag-and-Drop */}
            <div>
              <Label className="text-xs sm:text-sm font-medium">Featured Hero Articles</Label>
              <DndContext
                sensors={heroSortable.sensors}
                collisionDetection={closestCenter}
                onDragStart={heroSortable.handleDragStart}
                onDragEnd={heroSortable.handleDragEnd}
                onDragCancel={heroSortable.handleDragCancel}
              >
                <SortableContext items={heroFeaturedIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 mt-2">
                    {heroFeaturedIds.map((id, index) => {
                      const article = getArticleById(id);
                      if (!article) return null;
                      return (
                        <DraggableArticle
                          key={id}
                          id={id}
                          index={index}
                          article={article}
                          showImage
                          onRemove={() => removeFromHeroFeatured(id)}
                          getCategoryColor={getCategoryColor}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {heroSortable.activeId && getActiveArticle(heroSortable.activeId) && (
                    <DragOverlayItem
                      article={getActiveArticle(heroSortable.activeId)!}
                      showImage
                      getCategoryColor={getCategoryColor}
                    />
                  )}
                </DragOverlay>
              </DndContext>
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
            <li>• <strong>Drag articles</strong> to reorder their display priority</li>
            <li>• <strong>On mobile:</strong> Touch and hold, then drag to reorder</li>
            <li>• Breaking news appears in the red ticker at the top of the page</li>
            <li>• Hero articles are featured in the main carousel with large images</li>
            <li>• Changes will be reflected immediately after saving</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeatured;
