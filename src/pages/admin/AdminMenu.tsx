import { useState } from 'react';
import { Save, Menu, Plus, Trash2, GripVertical, Eye, EyeOff, ExternalLink, Folder, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { headerMenuItems as initialMenuItems, categories } from '@/data/mockData';
import { MenuItem } from '@/types/news';
import { toast } from 'sonner';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    label: '',
    path: '',
    type: 'page',
    isVisible: true,
    highlight: false,
    icon: ''
  });

  const toggleVisibility = (id: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    ));
  };

  const toggleHighlight = (id: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, highlight: !item.highlight } : item
    ));
  };

  const updateItem = (id: string, field: keyof MenuItem, value: string | boolean) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const deleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success('Menu item deleted');
  };

  const addNewItem = () => {
    if (!newItem.label || !newItem.path) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      label: newItem.label,
      path: newItem.path,
      type: newItem.type as 'category' | 'page' | 'external',
      isVisible: newItem.isVisible ?? true,
      order: menuItems.length + 1,
      highlight: newItem.highlight,
      icon: newItem.icon
    };

    setMenuItems([...menuItems, newMenuItem]);
    setNewItem({ label: '', path: '', type: 'page', isVisible: true, highlight: false, icon: '' });
    setIsAddDialogOpen(false);
    toast.success('Menu item added successfully');
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = menuItems.findIndex(item => item.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === menuItems.length - 1)) {
      return;
    }
    
    const newItems = [...menuItems];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    
    // Update order values
    newItems.forEach((item, i) => {
      item.order = i + 1;
    });
    
    setMenuItems(newItems);
  };

  const handleSave = () => {
    toast.success('Menu settings saved successfully!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'category': return <Folder className="h-4 w-4" />;
      case 'external': return <ExternalLink className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Header Menu Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Add, edit, reorder, or remove menu items from the header navigation
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Create a new navigation link for the header menu
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Label *</Label>
                  <Input
                    value={newItem.label}
                    onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                    placeholder="e.g., About Us"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Path/URL *</Label>
                  <Input
                    value={newItem.path}
                    onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                    placeholder="e.g., /about or https://..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={newItem.type} 
                    onValueChange={(v) => setNewItem({ ...newItem, type: v as 'category' | 'page' | 'external' })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="page">Internal Page</SelectItem>
                      <SelectItem value="external">External Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Icon (emoji, optional)</Label>
                  <Input
                    value={newItem.icon}
                    onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                    placeholder="e.g., 🎓 or 📰"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Highlight (colored text)</Label>
                  <Switch
                    checked={newItem.highlight}
                    onCheckedChange={(v) => setNewItem({ ...newItem, highlight: v })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={addNewItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Menu Items List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-primary" />
                <CardTitle>Menu Items</CardTitle>
              </div>
              <CardDescription>
                Drag to reorder, toggle visibility, or edit menu items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {menuItems.sort((a, b) => a.order - b.order).map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg border ${item.isVisible ? 'border-border bg-card' : 'border-dashed border-muted bg-muted/30 opacity-60'}`}
                  >
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                      >
                        ▲
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={index === menuItems.length - 1}
                      >
                        ▼
                      </Button>
                    </div>
                    
                    <span className="text-sm font-bold text-muted-foreground w-6">{index + 1}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.icon && <span>{item.icon}</span>}
                        <Input
                          value={item.label}
                          onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                          className="h-8 font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(item.type)}
                        <Input
                          value={item.path}
                          onChange={(e) => updateItem(item.id, 'path', e.target.value)}
                          className="h-7 text-xs text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={item.type === 'category' ? 'default' : item.type === 'external' ? 'secondary' : 'outline'} className="text-[10px]">
                        {item.type}
                      </Badge>
                      {item.highlight && (
                        <Badge className="bg-primary text-primary-foreground text-[10px]">highlight</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleHighlight(item.id)}
                        title="Toggle highlight"
                        className="h-8 w-8"
                      >
                        <span className={item.highlight ? 'text-primary' : 'text-muted-foreground'}>★</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(item.id)}
                        title={item.isVisible ? 'Hide' : 'Show'}
                        className="h-8 w-8"
                      >
                        {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add from Categories */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Add Categories</CardTitle>
              <CardDescription>
                Click to add a category to the menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.filter(c => !menuItems.some(m => m.path === `/category/${c.id}`)).map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const newMenuItem: MenuItem = {
                        id: Date.now().toString(),
                        label: category.name,
                        path: `/category/${category.id}`,
                        type: 'category',
                        isVisible: true,
                        order: menuItems.length + 1
                      };
                      setMenuItems([...menuItems, newMenuItem]);
                      toast.success(`Added ${category.name} to menu`);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
                {categories.filter(c => !menuItems.some(m => m.path === `/category/${c.id}`)).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All categories are already in the menu
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Quick Add Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'About Us', path: '/about' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'Careers', path: '/careers' },
                ].filter(p => !menuItems.some(m => m.path === p.path)).map((page) => (
                  <Button
                    key={page.path}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const newMenuItem: MenuItem = {
                        id: Date.now().toString(),
                        label: page.label,
                        path: page.path,
                        type: 'page',
                        isVisible: true,
                        order: menuItems.length + 1
                      };
                      setMenuItems([...menuItems, newMenuItem]);
                      toast.success(`Added ${page.label} to menu`);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {page.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
