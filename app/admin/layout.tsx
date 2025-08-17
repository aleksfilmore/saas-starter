import type { Metadata } from 'next';
import { AdminGuard } from '@/components/admin/AdminGuard';

export const metadata: Metadata = {
  title: 'Admin Control Panel - CTRL+ALT+BLOCK',
  description: 'System administration and analytics dashboard',
  robots: {
    index: false,
    follow: false,
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  );
}
