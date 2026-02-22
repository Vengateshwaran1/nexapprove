import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  FileText,
  Shield,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Monitor,
  User,
  Palette,
  Plus,
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
const MAIN_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/org-admin/dashboard' },
  { label: 'Hierarchy', icon: GitBranch, to: '/org-admin/hierarchy' },
  { label: 'User Management', icon: Users, to: '/org-admin/user-management' },
  { label: 'Workflows', icon: FileText, to: '/org-admin/workflows' },
];

const SYSTEM_NAV = [
  { label: 'Audit Logs', icon: Shield, to: '/org-admin/audit-logs' },
  { label: 'Settings', icon: Settings, to: '/org-admin/settings' },
];

/* ─── Theme options ───────────────────────────────────────────────────────── */
const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

/* ─── Layout Component ────────────────────────────────────────────────────── */
const OrgAdminLayout = () => {
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

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'OA';
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Org Admin';
  const userEmail = user?.email ?? 'admin@organization.com';

  const renderNavItems = (items: typeof MAIN_NAV) =>
    items.map(({ label, icon: Icon, to }) => (
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
    ));

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
          <span className="ml-auto rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-500">
            Org Admin
          </span>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Main Menu
          </p>
          <div className="space-y-1">{renderNavItems(MAIN_NAV)}</div>

          <p className="mb-2 mt-6 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            System
          </p>
          <div className="space-y-1">{renderNavItems(SYSTEM_NAV)}</div>
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

          {/* Breadcrumb */}
          <div className="hidden text-sm text-muted-foreground sm:block">
            <span className="font-medium text-foreground">Dashboard</span>
            <span className="mx-1.5">›</span>
            <span>Overview</span>
          </div>

          {/* Search */}
          <div className="sa-search-box group relative hidden flex-1 sm:block sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search workflows, users, or reports…"
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

            {/* New Workflow */}
            <button className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:inline-flex">
              <Plus className="size-4" />
              New Workflow
            </button>

            {/* ── Profile Dropdown ── */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="sa-user-menu flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-accent focus-visible:outline-none">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-400 text-xs font-bold text-white shadow-md">
                    {initials}
                  </div>
                  <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 rounded-xl p-0">
                {/* User Info Header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-400 text-sm font-bold text-white shadow-md">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                    <span className="mt-0.5 inline-block rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                      Org Admin
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                    onSelect={() => navigate('/org-admin/settings')}
                  >
                    <User className="size-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 rounded-lg px-3 py-2.5"
                    onSelect={() => navigate('/org-admin/settings')}
                  >
                    <Settings className="size-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

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

export default OrgAdminLayout;
