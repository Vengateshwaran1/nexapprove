import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { userService, type UserListItem } from '@/services/api/user.service';

interface DeleteUserDialogProps {
  user: UserListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteUserDialog = ({ user, open, onOpenChange, onSuccess }: DeleteUserDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await userService.deleteUser(user.id);
      toast.success('User deleted successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sa-dialog max-w-md border-border/50 bg-card p-0 shadow-2xl sm:rounded-2xl">
        <div className="p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" />
          </div>

          <DialogHeader className="mb-6">
            <DialogTitle className="text-center text-xl font-bold tracking-tight text-foreground">
              Delete User
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground mt-2">
              Are you sure you want to completely remove{' '}
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>{' '}
              from your organization? This action is permanent and cannot be reversed. All data
              associated directly with them may be orphaned.
            </DialogDescription>
          </DialogHeader>

          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground shadow-md transition-all hover:bg-destructive/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
