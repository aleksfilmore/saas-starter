// File: app/(marketing)/layout.tsx

import { PublicHeader } from '@/components/layout/public-header';

// This layout is ONLY for pages inside the (marketing) folder.
// It adds the public header to the homepage, sign-in, and sign-up pages.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PublicHeader />
      <main>{children}</main>
    </div>
  );
}
