import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const STATS = [
  {
    label: 'Pending Approvals',
    value: '12',
    icon: ClipboardList,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/10',
    trend: '+2 new today',
    trendUp: true,
  },
  {
    label: 'My Open Requests',
    value: '5',
    icon: FileText,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    trend: 'No change since yesterday',
    trendUp: null,
  },
  {
    label: 'Average Review Time',
    value: '4.2 hrs',
    icon: Clock,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    trend: '-15% faster',
    trendUp: false,
  },
  {
    label: 'Completed This Month',
    value: '28',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    trend: 'Target: 30',
    trendUp: null,
  },
];

const ACTION_ITEMS = [
  {
    id: 'REQ-9402',
    title: 'Q4 Marketing Budget',
    requester: 'Alex Morgan',
    requesterInitials: 'AM',
    requesterColor: 'from-violet-500 to-purple-400',
    timeAgo: '2h ago',
    priority: 'URGENT' as const,
  },
  {
    id: 'REQ-9381',
    title: 'MacBook Pro Replacement',
    requester: 'Linda Smith',
    requesterInitials: 'LS',
    requesterColor: 'from-emerald-500 to-teal-400',
    timeAgo: '5h ago',
    priority: 'STANDARD' as const,
  },
  {
    id: 'REQ-9220',
    title: 'SaaS Renewal: Zoom Enterprise',
    requester: 'David Kim',
    requesterInitials: 'DK',
    requesterColor: 'from-blue-500 to-indigo-400',
    timeAgo: 'Yesterday',
    priority: 'STANDARD' as const,
  },
];

const RECENT_UPDATES = [
  {
    title: 'Travel Reimbursement #902',
    detail: 'Approved by Finance Dept.',
    time: '10 mins ago',
    dotColor: 'bg-emerald-500',
    detailColor: 'text-emerald-500',
  },
  {
    title: 'Annual Leave Request',
    detail: 'Sent to Manager for review',
    time: '1 hour ago',
    dotColor: 'bg-blue-500',
    detailColor: 'text-blue-500',
  },
  {
    title: 'Office Furniture Order',
    detail: 'Clarification requested by Ops',
    time: '4 hours ago',
    dotColor: 'bg-orange-400',
    detailColor: 'text-orange-400',
  },
  {
    title: 'Software License #812',
    detail: 'Completed successfully',
    time: 'Yesterday',
    dotColor: 'bg-muted-foreground/40',
    detailColor: 'text-muted-foreground',
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
const UserDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const firstName = user?.firstName ?? 'there';

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Today is {today}. You have 3 tasks requiring attention.
        </p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <span className={`rounded-lg p-2 ${stat.iconBg}`}>
                <stat.icon className={`size-5 ${stat.iconColor}`} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
            {stat.trend && (
              <p
                className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
                  stat.trendUp === true
                    ? 'text-emerald-500'
                    : stat.trendUp === false
                      ? 'text-emerald-500'
                      : 'text-muted-foreground'
                }`}
              >
                {stat.trendUp === true && <TrendingUp className="size-3" />}
                {stat.trendUp === false && <TrendingDown className="size-3" />}
                {stat.trend}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom Section ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Action Required Table */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Action Required</h2>
            <button
              onClick={() => navigate('/user/approvals')}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="size-3" />
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-3 border-b border-border/50">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              Request Details
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 w-28 text-center">
              Requester
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 w-20 text-center">
              Date
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 w-20 text-center">
              Status
            </span>
            <span className="w-20" />
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border/50">
            {ACTION_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 hover:bg-accent/40 transition-colors"
              >
                {/* Request details */}
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">ID: #{item.id}</p>
                </div>

                {/* Requester */}
                <div className="flex items-center gap-2 w-28">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${item.requesterColor} text-[10px] font-bold text-white`}
                  >
                    {item.requesterInitials}
                  </div>
                  <span className="text-xs font-medium text-foreground truncate max-w-[70px]">
                    {item.requester}
                  </span>
                </div>

                {/* Date */}
                <span className="text-xs text-muted-foreground w-20 text-center">
                  {item.timeAgo}
                </span>

                {/* Priority badge */}
                <div className="w-20 flex justify-center">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      item.priority === 'URGENT'
                        ? 'bg-amber-500/15 text-amber-500'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 w-20 justify-end">
                  <button className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-colors">
                    Reject
                  </button>
                  <div
                    className={`h-6 w-1.5 rounded-full ${
                      item.priority === 'URGENT' ? 'bg-amber-500' : 'bg-primary'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Recent Updates</h2>
            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <MoreVertical className="size-4" />
            </button>
          </div>

          <div className="divide-y divide-border/50">
            {RECENT_UPDATES.map((update, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-4">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${update.dotColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground">{update.time}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{update.title}</p>
                  <p className={`text-xs font-medium mt-0.5 ${update.detailColor}`}>
                    {update.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-border">
            <button
              onClick={() => navigate('/user/submissions')}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View Full Submission History
              <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
