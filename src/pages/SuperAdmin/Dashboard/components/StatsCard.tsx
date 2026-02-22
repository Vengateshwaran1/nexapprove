import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: string;
    positive: boolean;
  };
}

const BADGE_STYLES: Record<string, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-destructive/15 text-destructive',
  info: 'bg-primary/15 text-primary',
};

const StatsCard = ({
  label,
  value,
  icon: Icon,
  badge,
  badgeVariant = 'info',
  trend,
}: StatsCardProps) => {
  return (
    <div className="sa-stats-card group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      {/* Ambient glow on hover */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
            {badge && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${BADGE_STYLES[badgeVariant]}`}
              >
                {badge}
              </span>
            )}
          </div>
          {trend && (
            <p
              className={`text-xs font-medium ${trend.positive ? 'text-success' : 'text-destructive'}`}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
