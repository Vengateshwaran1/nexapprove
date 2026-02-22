import { useEffect, useState } from 'react';
import { Users, ShieldCheck, Building2, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { userService, type UserStats } from '@/services/api/user.service';
import StatsCard from './components/StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userService.getStats();
        setStats(data);
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          System / Dashboard
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of system health, admins, organizations, and activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Users"
          value={loading ? '…' : (stats?.totalUsers.toLocaleString() ?? '0')}
          icon={Users}
        />
        <StatsCard
          label="Super Admins"
          value={loading ? '…' : (stats?.totalAdmins.toLocaleString() ?? '0')}
          icon={ShieldCheck}
        />
        <StatsCard
          label="Organizations"
          value={loading ? '…' : (stats?.totalOrganizations.toLocaleString() ?? '0')}
          icon={Building2}
        />
        <StatsCard
          label="Pending Users"
          value={loading ? '…' : (stats?.pendingUsers.toLocaleString() ?? '0')}
          icon={Clock}
          badge={stats?.pendingUsers ? 'Action' : undefined}
          badgeVariant="warning"
        />
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="sa-panel rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Recent Activity
            </h2>
            <button className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent/30"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                >
                  <item.icon className={`size-4 ${item.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="sa-panel rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              System Health
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              All Systems Operational
            </span>
          </div>

          <div className="space-y-5">
            {SYSTEM_METRICS.map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-semibold text-foreground">{metric.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-accent/50">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Static Data (Activity & Health are placeholders until audit trail is wired) ─ */

const RECENT_ACTIVITY = [
  {
    title: 'New admin registered',
    description: 'Sarah Johnson was added as Global Admin to Finance Dept.',
    time: '2m ago',
    icon: Users,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    title: 'Organization created',
    description: 'IT Infrastructure organization was provisioned.',
    time: '15m ago',
    icon: Building2,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  {
    title: 'Security alert',
    description: 'Multiple failed login attempts detected from 192.168.1.45.',
    time: '1h ago',
    icon: ShieldCheck,
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
  {
    title: 'Pending approval',
    description: 'Mark Thompson requested Org Admin access.',
    time: '3h ago',
    icon: Clock,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
];

const SYSTEM_METRICS = [
  { label: 'API Uptime', value: 99.98, color: 'bg-linear-to-r from-success to-emerald-400' },
  { label: 'Database Health', value: 97.5, color: 'bg-linear-to-r from-primary to-blue-400' },
  { label: 'Sync Status', value: 99.88, color: 'bg-linear-to-r from-success to-emerald-400' },
  { label: 'Storage Usage', value: 64, color: 'bg-linear-to-r from-warning to-amber-400' },
];

export default Dashboard;
