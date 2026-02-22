import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Loader2,
  UploadCloud,
  FileSpreadsheet,
  XCircle,
  Download,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { organizationService, type BulkInviteResult } from '@/services/api/organization.service';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const BulkImportDialog = ({ open, onOpenChange, onSuccess }: BulkImportDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<BulkInviteResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFile(null);
      setReport(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (
        selected.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selected.name.endsWith('.xlsx')
      ) {
        setFile(selected);
      } else {
        toast.error('Please upload a valid .xlsx file.');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setReport(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('No file selected');
      return;
    }

    setLoading(true);

    try {
      const res = await organizationService.bulkInviteExcel(file);
      setReport(res);
      if (res.created > 0) {
        onSuccess();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to bulk import users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await organizationService.downloadTemplate();
      toast.success('Template downloaded successfully');
    } catch {
      toast.error('Failed to download template');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sa-dialog max-w-md border-border/50 bg-card p-0 shadow-2xl sm:rounded-2xl">
        <div className="border-b border-border/50 bg-accent/30 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              {report ? 'Import Report' : 'Bulk Import Users'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {report
                ? 'Review the results of your bulk upload below.'
                : 'Upload an Excel (.xlsx) file containing user rows.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {report ? (
          <div className="px-6 py-6 space-y-5">
            <div className="flex items-center gap-4 bg-accent/20 rounded-xl p-4 border border-border">
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold text-success flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-5" />
                  {report.created}
                </p>
                <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                  Successfully Imported
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex-1 text-center">
                <p
                  className={`text-2xl font-bold flex items-center justify-center gap-2 ${report.failed > 0 ? 'text-destructive' : 'text-muted-foreground'}`}
                >
                  {report.failed > 0 && <AlertCircle className="size-5" />}
                  {report.failed}
                </p>
                <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                  Failed to Import
                </p>
              </div>
            </div>

            {report.errors && report.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Error Details</h4>
                <div className="max-h-[200px] overflow-y-auto rounded-xl border border-destructive/20 bg-destructive/5 p-3 space-y-2 !scrollbar-thin !scrollbar-thumb-destructive/20 focus:outline-none">
                  {report.errors.map((err, i) => (
                    <div
                      key={i}
                      className="text-sm flex flex-col gap-0.5 pb-2 border-b border-destructive/10 last:border-0 last:pb-0"
                    >
                      <span className="font-medium text-destructive truncate">
                        {err.email || 'Unknown Email'}
                      </span>
                      <span className="text-xs text-destructive/80">{err.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
              >
                Close & Continue
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            <div className="rounded-xl border border-dashed border-border p-6 text-center hover:bg-accent/10 transition-colors">
              {!file ? (
                <div
                  className="cursor-pointer space-y-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <UploadCloud className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Click to browse or drag & drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Required headers: email, firstName, lastName, department, role, region
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="size-5 text-emerald-500" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                  >
                    <XCircle className="size-5" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Download className="size-4" />
                Download Template
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="sa-btn-primary inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {loading ? 'Importing...' : 'Upload & Import'}
                </button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportDialog;
