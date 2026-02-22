import { Filter, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  selectedDept,
  setSelectedDept,
  selectedRegion,
  setSelectedRegion,
  selectedStatus,
  setSelectedStatus,
  onRefresh,
  loading,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 sm:max-w-xs">
        <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter by name, email or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-accent/30 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Selects & Refresh */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Role Select */}
        <div className="flex items-center rounded-lg border border-border bg-accent/30 px-3 py-1.5">
          <span className="mr-2 text-xs font-semibold text-muted-foreground">Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="System Admin">System Admin</option>
            <option value="Finance Approver">Finance Approver</option>
          </select>
        </div>

        {/* Dept Select */}
        <div className="flex items-center rounded-lg border border-border bg-accent/30 px-3 py-1.5">
          <span className="mr-2 text-xs font-semibold text-muted-foreground">Dept:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-primary outline-none cursor-pointer"
          >
            <option value="">All Departments</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Finance & Ops">Finance & Ops</option>
          </select>
        </div>

        {/* Region Select */}
        <div className="flex items-center rounded-lg border border-border bg-accent/30 px-3 py-1.5">
          <span className="mr-2 text-xs font-semibold text-muted-foreground">Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-primary outline-none cursor-pointer"
          >
            <option value="">Global</option>
            <option value="EMEA">EMEA</option>
            <option value="APAC">APAC</option>
          </select>
        </div>

        {/* Status Select */}
        <div className="flex items-center rounded-lg border border-border bg-accent/30 px-3 py-1.5">
          <span className="mr-2 text-xs font-semibold text-muted-foreground">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-success outline-none cursor-pointer"
          >
            <option value="">Any</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="h-6 w-px bg-border/50 mx-1" />

        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
