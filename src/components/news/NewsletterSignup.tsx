import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
}

export const NewsletterSignup = ({ variant = 'card' }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    toast.success('Successfully subscribed to newsletter!');
    setEmail('');
    setIsSubmitting(false);
    
    // Reset after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">Stay Updated</h3>
          <p className="text-sm text-primary-foreground/80">Get the latest stories in your inbox</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSubscribed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-primary-foreground"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Thanks for subscribing!</span>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              variant="secondary"
              disabled={isSubmitting}
              className="whitespace-nowrap"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
