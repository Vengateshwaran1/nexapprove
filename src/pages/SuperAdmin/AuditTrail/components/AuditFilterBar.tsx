import { ChevronDown } from 'lucide-react';

interface AuditFilterBarProps {
  selectedOrg: string;
  setSelectedOrg: (v: string) => void;
  selectedEntity: string;
  setSelectedEntity: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  selectedResult: string;
  setSelectedResult: (v: string) => void;
}

const AuditFilterBar = ({
  selectedOrg,
  setSelectedOrg,
  selectedEntity,
  setSelectedEntity,
  selectedType,
  setSelectedType,
  selectedResult,
  setSelectedResult,
}: AuditFilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Filters:
      </span>

      {/* Org */}
      <div className="relative">
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="sa-filter-select h-8 appearance-none rounded-lg border border-border bg-accent/30 py-1 pl-3 pr-7 text-xs text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Org: All Entities</option>
          <option value="finance">Finance Hub</option>
          <option value="it">IT Infrastructure</option>
          <option value="hr">HR Portal</option>
          <option value="rd">R&D Alpha</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Type */}
      <div className="relative">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="sa-filter-select h-8 appearance-none rounded-lg border border-border bg-accent/30 py-1 pl-3 pr-7 text-xs text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Type: Security, Workflow…</option>
          <option value="security">Security</option>
          <option value="workflow">Workflow</option>
          <option value="hierarchy">Hierarchy</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Result */}
      <div className="relative">
        <select
          value={selectedResult}
          onChange={(e) => setSelectedResult(e.target.value)}
          className="sa-filter-select h-8 appearance-none rounded-lg border border-border bg-accent/30 py-1 pl-3 pr-7 text-xs text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Result: All</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Entity */}
      <div className="relative">
        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="sa-filter-select h-8 appearance-none rounded-lg border border-border bg-accent/30 py-1 pl-3 pr-7 text-xs text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Entities</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
          <option value="system">System</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
};

export default AuditFilterBar;
