// File: app/(marketing)/layout.tsx

import { PublicHeader } from '@/components/layout/public-header';
import Footer from '@/components/layout/footer';

// This layout is ONLY for pages inside the (marketing) folder.
// It adds the public header to the homepage, sign-in, and sign-up pages.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
