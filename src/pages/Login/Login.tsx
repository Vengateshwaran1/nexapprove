import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/api/auth.service';
import { useAuthStore } from '@/stores/auth.store';

const Login = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // 1) Login → get tokens
      const tokens = await authService.login({ email, password });
      setTokens(tokens);

      // 2) Fetch user profile
      const profile = await authService.getMe();
      setUser(profile);

      toast.success('Welcome back! Redirecting…');

      // 3) Route based on role
      switch (profile.systemRole) {
        case 'SUPER_ADMIN':
          navigate('/super-admin/dashboard');
          break;
        case 'ORG_ADMIN':
          navigate('/org-admin/dashboard');
          break;
        case 'USER':
          navigate('/user/dashboard');
          break;
        default:
          navigate('/login');
          break;
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Invalid credentials. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout centered>
      <div className="w-full max-w-md">
        <div className="login-card relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
          <div className="login-shimmer absolute inset-x-0 top-0 h-[2px]" />

          <div className="px-8 pb-10 pt-10 sm:px-10">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Enterprise Login
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Access the NexApprove Workflow Engine
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Email
                </label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    className="h-12 rounded-xl border-border bg-accent/30 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Password
                  </label>
                </div>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-12 rounded-xl border-border bg-accent/30 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <label htmlFor="remember-me" className="flex cursor-pointer items-center gap-2.5">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-border bg-accent/30 accent-primary focus:ring-primary/30"
                />
                <span className="text-sm text-muted-foreground">
                  Remember this device for 30 days
                </span>
              </label>

              <Button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn relative h-12 w-full rounded-xl text-sm font-semibold tracking-wide text-white transition-all active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="size-5 animate-spin" /> : 'Sign In to Dashboard'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
