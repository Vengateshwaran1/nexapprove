import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  FileText,
  Sun,
  Moon,
  Monitor,
  User,
  Palette,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import nexApproveLogo from '@/assets/nexapprove-logo.png';
import { useAuthStore } from '@/stores/auth.store';

/* ─── Navigation Items ────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/super-admin/dashboard' },
  { label: 'Admin Management', icon: Users, to: '/super-admin/admin-management' },
  { label: 'Workflows', icon: FileText, to: '/super-admin/workflows' },
  { label: 'Organizations', icon: Building2, to: '/super-admin/organizations' },
  { label: 'Audit Trail', icon: Shield, to: '/super-admin/audit-trail' },
  { label: 'Settings', icon: Settings, to: '/super-admin/settings' },
];

/* ─── Theme options ───────────────────────────────────────────────────────── */
const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

/* ─── Layout Component ────────────────────────────────────────────────────── */
const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    clearTokens();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Build initials from the user profile
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'SA';
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Super Admin';
  const userEmail = user?.email ?? 'admin@nexapprove.com';

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`sa-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <img
            src={nexApproveLogo}
            alt="NexApprove"
            className="h-8 w-8 object-contain drop-shadow-lg"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">NexApprove</span>
          <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Super Admin
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sa-nav-link group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'sa-nav-active bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <Icon className="size-[18px] shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
            © {new Date().getFullYear()} NexApprove
          </p>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sa-topbar flex items-center gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md sm:px-6">
          {/* Mobile hamburger */}
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {/* Search */}
          <div className="sa-search-box group relative hidden flex-1 sm:block sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Quick search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-accent/30 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <button className="sa-icon-btn relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>

            {/* ── Profile Dropdown (shadcn) ── */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="sa-user-menu flex items-center gap-2 rounded-xl px-3 py-1.5 transition-colors hover:bg-accent focus-visible:outline-none">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-blue-400 text-xs font-bold text-white shadow-md">
                    {initials}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium text-foreground">{fullName}</p>
                    <p className="text-[11px] text-muted-foreground">{userEmail}</p>
                  </div>
                  <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 rounded-xl p-0">
                {/* User Info Header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-blue-400 text-sm font-bold text-white shadow-md">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                    <span className="mt-0.5 inline-block rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Super Admin
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Navigation items */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                    onSelect={() => navigate('/super-admin/settings')}
                  >
                    <User className="size-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                    onSelect={() => navigate('/super-admin/settings')}
                  >
                    <Settings className="size-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Theme Sub-menu */}
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer gap-3 rounded-lg px-3 py-2.5">
                      <Palette className="size-4" />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="rounded-xl">
                      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem
                          key={value}
                          className="cursor-pointer gap-3 rounded-lg px-3 py-2"
                          onSelect={() => setTheme(value)}
                        >
                          <Icon className="size-4" />
                          {label}
                          {theme === value && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                  onSelect={handleLogout}
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="sa-main-content flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
