import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  userService,
  type UpdateUserPayload,
  type UserListItem,
} from '@/services/api/user.service';

interface EditUserDialogProps {
  user: UserListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditUserDialog = ({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserPayload>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    region: '',
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department?.name || '',
        role: user.role?.name || '',
        region: user.region?.name || '',
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await userService.updateUser(user.id, formData);
      toast.success('User updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sa-dialog max-w-lg border-border/50 bg-card p-0 shadow-2xl sm:rounded-2xl">
        <div className="border-b border-border/50 bg-accent/30 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Edit User Settings
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Modify details and access attributes for {user?.firstName} {user?.lastName}.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Status Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-accent/30 p-4">
            <div>
              <Label className="text-sm font-semibold text-foreground">Account Status</Label>
              <p className="text-xs text-muted-foreground">
                Enable or temporarily suspend this account.
              </p>
            </div>
            <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <Label
                htmlFor="edit-firstName"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                First Name
              </Label>
              <Input
                id="edit-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label
                htmlFor="edit-lastName"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Last Name
              </Label>
              <Input
                id="edit-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <Label
              htmlFor="edit-email"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Email Address
            </Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <Label
                htmlFor="edit-department"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Department
              </Label>
              <Input
                id="edit-department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label
                htmlFor="edit-role"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Role
              </Label>
              <Input
                id="edit-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <Label
              htmlFor="edit-region"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Region
            </Label>
            <Input
              id="edit-region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="h-10 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
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
              disabled={loading}
              className="sa-btn-primary inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
