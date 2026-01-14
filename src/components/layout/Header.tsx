import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { headerMenuItems, categories } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/truthlens-logo.png';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const visibleMenuItems = headerMenuItems
    .filter(item => item.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar - Hidden on mobile for cleaner look */}
      <div className="border-b border-border bg-primary hidden sm:block">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-xs text-primary-foreground">
          <span className="font-medium">Authentic Stories. Unbiased Voices.</span>
          <div className="flex items-center gap-4">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo - Fixed sizing for mobile */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="TruthLens" 
              className="h-8 w-auto sm:h-10 md:h-12 object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {visibleMenuItems.slice(0, 9).map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  item.highlight 
                    ? 'font-semibold text-primary hover:text-primary/80' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-9 w-9"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search articles, topics, authors..."
                  className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 right-0 border-t border-border lg:hidden overflow-hidden bg-background shadow-lg z-50"
          >
            <nav className="container mx-auto flex flex-col px-4 py-4">
              {visibleMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`border-b border-border py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                    item.highlight ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
              <Link
                to="/about"
                className="border-b border-border py-3 text-sm font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/careers"
                className="border-b border-border py-3 text-sm font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className="py-3 text-sm font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
