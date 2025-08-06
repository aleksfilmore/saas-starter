import type { Metadata } from 'next';
import DashboardLayoutClient from './layout-client';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
