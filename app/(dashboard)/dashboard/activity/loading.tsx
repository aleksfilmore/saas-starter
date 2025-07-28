// File: app/(dashboard)/activity/loading.tsx

// This is the final, corrected loading skeleton for the activity page.
// It now uses the custom theme colors from your globals.css file.
export default function Loading() {
  return (
    <div>
      {/* Skeleton for the page title */}
      <div className="h-8 bg-muted rounded w-1/3 mb-6 animate-pulse"></div>
      
      {/* Skeleton for the content card */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse mt-6"></div>
        </div>
      </div>
    </div>
  );
}
