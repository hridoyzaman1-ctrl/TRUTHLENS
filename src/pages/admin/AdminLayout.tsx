import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Image, Users, Briefcase, Settings, Menu, X, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/truthlens-logo.png';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Star, label: 'Featured', path: '/admin/featured' },
  { icon: FileText, label: 'Articles', path: '/admin/articles' },
  { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
  { icon: Image, label: 'Media', path: '/admin/media' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TruthLens" className="h-8" />
            <span className="font-display font-bold text-foreground">Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/">
            <Button variant="outline" className="w-full"><LogOut className="mr-2 h-4 w-4" />Exit Admin</Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <main className="p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
