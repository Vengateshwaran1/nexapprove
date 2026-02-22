import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ClipboardList,
  CheckCircle2,
  Search,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────────────────── */
type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Submission {
  id: string;
  workflowType: string;
  workflowSubtype: string;
  submittedOn: string;
  currentStage: number;
  totalStages: number;
  stageLabel: string;
  status: SubmissionStatus;
  stageStatuses: ('done' | 'active' | 'pending' | 'rejected')[];
}

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const SUBMISSIONS: Submission[] = [
  {
    id: 'REQ-82910',
    workflowType: 'Q3 Global Travel',
    workflowSubtype: 'Project: Horizon-24',
    submittedOn: 'Oct 24, 2023',
    currentStage: 2,
    totalStages: 3,
    stageLabel: 'Finance Review',
    status: 'PENDING',
    stageStatuses: ['done', 'active', 'pending'],
  },
  {
    id: 'REQ-82855',
    workflowType: 'MacBook Pro M3 Pro Upgrade',
    workflowSubtype: 'Asset Procurement',
    submittedOn: 'Oct 22, 2023',
    currentStage: 3,
    totalStages: 3,
    stageLabel: 'Completed',
    status: 'APPROVED',
    stageStatuses: ['done', 'done', 'done'],
  },
  {
    id: 'REQ-82712',
    workflowType: 'Dinner with Client: Acme Corp',
    workflowSubtype: 'Expense Reimbursement',
    submittedOn: 'Oct 18, 2023',
    currentStage: 1,
    totalStages: 3,
    stageLabel: 'Manager Denied',
    status: 'REJECTED',
    stageStatuses: ['rejected', 'pending', 'pending'],
  },
  {
    id: 'REQ-82601',
    workflowType: 'Annual Software Licenses',
    workflowSubtype: 'IT Procurement',
    submittedOn: 'Oct 15, 2023',
    currentStage: 1,
    totalStages: 3,
    stageLabel: 'Direct Manager',
    status: 'PENDING',
    stageStatuses: ['active', 'pending', 'pending'],
  },
];

const TOTAL = 248;

/* ─── Status Badge ────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
  const cfg = {
    PENDING: 'bg-blue-500/10 text-blue-500',
    APPROVED: 'bg-emerald-500/10 text-emerald-500',
    REJECTED: 'bg-destructive/10 text-destructive',
  }[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg}`}
    >
      {status}
    </span>
  );
};

/* ─── Progress Bar ────────────────────────────────────────────────────────── */
const ProgressHierarchy = ({
  stageStatuses,
  stageLabel,
  status,
}: {
  stageStatuses: Submission['stageStatuses'];
  stageLabel: string;
  status: SubmissionStatus;
}) => {
  const getNodeStyle = (s: Submission['stageStatuses'][number], idx: number) => {
    if (s === 'done')
      return {
        outer: 'bg-emerald-500 border-emerald-500',
        inner: 'text-white',
        content: <CheckCircle2 className="size-3.5" />,
      };
    if (s === 'rejected')
      return {
        outer: 'bg-destructive border-destructive',
        inner: 'text-white',
        content: <span className="text-[10px] font-bold">✕</span>,
      };
    if (s === 'active')
      return {
        outer: 'border-primary bg-primary',
        inner: 'text-white',
        content: <span className="text-[10px] font-bold">{idx + 1}</span>,
      };
    return {
      outer: 'border-border bg-background',
      inner: 'text-muted-foreground',
      content: <span className="text-[10px] font-bold">{idx + 1}</span>,
    };
  };

  const labelColor =
    status === 'APPROVED'
      ? 'text-emerald-500'
      : status === 'REJECTED'
        ? 'text-destructive'
        : 'text-blue-500';

  return (
    <div className="flex items-center gap-2">
      {stageStatuses.map((s, i) => {
        const node = getNodeStyle(s, i);
        return (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${node.outer} ${node.inner}`}
            >
              {node.content}
            </div>
            {i < stageStatuses.length - 1 && (
              <div
                className={`h-px w-6 ${
                  stageStatuses[i] === 'done' && stageStatuses[i + 1] !== 'pending'
                    ? 'bg-emerald-500'
                    : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
      <span className={`ml-1 text-xs font-medium ${labelColor}`}>{stageLabel}</span>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
const UserSubmissions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = SUBMISSIONS.filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.workflowType.toLowerCase().includes(search.toLowerCase()),
  );

  const totalSubmissions = 248;
  const awaitingAction = 12;
  const recentlyCompleted = 84;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className="cursor-pointer hover:text-foreground transition-colors font-medium uppercase tracking-widest"
          onClick={() => navigate('/user/dashboard')}
        >
          NexApprove
        </span>
        <span>›</span>
        <span className="uppercase tracking-widest font-medium">Submissions</span>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Submission Tracking</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage your active workflow requests in real-time.
          </p>
        </div>
        <button className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg">
          <Plus className="size-4" />
          New Submission
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-blue-500/10 p-2.5">
              <FileText className="size-5 text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-emerald-500">+12%</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Total Submissions</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{totalSubmissions}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-orange-500/10 p-2.5">
              <ClipboardList className="size-5 text-orange-500" />
            </div>
            <span className="text-xs font-semibold text-orange-400">5 Active</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Awaiting Action</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{awaitingAction}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-emerald-500/10 p-2.5">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">This Month</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Recently Completed</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{recentlyCompleted}</p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="group relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search by Request ID, type, or current stage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Workflow Type */}
          <button className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            All Workflow Types
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>

          {/* Status */}
          <button className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            Any Status
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>

          {/* More Filters */}
          <button className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            <Filter className="size-3.5" />
            More Filters
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[100px_1fr_140px_1fr_120px] gap-4 border-b border-border px-6 py-3">
          {['REQUEST ID', 'WORKFLOW TYPE', 'SUBMITTED ON', 'PROGRESS HIERARCHY', 'STATUS'].map(
            (h) => (
              <span
                key={h}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60"
              >
                {h}
              </span>
            ),
          )}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/50">
          {filtered.map((submission) => (
            <div
              key={submission.id}
              className="grid grid-cols-[100px_1fr_140px_1fr_120px] items-center gap-4 px-6 py-4 hover:bg-accent/40 transition-colors cursor-pointer group"
            >
              {/* Request ID */}
              <span className="text-sm font-semibold text-primary group-hover:underline">
                #{submission.id}
              </span>

              {/* Workflow Type */}
              <div>
                <p className="text-sm font-semibold text-foreground">{submission.workflowType}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{submission.workflowSubtype}</p>
              </div>

              {/* Submitted On */}
              <span className="text-sm text-muted-foreground">{submission.submittedOn}</span>

              {/* Progress */}
              <ProgressHierarchy
                stageStatuses={submission.stageStatuses}
                stageLabel={submission.stageLabel}
                status={submission.status}
              />

              {/* Status */}
              <StatusBadge status={submission.status} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">1-4</span> of{' '}
          <span className="font-semibold text-foreground">{TOTAL}</span> submissions
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-4" />
          </button>

          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                page === p
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(Math.min(3, page + 1))}
            disabled={page === 3}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSubmissions;
