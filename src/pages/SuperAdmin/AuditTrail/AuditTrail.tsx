import { useState } from 'react';
import { RefreshCw, Download, Activity, AlertTriangle, Wifi, Clock } from 'lucide-react';

import StatsCard from '../Dashboard/components/StatsCard';
import AuditFilterBar from './components/AuditFilterBar';
import AuditEventTable, { type AuditEvent } from './components/AuditEventTable';
import IntegrityCard from './components/IntegrityCard';

/* ─── Mock Events ─────────────────────────────────────────────────────────── */
const MOCK_EVENTS: AuditEvent[] = [
  {
    id: '1',
    timestamp: '2023-10-27 10:45:02',
    traceId: '0x3…8a61…3a23',
    userName: 'Alex Smith',
    userEmail: 'alex@enterprise.com',
    userAvatar: 'AS',
    organization: 'Finance Hub',
    category: 'SECURITY',
    result: 'success',
    integrity: 'VERIFIED',
  },
  {
    id: '2',
    timestamp: '2023-10-27 10:42:15',
    traceId: '0x7…6bc2…481f',
    userName: 'system_bot',
    userEmail: 'system@nexapprove',
    userAvatar: 'SB',
    organization: 'Global Ops',
    category: 'WORKFLOW',
    result: 'success',
    integrity: 'VERIFIED',
  },
  {
    id: '3',
    timestamp: '2023-10-27 10:40:08',
    traceId: '0x1…d41e…9f03',
    userName: 'Jane Doe',
    userEmail: 'jane@enterprise.com',
    userAvatar: 'JD',
    organization: 'HR Portal',
    category: 'HIERARCHY',
    result: 'warning',
    integrity: 'PENDING',
  },
  {
    id: '4',
    timestamp: '2023-10-27 10:38:22',
    traceId: '0x9…a2f7…cc18',
    userName: 'Admin Root',
    userEmail: 'admin@nexapprove',
    userAvatar: 'AR',
    organization: 'System',
    category: 'SECURITY',
    result: 'success',
    integrity: 'VERIFIED',
  },
  {
    id: '5',
    timestamp: '2023-10-27 10:35:10',
    traceId: '0x2…b3c8…7d41',
    userName: 'Mark Vance',
    userEmail: 'mark@enterprise.com',
    userAvatar: 'MV',
    organization: 'R&D Alpha',
    category: 'WORKFLOW',
    result: 'success',
    integrity: 'VERIFIED',
  },
];

const AuditTrail = () => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedResult, setSelectedResult] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Security & Compliance
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Global Audit Trail
          </h1>
          <p className="text-sm text-muted-foreground">
            Centralized, immutable ledger of all activities across the enterprise ecosystem. Data
            integrity is cryptographically verified in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="sa-btn-secondary inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent">
            <RefreshCw className="size-4" />
            Refresh Logs
          </button>
          <button className="sa-btn-primary inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg">
            <Download className="size-4" />
            Export for Compliance
          </button>
        </div>
      </div>

      {/* Stats + Integrity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Events (24h)"
          value="1,248,302"
          icon={Activity}
          badge="+15%"
          badgeVariant="success"
        />
        <StatsCard label="Security Flags" value="14" icon={AlertTriangle} badgeVariant="danger" />
        <StatsCard
          label="Sync Status"
          value="99.98%"
          icon={Wifi}
          badge="Online"
          badgeVariant="success"
        />
        <IntegrityCard
          status="Verified"
          lastCheck="Last Check: 2 min ago"
          hashPreview="0xA3…D9F2"
        />
      </div>

      {/* Filters + Time Range */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AuditFilterBar
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedResult={selectedResult}
          setSelectedResult={setSelectedResult}
        />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>Last 24 Hours</span>
        </div>
      </div>

      {/* Event Table */}
      <AuditEventTable
        events={MOCK_EVENTS}
        currentPage={currentPage}
        totalPages={24000}
        totalItems={1248302}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AuditTrail;
