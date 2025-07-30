// Wall of Wounds Test Page
'use client';

import WallOfWounds from '@/components/wall/WallOfWounds';
import AuthWrapper from '@/components/AuthWrapper';

export default function WallTestPage() {
  return (
    <AuthWrapper>
      <WallOfWounds />
    </AuthWrapper>
  );
}
