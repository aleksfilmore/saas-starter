// File: app/(dashboard)/general/page.tsx

'use client';

// This is the final, styled placeholder for the general settings page.
// It now uses the custom theme colors from your globals.css file.
export default function GeneralPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">General Settings</h1>
      <div className="space-y-8">
        {/* Account Information Section */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Account Information</h2>
          <p className="text-muted-foreground">
            This is where you will be able to update your email address and manage your account settings. This feature is coming soon!
          </p>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-card p-6 rounded-lg border border-destructive/50">
          <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
          <p className="text-muted-foreground mb-4">
            This is where you will be able to delete your account and all associated data. Please be certain before proceeding.
          </p>
           <button className="bg-destructive text-destructive-foreground font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50" disabled>
            Delete Account (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
