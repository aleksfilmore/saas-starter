// File: app/(marketing)/layout.tsx

import { SimpleHeader } from '@/components/layout/simple-header';
import { SimpleFooter } from '@/components/layout/simple-footer';

// This layout is ONLY for pages inside the (marketing) folder.
// It adds the public header to the homepage, sign-in, and sign-up pages.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader />
      <main className="flex-1">{children}</main>
      <SimpleFooter />
    </div>
  );
}
