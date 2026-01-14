import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { z } from 'zod';
import truthLensLogo from '@/assets/truthlens-logo.png';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Mock admin credentials (will be replaced with Cloud auth)
const MOCK_ADMIN_CREDENTIALS = {
  email: 'admin@truthlens.com',
  password: 'admin123'
};

// Mock admin session storage key
const ADMIN_SESSION_KEY = 'truthlens_admin_session';

// Check if admin is authenticated
export const isAdminAuthenticated = (): boolean => {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  
  try {
    const parsed = JSON.parse(session);
    // Check if session is expired (24 hours)
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// Logout function
export const adminLogout = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { email?: string; password?: string } = {};
        err.errors.forEach((e) => {
          if (e.path[0] === 'email') errors.email = e.message;
          if (e.path[0] === 'password') errors.password = e.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - will be replaced with Cloud auth
    // When connected to Cloud, this will use supabase.auth.signInWithPassword
    // and verify against a user_roles table for admin access
    if (email === MOCK_ADMIN_CREDENTIALS.email && password === MOCK_ADMIN_CREDENTIALS.password) {
      // Create mock session
      const session = {
        user: {
          id: 'admin-1',
          email: email,
          role: 'admin'
        },
        timestamp: Date.now()
      };
      
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      
      toast.success('Welcome back, Admin!');
      
      // Redirect to intended page or admin dashboard
      const from = (location.state as { from?: string })?.from || '/admin';
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <img 
                src={truthLensLogo} 
                alt="TruthLens" 
                className="h-8 mx-auto mb-2"
              />
              <CardTitle className="text-2xl font-display">Admin Portal</CardTitle>
              <CardDescription>
                Sign in to access the admin dashboard
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="admin@truthlens.com"
                    className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-destructive">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setValidationErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-destructive">{validationErrors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                <span className="font-medium">Demo credentials:</span><br />
                Email: admin@truthlens.com<br />
                Password: admin123
              </p>
            </div>

            <div className="mt-4 text-center">
              <a 
                href="/"
                className="text-sm text-primary hover:underline"
              >
                ← Back to Homepage
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Protected by enterprise-grade security.<br />
          Unauthorized access is strictly prohibited.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
