export interface AuditEvent {
  id: string;
  timestamp: string;
  traceId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  organization: string;
  category: 'SECURITY' | 'WORKFLOW' | 'HIERARCHY';
  result: 'success' | 'warning' | 'error';
  integrity: 'VERIFIED' | 'PENDING' | 'FAILED';
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  SECURITY: { bg: 'bg-primary/15', text: 'text-primary' },
  WORKFLOW: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  HIERARCHY: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
};

const RESULT_STYLES: Record<string, { bg: string; text: string }> = {
  success: { bg: 'bg-success/15', text: 'text-success' },
  warning: { bg: 'bg-warning/15', text: 'text-warning' },
  error: { bg: 'bg-destructive/15', text: 'text-destructive' },
};

const INTEGRITY_STYLES: Record<string, { bg: string; text: string }> = {
  VERIFIED: { bg: 'bg-success/15', text: 'text-success' },
  PENDING: { bg: 'bg-warning/15', text: 'text-warning' },
  FAILED: { bg: 'bg-destructive/15', text: 'text-destructive' },
};

interface AuditEventTableProps {
  events: AuditEvent[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const AuditEventTable = ({
  events,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: AuditEventTableProps) => {
  const startIdx = (currentPage - 1) * 10 + 1;
  const endIdx = Math.min(currentPage * 10, totalItems);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-accent/30">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Timestamp (UTC)
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User Identity
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Organization
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Result
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Integrity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {events.map((event) => {
              const cat = CATEGORY_STYLES[event.category];
              const res = RESULT_STYLES[event.result];
              const integ = INTEGRITY_STYLES[event.integrity];

              return (
                <tr
                  key={event.id}
                  className="group cursor-pointer transition-colors hover:bg-accent/20"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-medium text-foreground">{event.timestamp}</p>
                    <p className="text-[11px] text-muted-foreground">TRACE: {event.traceId}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary/80 to-blue-400 text-xs font-bold text-white shadow-md">
                        {event.userAvatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{event.userName}</p>
                        <p className="text-[11px] text-muted-foreground">{event.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {event.organization}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ${cat.bg} ${cat.text}`}
                    >
                      {event.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ${res.bg} ${res.text}`}
                    >
                      {event.result.toUpperCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${integ.bg} ${integ.text}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {event.integrity}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border/50 px-5 py-3.5">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{startIdx}</span> –{' '}
          <span className="font-semibold text-foreground">{endIdx}</span> of over{' '}
          <span className="font-semibold text-foreground">{(totalItems / 1e6).toFixed(1)}M</span>{' '}
          events
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {page}
              </button>
            );
          })}

          {totalPages > 3 && (
            <>
              <span className="px-1 text-xs text-muted-foreground">…</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="h-8 w-8 rounded-lg text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                24K
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditEventTable;
