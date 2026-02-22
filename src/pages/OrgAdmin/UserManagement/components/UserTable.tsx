import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import type { UserListItem } from '@/services/api/user.service';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';

interface UserTableProps {
  users: UserListItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const UserTable = ({
  users,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onRefresh,
}: UserTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Dialog states
  const [editUser, setEditUser] = useState<UserListItem | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserListItem | null>(null);

  const startIdx = totalItems > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endIdx = Math.min(currentPage * 10, totalItems);

  const getInitials = (first: string, last: string) =>
    `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

  // Mocks based on screenshot given we don't have full data maps
  // In a real app we'd map role names to colors from DB/config
  const getBadgeColor = (type: string, name: string) => {
    if (type === 'role') {
      if (name.includes('Admin')) return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
      if (name.includes('Approver'))
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
      if (name.includes('Counsel'))
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/20';
      if (name.includes('Executive'))
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/20';
      return 'bg-muted/30 text-muted-foreground border border-muted/50'; // Requester
    }
    if (type === 'department') {
      return 'bg-muted/20 text-muted-foreground border border-muted/30';
    }
    if (type === 'region') {
      return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase text-[10px]';
    }
    return '';
  };

  const getStatus = (isActive: boolean) => {
    // Basic mapping: active -> Active, inactive -> Suspended (or offline based on last active, but we stick to DB isActive bool)
    return isActive
      ? { label: 'Active', dot: 'bg-success', text: 'text-success' }
      : { label: 'Suspended', dot: 'bg-destructive', text: 'text-destructive' };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-accent/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4 text-left w-12">
                <input
                  type="checkbox"
                  className="rounded-sm border-muted-foreground bg-transparent"
                />
              </th>
              <th className="px-5 py-4 text-left">User</th>
              <th className="px-5 py-4 text-left">Role</th>
              <th className="px-5 py-4 text-left">Department</th>
              <th className="px-5 py-4 text-left">Region Scope</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No users found matching the criteria.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const status = getStatus(u.isActive);
                const roleName = u.role?.name || 'Requester';
                const deptName = u.department?.name || 'Assigned Scope';
                const regionName = u.region?.name || 'GLOBAL';

                return (
                  <tr key={u.id} className="group transition-colors hover:bg-accent/20">
                    <td className="whitespace-nowrap px-5 py-4">
                      <input
                        type="checkbox"
                        className="rounded-sm border-muted-foreground bg-transparent"
                      />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-400 text-xs font-bold text-white shadow-md">
                          {getInitials(u.firstName, u.lastName)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${getBadgeColor('role', roleName)}`}
                      >
                        {roleName}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${getBadgeColor('department', '')}`}
                      >
                        {deptName}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-bold tracking-wider ${getBadgeColor('region', '')}`}
                        >
                          {regionName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        <span className={`text-[12px] font-medium ${status.text}`}>
                          {status.label}
                        </span>
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
                                <Eye className="size-3.5" /> View
                              </button>
                              <button
                                onClick={() => {
                                  setEditUser(u);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/50"
                              >
                                <Edit className="size-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteUser(u);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                              >
                                <Trash2 className="size-3.5" /> Delete
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
        <div className="flex items-center gap-6">
          <p className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {startIdx} - {endIdx}
            </span>{' '}
            of <span className="font-semibold text-foreground">{totalItems}</span> results
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rows per page:</span>
            <span className="font-semibold text-foreground">10</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
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
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>

      <EditUserDialog
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        onSuccess={onRefresh}
      />
      <DeleteUserDialog
        user={deleteUser}
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        onSuccess={onRefresh}
      />
    </div>
  );
};

export default UserTable;
