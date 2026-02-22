import { useState, type FormEvent } from 'react';
import { Building2, Mail, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { organizationService } from '@/services/api/organization.service';

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful submission so the parent can refresh its data. */
  onSuccess?: () => void;
}

const AddAdminDialog = ({ open, onOpenChange, onSuccess }: AddAdminDialogProps) => {
  const [orgName, setOrgName] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setOrgName('');
    setAdminFirstName('');
    setAdminLastName('');
    setAdminEmail('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!orgName.trim()) {
      toast.error('Organization name is required');
      return;
    }
    if (!adminFirstName.trim() || !adminLastName.trim()) {
      toast.error('Admin first and last name are required');
      return;
    }
    if (!adminEmail.trim()) {
      toast.error('Admin email is required');
      return;
    }

    setSubmitting(true);
    try {
      const result = await organizationService.create({
        name: orgName.trim(),
        adminEmail: adminEmail.trim(),
        adminFirstName: adminFirstName.trim(),
        adminLastName: adminLastName.trim(),
      });

      toast.success(
        `Organization "${result.organization.name}" created. Invitation sent to ${result.admin.email}`,
      );

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create organization. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            Add Organization & Admin
          </DialogTitle>
          <DialogDescription>
            Create a new organization and send an invitation to its admin. The admin will receive an
            email to set their password and activate their account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="add-org-name" className="text-xs font-medium uppercase tracking-wider">
              Organization Name
            </Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="add-org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="h-11 pl-10"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Admin Name (first + last side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="add-admin-first"
                className="text-xs font-medium uppercase tracking-wider"
              >
                First Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="add-admin-first"
                  value={adminFirstName}
                  onChange={(e) => setAdminFirstName(e.target.value)}
                  placeholder="John"
                  className="h-11 pl-10"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="add-admin-last"
                className="text-xs font-medium uppercase tracking-wider"
              >
                Last Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="add-admin-last"
                  value={adminLastName}
                  onChange={(e) => setAdminLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-11 pl-10"
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* Admin Email */}
          <div className="space-y-2">
            <Label
              htmlFor="add-admin-email"
              className="text-xs font-medium uppercase tracking-wider"
            >
              Admin Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="add-admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@acme.com"
                className="h-11 pl-10"
                disabled={submitting}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              An invitation email will be sent to this address.
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="min-w-[140px]">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating…
                </>
              ) : (
                'Create & Invite'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;
