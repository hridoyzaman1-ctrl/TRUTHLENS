import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/truthlens-logo.png';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      {/* Newsletter Section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
            Stay Informed
          </h3>
          <p className="mt-2 text-primary-foreground/80">
            Subscribe to our newsletter for the latest stories delivered to your inbox.
          </p>
          <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border-0 bg-primary-foreground px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="TruthLens" className="h-10 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Authentic Stories. Unbiased Voices. Your trusted source for fact-based journalism.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground">Categories</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/category/national" className="text-sm text-muted-foreground hover:text-foreground">National</Link></li>
              <li><Link to="/category/international" className="text-sm text-muted-foreground hover:text-foreground">International</Link></li>
              <li><Link to="/category/economy" className="text-sm text-muted-foreground hover:text-foreground">Economy</Link></li>
              <li><Link to="/category/environment" className="text-sm text-muted-foreground hover:text-foreground">Environment</Link></li>
              <li><Link to="/category/technology" className="text-sm text-muted-foreground hover:text-foreground">Technology</Link></li>
              <li><Link to="/category/untold-stories" className="text-sm font-medium text-accent hover:text-accent/80">Untold Stories</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground">Company</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground">Contact</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>contact@truthlens.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TruthLens. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with integrity. Powered by truth.
          </p>
        </div>
      </div>
    </footer>
  );
};
