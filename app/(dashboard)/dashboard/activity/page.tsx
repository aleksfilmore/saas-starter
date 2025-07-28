// File: app/(dashboard)/activity/page.tsx

'use client';

// This is the final, styled placeholder for the activity page.
// It now uses the custom theme colors from your globals.css file.
export default function ActivityPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-4">Your Activity</h1>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-muted-foreground">
          This is where your recent activity, such as completed rituals and unlocked badges, will be displayed. This feature is coming soon!
        </p>
      </div>
    </div>
  );
}
