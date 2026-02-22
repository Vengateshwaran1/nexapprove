import { useState } from 'react';
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
import { organizationService, type InviteUserPayload } from '@/services/api/organization.service';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddUserDialog = ({ open, onOpenChange, onSuccess }: AddUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InviteUserPayload>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    region: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await organizationService.inviteUser(formData);
      toast.success('User invited successfully');
      onSuccess();
      onOpenChange(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        role: '',
        region: '',
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to invite user');
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
              Add New User
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Invite a new user to your organization. They will receive an email to set their
              password.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <Label
                htmlFor="firstName"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Ex. Jane"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label
                htmlFor="lastName"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Ex. Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane.doe@organization.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <Label
                htmlFor="department"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Department
              </Label>
              <Input
                id="department"
                name="department"
                placeholder="Ex. Engineering"
                value={formData.department}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label
                htmlFor="role"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Role (Job Title)
              </Label>
              <Input
                id="role"
                name="role"
                placeholder="Ex. Software Engineer"
                value={formData.role}
                onChange={handleChange}
                required
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <Label
              htmlFor="region"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Region
            </Label>
            <Input
              id="region"
              name="region"
              placeholder="Ex. NA"
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
              Send Invitation
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
