import { ShieldCheck } from 'lucide-react';

interface IntegrityCardProps {
  status: 'Verified' | 'Pending' | 'Failed';
  lastCheck: string;
  hashPreview: string;
}

const STATUS_STYLES: Record<string, { ring: string; text: string; glow: string }> = {
  Verified: {
    ring: 'border-success shadow-success/20',
    text: 'text-success',
    glow: 'from-success/20 to-transparent',
  },
  Pending: {
    ring: 'border-warning shadow-warning/20',
    text: 'text-warning',
    glow: 'from-warning/20 to-transparent',
  },
  Failed: {
    ring: 'border-destructive shadow-destructive/20',
    text: 'text-destructive',
    glow: 'from-destructive/20 to-transparent',
  },
};

const IntegrityCard = ({ status, lastCheck, hashPreview }: IntegrityCardProps) => {
  const style = STATUS_STYLES[status];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5">
      {/* Background glow */}
      <div
        className={`absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-radial ${style.glow} blur-3xl`}
      />

      <div className="relative">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Integrity Check
        </p>

        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg ${style.ring}`}
          >
            <ShieldCheck className={`size-7 ${style.text}`} />
          </div>
          <div>
            <p className={`text-xl font-bold ${style.text}`}>{status}</p>
            <p className="text-[11px] text-muted-foreground">CRYPTOGRAPHIC HASH {hashPreview}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{lastCheck}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrityCard;
