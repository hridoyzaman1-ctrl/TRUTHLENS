import { useState } from 'react';
import { Save, LayoutGrid, Eye, EyeOff, GripVertical, X, Plus, Video, TrendingUp, Clock, BookOpen, Trophy, Film, Newspaper, MessageSquare, Pen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { articles } from '@/data/mockData';
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
import { cn } from '@/lib/utils';

interface SectionConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  order: number;
  maxArticles: number;
  selectedArticleIds: string[];
  showOnHomepage: boolean;
  category?: string;
}

const defaultSections: SectionConfig[] = [
  { id: 'breaking-news', name: 'Breaking News Ticker', icon: <Newspaper className="h-4 w-4" />, enabled: true, order: 1, maxArticles: 5, selectedArticleIds: ['1', '2', '5'], showOnHomepage: true },
  { id: 'hero', name: 'Hero Section', icon: <LayoutGrid className="h-4 w-4" />, enabled: true, order: 2, maxArticles: 5, selectedArticleIds: ['1', '3', '4', '7'], showOnHomepage: true },
  { id: 'video-stories', name: 'Video Stories', icon: <Video className="h-4 w-4" />, enabled: true, order: 3, maxArticles: 4, selectedArticleIds: ['1', '3', '10', '13'], showOnHomepage: true },
  { id: 'latest-stories', name: 'Latest Stories', icon: <Clock className="h-4 w-4" />, enabled: true, order: 4, maxArticles: 6, selectedArticleIds: [], showOnHomepage: true },
  { id: 'trending', name: 'Trending Now', icon: <TrendingUp className="h-4 w-4" />, enabled: true, order: 5, maxArticles: 5, selectedArticleIds: ['1', '3', '7', '10', '13'], showOnHomepage: true },
  { id: 'comments', name: 'Reader Comments', icon: <MessageSquare className="h-4 w-4" />, enabled: true, order: 6, maxArticles: 3, selectedArticleIds: [], showOnHomepage: true },
  { id: 'internship-banner', name: 'Internship Banner', icon: <Briefcase className="h-4 w-4" />, enabled: true, order: 7, maxArticles: 0, selectedArticleIds: [], showOnHomepage: true },
  { id: 'untold-stories', name: 'Untold Stories', icon: <BookOpen className="h-4 w-4" />, enabled: true, order: 8, maxArticles: 4, selectedArticleIds: [], showOnHomepage: true, category: 'untold-stories' },
  { id: 'sports', name: 'Sports', icon: <Trophy className="h-4 w-4" />, enabled: true, order: 9, maxArticles: 4, selectedArticleIds: [], showOnHomepage: true, category: 'sports' },
  { id: 'entertainment', name: 'Entertainment', icon: <Film className="h-4 w-4" />, enabled: true, order: 10, maxArticles: 4, selectedArticleIds: [], showOnHomepage: true, category: 'entertainment' },
  { id: 'editorial', name: 'Editorial & Opinion', icon: <Pen className="h-4 w-4" />, enabled: true, order: 11, maxArticles: 4, selectedArticleIds: [], showOnHomepage: true, category: 'editorial' },
];

