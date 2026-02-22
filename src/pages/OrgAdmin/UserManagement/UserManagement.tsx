import { useEffect, useState, useCallback } from 'react';
import { UserPlus, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

import { userService, type UserListItem, type UserQueryParams } from '@/services/api/user.service';
import FilterBar from './components/FilterBar';
import UserTable from './components/UserTable';
import AddUserDialog from './components/AddUserDialog';
import BulkImportDialog from './components/BulkImportDialog';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Fetch users within org
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: UserQueryParams = {
        page: currentPage,
        limit: 10,
        systemRole: 'USER', // Only show ordinary users in Org Admin's scope for User Management by default
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedStatus === 'active') params.isActive = true;
      if (selectedStatus === 'inactive') params.isActive = false;
      // In a fully implemented backend, we would pass role, dept, region names or IDs
      // but the API supports basic items for now so we'll pass search.

      const result = await userService.getUsers(params);
      setUsers(result.data);
      setTotalItems(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedStatus]);

  // Re-fetch users on filter changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedRole, selectedDept, selectedRegion]);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            User & Role Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure institutional access hierarchy, regional scopes, and functional roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkOpen(true)}
            className="sa-btn-secondary inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:border-border/80"
          >
            <FileSpreadsheet className="size-4" />
            Bulk Import
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="sa-btn-primary inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <UserPlus className="size-4" />
            Add New User
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onRefresh={fetchUsers}
        loading={loading}
      />

      {/* Main Table */}
      <UserTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onRefresh={fetchUsers}
      />

      {/* Modals */}
      <AddUserDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSuccess={fetchUsers} />
      <BulkImportDialog open={isBulkOpen} onOpenChange={setIsBulkOpen} onSuccess={fetchUsers} />
    </div>
  );
};

export default UserManagement;
