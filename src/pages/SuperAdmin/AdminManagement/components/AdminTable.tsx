import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import type { UserListItem } from '@/services/api/user.service';

/* ─── Badge Styles ────────────────────────────────────────────────────────── */
const LEVEL_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  SUPER_ADMIN: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Super Admin' },
  ORG_ADMIN: { bg: 'bg-primary/15', text: 'text-primary', label: 'Org Admin' },
  USER: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'User' },
};

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  active: { dot: 'bg-success', label: 'Active' },
  inactive: { dot: 'bg-muted-foreground', label: 'Inactive' },
};

/* ─── Component ───────────────────────────────────────────────────────────── */
interface AdminTableProps {
  users: UserListItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const AdminTable = ({
  users,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: AdminTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const startIdx = (currentPage - 1) * 10 + 1;
  const endIdx = Math.min(currentPage * 10, totalItems);

  const getInitials = (first: string, last: string) =>
    `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `Joined ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-accent/30">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Organization
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const level = LEVEL_STYLES[u.systemRole] ?? LEVEL_STYLES['USER'];
                const status = u.isActive ? STATUS_STYLES['active'] : STATUS_STYLES['inactive'];

                return (
                  <tr key={u.id} className="group transition-colors hover:bg-accent/20">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary/80 to-blue-400 text-xs font-bold text-white shadow-md">
                          {getInitials(u.firstName, u.lastName)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatDate(u.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{u.email}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {u.organization?.name ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ${level.bg} ${level.text}`}
                      >
                        {level.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                        <span className="text-muted-foreground">{status.label}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          <MoreVertical className="size-4" />
                        </button>

                        {openMenuId === u.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/50">
                                <Eye className="size-3.5" />
                                View
                              </button>
                              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/50">
                                <Edit className="size-3.5" />
                                Edit
                              </button>
                              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10">
                                <Trash2 className="size-3.5" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between border-t border-border/50 px-5 py-3.5">
        <p className="text-xs text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">{totalItems > 0 ? startIdx : 0}</span> to{' '}
          <span className="font-semibold text-foreground">{endIdx}</span> of{' '}
          <span className="font-semibold text-foreground">{totalItems.toLocaleString()}</span> users
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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

          {totalPages > 5 && (
            <>
              <span className="px-1 text-xs text-muted-foreground">…</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {totalPages}
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

export default AdminTable;
