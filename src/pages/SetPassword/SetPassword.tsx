import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/api/auth.service';
import { useAuthStore } from '@/stores/auth.store';

/* ─── Password strength rules ─────────────────────────────────────────────── */
const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character (@$!%*?&)', test: (p: string) => /[@$!%*?&]/.test(p) },
];

const SetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  // Page states
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [userInfo, setUserInfo] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenError('No invitation token provided. Please check your email link.');
      setValidating(false);
      return;
    }

    const validate = async () => {
      try {
        const result = await authService.validateToken(token);
        setUserInfo({
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
        });
        setTokenValid(true);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Invalid or expired invitation token.';
        setTokenError(message);
      } finally {
        setValidating(false);
      }
    };

    validate();
  }, [token]);

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!allRulesPassed) {
      toast.error('Password does not meet all requirements');
      return;
    }
    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      // 1) Set password → get tokens
      const tokens = await authService.setPassword({ token, password, confirmPassword });
      setTokens(tokens);

      // 2) Fetch user profile
      const profile = await authService.getMe();
      setUser(profile);

      toast.success('Password set successfully! Redirecting…');

      // 3) Route based on role
      switch (profile.systemRole) {
        case 'SUPER_ADMIN':
          navigate('/super-admin/dashboard');
          break;
        case 'ORG_ADMIN':
          navigate('/org-admin/dashboard');
          break;
        default:
          navigate('/user/dashboard');
          break;
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string | string[] } } })?.response
        ?.data?.message;
      const errorText = Array.isArray(message)
        ? message[0]
        : (message ?? 'Failed to set password. Please try again.');
      toast.error(errorText);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (validating) {
    return (
      <Layout centered>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Validating your invitation…</p>
        </div>
      </Layout>
    );
  }

  // ─── Token invalid ──────────────────────────────────────────────────────────
  if (!tokenValid) {
    return (
      <Layout centered>
        <div className="w-full max-w-md">
          <div className="login-card relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
            <div className="px-8 pb-10 pt-10 sm:px-10">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="size-8 text-destructive" />
                </div>
              </div>
              <h1 className="text-center text-xl font-bold text-foreground">Invalid Invitation</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">{tokenError}</p>
              <Button className="mt-6 w-full" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── Set password form ──────────────────────────────────────────────────────
  return (
    <Layout centered>
      <div className="w-full max-w-md">
        <div className="login-card relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
          <div className="login-shimmer absolute inset-x-0 top-0 h-[2px]" />

          <div className="px-8 pb-10 pt-10 sm:px-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="size-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Set Your Password
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Welcome,{' '}
                <span className="font-medium text-foreground">
                  {userInfo?.firstName} {userInfo?.lastName}
                </span>
                ! Create a secure password for your account.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{userInfo?.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="set-password"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  New Password
                </label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="set-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-12 rounded-xl border-border bg-accent/30 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Password Rules Checklist */}
              {password.length > 0 && (
                <div className="space-y-1.5 rounded-xl border border-border/50 bg-accent/20 p-3">
                  {PASSWORD_RULES.map((rule, i) => {
                    const passed = rule.test(password);
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {passed ? (
                          <CheckCircle2 className="size-3.5 text-success" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground" />
                        )}
                        <span className={passed ? 'text-success' : 'text-muted-foreground'}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="set-confirm-password"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Confirm Password
                </label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="set-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-12 rounded-xl border-border bg-accent/30 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
                {passwordsMatch && (
                  <p className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="size-3" /> Passwords match
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting || !allRulesPassed || !passwordsMatch}
                className="login-submit-btn relative h-12 w-full rounded-xl text-sm font-semibold tracking-wide text-white transition-all active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="size-5 animate-spin" /> : 'Activate Account'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SetPassword;
