// This layout has been removed to allow public access to /admin route
// Admin protection is now only applied to specific admin routes like /sys-control
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
