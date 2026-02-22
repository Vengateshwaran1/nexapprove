import { useEffect, useState, useCallback } from 'react';
import {
  Download,
  UserPlus,
  RefreshCw,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  userService,
  type UserListItem,
  type UserStats,
  type UserQueryParams,
} from '@/services/api/user.service';
import StatsCard from '../Dashboard/components/StatsCard';
import FilterBar from './components/FilterBar';
import AdminTable from './components/AdminTable';
import AddAdminDialog from './components/AddAdminDialog';

const AdminManagement = () => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: UserQueryParams = {
        page: currentPage,
        limit: 10,
      };

      if (selectedRole) {
        params.systemRole = selectedRole as UserQueryParams['systemRole'];
      }
      if (selectedStatus) {
        params.isActive = selectedStatus === 'active';
      }
      if (selectedOrg) {
        params.organizationId = selectedOrg;
      }

      const result = await userService.getUsers(params);
      setUsers(result.data);
      setTotalItems(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedRole, selectedStatus, selectedOrg]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch {
      // Stats are secondary, don't toast on failure
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh everything (called after adding an admin)
  const handleRefresh = () => {
    fetchUsers();
    fetchStats();
  };

  // Re-fetch users when filters/page change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOrg, selectedRole, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            System / Admin Management
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Admin Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage system-wide and organization-specific administrators across the institution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="sa-btn-secondary inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent">
            <Download className="size-4" />
            Export List
          </button>
          <button
            onClick={() => setAddDialogOpen(true)}
            className="sa-btn-primary inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <UserPlus className="size-4" />
            Add Admin
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Users"
          value={stats?.totalUsers.toLocaleString() ?? '…'}
          icon={Users}
        />
        <StatsCard
          label="Super Admins"
          value={stats?.totalAdmins.toLocaleString() ?? '…'}
          icon={ShieldCheck}
        />
        <StatsCard
          label="Org Admins"
          value={stats?.totalOrgAdmins.toLocaleString() ?? '…'}
          icon={Building2}
        />
        <StatsCard
          label="Pending Users"
          value={stats?.pendingUsers.toLocaleString() ?? '…'}
          icon={Clock}
          badge={stats?.pendingUsers ? 'Action' : undefined}
          badgeVariant="warning"
        />
      </div>

      {/* Filters + Refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="sa-icon-btn flex items-center gap-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        </button>
      </div>

      {/* Table */}
      <AdminTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />

      {/* Add Admin Dialog */}
      <AddAdminDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default AdminManagement;
