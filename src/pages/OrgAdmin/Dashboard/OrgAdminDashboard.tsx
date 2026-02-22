import { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  Users,
  AlertTriangle,
  Activity,
  Download,
  Globe,
  Wifi,
  Server,
} from 'lucide-react';

/* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

/* ━━━ Stats Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const StatsCard = ({
  label,
  value,
  icon: Icon,
  badge,
  badgeColor = 'bg-emerald-500/15 text-emerald-400',
}: StatsCardProps) => (
  <div className="sa-stats-card group rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {badge && (
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="size-5" />
      </div>
    </div>
  </div>
);

/* ━━━ Mock Chart Data ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const LATENCY_POINTS = [4.2, 3.8, 4.5, 3.2, 3.9, 2.8, 3.1, 2.5];
const LATENCY_LABELS = ['AUG 01', 'AUG 08', 'AUG 15', 'AUG 22', 'AUG 30'];

/* ━━━ Dashboard ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const OrgAdminDashboard = () => {
  const [, setTick] = useState(0);

  // Force re-render for animation on mount
  useEffect(() => {
    const t = setTimeout(() => setTick(1), 100);
    return () => clearTimeout(t);
  }, []);

  // SVG line from latency points
  const maxVal = Math.max(...LATENCY_POINTS);
  const minVal = Math.min(...LATENCY_POINTS);
  const chartW = 500;
  const chartH = 140;
  const svgPath = LATENCY_POINTS.map((v, i) => {
    const x = (i / (LATENCY_POINTS.length - 1)) * chartW;
    const y = chartH - ((v - minVal) / (maxVal - minVal + 0.5)) * chartH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const areaPath = `${svgPath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Enterprise Insights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time overview of institutional approval cycles and system health.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Workflows" value="1,284" icon={FileText} badge="+12.5%" />
        <StatsCard
          label="Pending Approvals"
          value="218"
          icon={Clock}
          badge="43 High Priority"
          badgeColor="bg-amber-500/15 text-amber-400"
        />
        <StatsCard
          label="Active Users"
          value="856"
          icon={Users}
          badge="82% Daily Active"
          badgeColor="bg-emerald-500/15 text-emerald-400"
        />
        <StatsCard
          label="System Bottlenecks"
          value="3"
          icon={AlertTriangle}
          badge="Critical"
          badgeColor="bg-destructive/15 text-destructive"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Approval Latency Trend */}
        <div className="sa-panel rounded-2xl border border-border/50 bg-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Approval Latency Trend</h2>
              <p className="text-xs text-muted-foreground">
                Average days to completion over the last 30 days
              </p>
            </div>
            <span className="rounded-lg border border-border bg-accent/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Last 30 Days
            </span>
          </div>

          {/* SVG Chart */}
          <div className="relative h-40 w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartW} ${chartH + 10}`}
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#latencyGrad)" />
              <path
                d={svgPath}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {LATENCY_POINTS.map((v, i) => {
                const x = (i / (LATENCY_POINTS.length - 1)) * chartW;
                const y = chartH - ((v - minVal) / (maxVal - minVal + 0.5)) * chartH;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--background))"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 flex w-full justify-between px-1 text-[10px] text-muted-foreground">
              {LATENCY_LABELS.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Distribution */}
        <div className="sa-panel rounded-2xl border border-border/50 bg-card p-6 lg:col-span-2">
          <h2 className="mb-5 text-base font-semibold text-foreground">Workflow Distribution</h2>

          <div className="space-y-4">
            {DISTRIBUTION_DATA.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className={item.textColor}>{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-accent/50">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${item.barColor}`}
                    style={{ width: `${(item.value / 1042) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-accent/30 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent/50">
            <Download className="size-4" />
            Download Status Report
          </button>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="sa-panel rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
            <button className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
              View All Logs
            </button>
          </div>

          <div className="space-y-4">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent/30"
              >
                <div className="mt-1">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.dotColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{item.title}</span>
                    {item.highlight && (
                      <span className="ml-1 text-primary">#{item.highlight}</span>
                    )}{' '}
                    {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Node Map / System Status */}
        <div className="sa-panel rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="mb-5 text-base font-semibold text-foreground">Active Node Map</h2>

          {/* Map placeholder */}
          <div className="relative mb-5 flex h-40 items-center justify-center overflow-hidden rounded-xl border border-border/30 bg-accent/20">
            <div className="absolute inset-0 opacity-20">
              {/* Grid pattern */}
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#grid)"
                  className="text-muted-foreground"
                />
              </svg>
            </div>
            <div className="relative z-10 flex items-center gap-2 rounded-lg border border-primary/30 bg-background/80 px-3 py-2 backdrop-blur-sm">
              <Globe className="size-4 text-primary" />
              <span className="text-xs font-medium text-foreground">NODE: EMEA-NORTH</span>
            </div>

            {/* Blinking dots */}
            <div className="absolute bottom-4 left-1/4 z-10 flex gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
              <span
                className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                style={{ animationDelay: '0.3s' }}
              />
              <span
                className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                style={{ animationDelay: '0.6s' }}
              />
            </div>
          </div>

          {/* System stats */}
          <div className="space-y-3">
            {SYSTEM_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <stat.icon className="size-4" />
                  {stat.label}
                </div>
                <span className={`text-sm font-semibold ${stat.valueColor}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-accent/30 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent/50">
            <Activity className="size-4" />
            Generate Full Audit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Static Data ─────────────────────────────────────────────────────────── */

const DISTRIBUTION_DATA = [
  { label: 'Completed', value: 640, barColor: 'bg-emerald-500', textColor: 'text-emerald-400' },
  { label: 'In Progress', value: 312, barColor: 'bg-primary', textColor: 'text-primary' },
  { label: 'Needs Revision', value: 142, barColor: 'bg-amber-500', textColor: 'text-amber-400' },
  { label: 'Rejected', value: 90, barColor: 'bg-destructive', textColor: 'text-destructive' },
];

const RECENT_ACTIVITY = [
  {
    title: 'Workflow',
    highlight: '4032',
    action: 'Approved',
    description: 'Global Procurement Hierarchy · Finalized by VP of Finance',
    time: '12 mins ago',
    dotColor: 'bg-emerald-400',
  },
  {
    title: 'New Hierarchy Structure Deployed',
    highlight: null,
    action: '',
    description: 'Applied to "Regional Sales Operations" by Admin Wright',
    time: '1 hour ago',
    dotColor: 'bg-primary',
  },
  {
    title: 'Bottleneck Warning Issued',
    highlight: null,
    action: '',
    description: 'Legal Review stage in "M&A Protocol" has exceeded 72 hours',
    time: '3 hours ago',
    dotColor: 'bg-destructive',
  },
  {
    title: 'User Role Updated',
    highlight: null,
    action: '',
    description: 'Marcus Thorne promoted to "L3 Senior Approver"',
    time: '5 hours ago',
    dotColor: 'bg-amber-400',
  },
];

const SYSTEM_STATS = [
  { label: 'System Uptime', value: '99.98%', valueColor: 'text-emerald-400', icon: Wifi },
  { label: 'API Health', value: 'Stable', valueColor: 'text-emerald-400', icon: Server },
  { label: 'Active Sessions', value: '1,402', valueColor: 'text-foreground', icon: Users },
];

export default OrgAdminDashboard;