// Draggable Section Card Component
const DraggableSectionCard = ({ section, onToggle, onToggleHomepage, onUpdateMaxArticles, onAddArticle, onRemoveArticle, availableArticles, getCategoryColor }: {
  section: SectionConfig;
  onToggle: () => void;
  onToggleHomepage: () => void;
  onUpdateMaxArticles: (max: number) => void;
  onAddArticle: (articleId: string) => void;
  onRemoveArticle: (articleId: string) => void;
  availableArticles: typeof articles;
  getCategoryColor: (category: string) => string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sectionArticles = section.category 
    ? availableArticles.filter(a => a.category === section.category)
    : availableArticles;

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-manipulation',
        !section.enabled && 'opacity-60',
        isDragging && 'z-50 opacity-90 shadow-xl scale-[1.02]'
      )}
    >
      <CardHeader className="pb-3 px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              className={cn(
                'flex-shrink-0 p-1.5 rounded cursor-grab active:cursor-grabbing touch-manipulation',
                'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary',
                isDragging && 'cursor-grabbing'
              )}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              {section.icon}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base truncate">{section.name}</CardTitle>
              {section.category && (
                <Badge className={`${getCategoryColor(section.category)} text-white text-[9px] sm:text-[10px] border-0 mt-1`}>
                  {section.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={onToggleHomepage}
              title={section.showOnHomepage ? 'Hide from homepage' : 'Show on homepage'}
            >
              {section.showOnHomepage ? <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </Button>
            <Switch
              checked={section.enabled}
              onCheckedChange={onToggle}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-3 sm:px-6">
        {section.maxArticles > 0 && (
          <>
            <div>
              <Label className="text-xs text-muted-foreground">
                Max Articles: {section.maxArticles}
              </Label>
              <Slider
                value={[section.maxArticles]}
                onValueChange={([v]) => onUpdateMaxArticles(v)}
                min={1}
                max={10}
                step={1}
                className="mt-2"
                disabled={!section.enabled}
              />
            </div>

            <div>
              <Label className="text-xs font-medium">
                Selected Articles ({section.selectedArticleIds.length}/{section.maxArticles})
              </Label>
              <div className="space-y-1 mt-2 max-h-40 overflow-y-auto">
                {section.selectedArticleIds.map((id) => {
                  const article = availableArticles.find(a => a.id === id);
                  if (!article) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                      <span className="flex-1 truncate">{article.title}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => onRemoveArticle(id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {section.selectedArticleIds.length < section.maxArticles && section.enabled && (
              <Select onValueChange={onAddArticle}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Add article..." />
                </SelectTrigger>
                <SelectContent>
                  {sectionArticles
                    .filter(a => !section.selectedArticleIds.includes(a.id))
                    .slice(0, 20)
                    .map((article) => (
                      <SelectItem key={article.id} value={article.id}>
                        <span className="truncate">{article.title}</span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}

        {section.maxArticles === 0 && (
          <p className="text-xs text-muted-foreground">This section displays static content</p>
        )}
      </CardContent>
    </Card>
  );
};

// Drag Overlay for Sections
const SectionDragOverlay = ({ section }: { section: SectionConfig }) => (
  <Card className="opacity-95 shadow-2xl border-2 border-primary">
    <CardHeader className="pb-3 px-3 sm:px-6">
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
          {section.icon}
        </div>
        <CardTitle className="text-sm sm:text-base truncate">{section.name}</CardTitle>
      </div>
    </CardHeader>
  </Card>
);

const AdminSections = () => {
  const [sections, setSections] = useState<SectionConfig[]>(defaultSections);
  const [activeTab, setActiveTab] = useState('overview');

  const availableArticles = articles.filter(a => a.status === 'published');

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

  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const toggleHomepage = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, showOnHomepage: !s.showOnHomepage } : s
    ));
  };

  const updateMaxArticles = (id: string, max: number) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, maxArticles: max } : s
    ));
  };

  const addArticleToSection = (sectionId: string, articleId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId && !s.selectedArticleIds.includes(articleId) && s.selectedArticleIds.length < s.maxArticles) {
        return { ...s, selectedArticleIds: [...s.selectedArticleIds, articleId] };
      }
      return s;
    }));
  };

  const removeArticleFromSection = (sectionId: string, articleId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, selectedArticleIds: s.selectedArticleIds.filter(id => id !== articleId) };
      }
      return s;
    }));
  };

  const handleSave = () => {
    toast.success('All section settings saved successfully!');
  };

  // Drag-and-drop for sections reordering
  const sectionsSortable = useTouchSortable({
    items: sections,
    getItemId: (section) => section.id,
    onReorder: (newSections) => {
      const reorderedSections = newSections.map((s, index) => ({
        ...s,
        order: index + 1
      }));
      setSections(reorderedSections);
      toast.success('Section order updated');
    },
  });

  const getActiveSection = () => {
    if (!sectionsSortable.activeId) return null;
    return sections.find(s => s.id === sectionsSortable.activeId);
  };

  return (
    <div className="px-1 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Homepage Sections</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Drag sections to reorder • Touch and hold on mobile
          </p>
        </div>
        <Button onClick={handleSave} size="sm" className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-1 px-1 mb-6">
          <TabsList className="inline-flex w-auto min-w-full sm:w-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3">Overview</TabsTrigger>
            <TabsTrigger value="video-stories" className="text-xs sm:text-sm px-2 sm:px-3">Video</TabsTrigger>
            <TabsTrigger value="trending" className="text-xs sm:text-sm px-2 sm:px-3">Trending</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm px-2 sm:px-3">Categories</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <DndContext
            sensors={sectionsSortable.sensors}
            collisionDetection={closestCenter}
            onDragStart={sectionsSortable.handleDragStart}
            onDragEnd={sectionsSortable.handleDragEnd}
            onDragCancel={sectionsSortable.handleDragCancel}
          >
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {sections.map((section) => (
                  <DraggableSectionCard
                    key={section.id}
                    section={section}
                    onToggle={() => toggleSection(section.id)}
                    onToggleHomepage={() => toggleHomepage(section.id)}
                    onUpdateMaxArticles={(max) => updateMaxArticles(section.id, max)}
                    onAddArticle={(articleId) => addArticleToSection(section.id, articleId)}
                    onRemoveArticle={(articleId) => removeArticleFromSection(section.id, articleId)}
                    availableArticles={availableArticles}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {getActiveSection() && (
                <SectionDragOverlay section={getActiveSection()!} />
              )}
            </DragOverlay>
          </DndContext>
        </TabsContent>

        <TabsContent value="video-stories">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <CardTitle>Video Stories Management</CardTitle>
              </div>
              <CardDescription>
                Select which video articles appear in the Video Stories section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {availableArticles.filter(a => a.hasVideo && a.videoUrl).map((article) => {
                    const isSelected = sections.find(s => s.id === 'video-stories')?.selectedArticleIds.includes(article.id);
                    return (
                      <div 
                        key={article.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg border ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
                      >
                        <img src={article.featuredImage} alt="" className="w-20 h-14 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{article.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getCategoryColor(article.category)} text-white text-[10px] border-0`}>
                              {article.category}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              <Video className="h-3 w-3 mr-1" /> Video
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addArticleToSection('video-stories', article.id);
                            } else {
                              removeArticleFromSection('video-stories', article.id);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Trending Now Management</CardTitle>
              </div>
              <CardDescription>
                Control which articles appear in the Trending Now sidebar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Currently Trending</Label>
                  <div className="space-y-2">
                    {sections.find(s => s.id === 'trending')?.selectedArticleIds.map((id, index) => {
                      const article = availableArticles.find(a => a.id === id);
                      if (!article) return null;
                      return (
                        <div key={id} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <span className="text-lg font-bold text-primary w-6">{index + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{article.title}</p>
                            <p className="text-xs text-muted-foreground">{article.views.toLocaleString()} views</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeArticleFromSection('trending', id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Add to Trending</Label>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {availableArticles
                      .filter(a => !sections.find(s => s.id === 'trending')?.selectedArticleIds.includes(a.id))
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 10)
                      .map((article) => (
                        <div key={article.id} className="flex items-center gap-2 p-2 border border-border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{article.title}</p>
                            <p className="text-xs text-muted-foreground">{article.views.toLocaleString()} views</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => addArticleToSection('trending', article.id)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-4 md:grid-cols-2">
            {sections.filter(s => s.category).map((section) => (
              <DraggableSectionCard
                key={section.id}
                section={section}
                onToggle={() => toggleSection(section.id)}
                onToggleHomepage={() => toggleHomepage(section.id)}
                onUpdateMaxArticles={(max) => updateMaxArticles(section.id, max)}
                onAddArticle={(articleId) => addArticleToSection(section.id, articleId)}
                onRemoveArticle={(articleId) => removeArticleFromSection(section.id, articleId)}
                availableArticles={availableArticles}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSections;
