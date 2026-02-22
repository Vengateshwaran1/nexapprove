import { ChevronDown } from 'lucide-react';

interface FilterBarProps {
  selectedOrg: string;
  setSelectedOrg: (v: string) => void;
  selectedRole: string;
  setSelectedRole: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
}

const FilterBar = ({
  selectedOrg,
  setSelectedOrg,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Org Filter */}
      <div className="relative">
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="sa-filter-select h-9 appearance-none rounded-lg border border-border bg-accent/30 py-1.5 pl-3 pr-8 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Organizations</option>
          <option value="finance">Finance Dept.</option>
          <option value="it">IT Infrastructure</option>
          <option value="hr">Human Resources</option>
          <option value="engineering">Engineering</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Role Filter */}
      <div className="relative">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="sa-filter-select h-9 appearance-none rounded-lg border border-border bg-accent/30 py-1.5 pl-3 pr-8 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Roles</option>
          <option value="global_admin">Global Admin</option>
          <option value="org_admin">Org Admin</option>
          <option value="user">User</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="sa-filter-select h-9 appearance-none rounded-lg border border-border bg-accent/30 py-1.5 pl-3 pr-8 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
};

export default FilterBar;
