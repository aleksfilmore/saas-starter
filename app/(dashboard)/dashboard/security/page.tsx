// File: app/(dashboard)/security/page.tsx

'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, Loader2 } from 'lucide-react';
// This is the fix: Import both the functions and the type from the actions file.
import { updatePassword, deleteAccount, type ActionResult } from './actions';

// This is the fix: We explicitly type 'initialState' with the imported 'ActionResult' type.
const initialState: ActionResult = {
  error: null,
  success: null,
};

export default function SecurityPage() {
  // The hooks are now correctly typed, resolving the overload errors.
  const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, initialState);
  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteAccount, initialState);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Security Settings</h1>
      
      {/* Update Password Card */}
      <div className="bg-card p-6 rounded-lg border border-border mb-8">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Update Password</h2>
        <form className="space-y-4" action={passwordAction}>
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="mt-1"
            />
          </div>

          {passwordState?.error && <p className="text-sm text-destructive">{passwordState.error}</p>}
          {/* This is the fix: Using the 'accent' color for success messages. */}
          {passwordState?.success && <p className="text-sm text-accent">{passwordState.success}</p>}

          <Button type="submit" disabled={isPasswordPending}>
            {isPasswordPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
            ) : (
              <><Lock className="mr-2 h-4 w-4" /> Update Password</>
            )}
          </Button>
        </form>
      </div>

      {/* Delete Account Card */}
      <div className="bg-card p-6 rounded-lg border border-destructive/50">
        <h2 className="text-xl font-semibold text-destructive mb-2">Delete Account</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        <form action={deleteAction} className="space-y-4">
          <div>
            <Label htmlFor="delete-password">Confirm Password</Label>
            <Input
              id="delete-password"
              name="password"
              type="password"
              required
              className="mt-1"
            />
          </div>
          {deleteState?.error && <p className="text-sm text-destructive">{deleteState.error}</p>}
          <Button type="submit" variant="destructive" disabled={isDeletePending}>
             {isDeletePending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 className="mr-2 h-4 w-4" /> Delete Account</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
