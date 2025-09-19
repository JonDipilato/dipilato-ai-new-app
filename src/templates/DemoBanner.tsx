import Link from 'next/link';

import { StickyBanner } from '@/features/landing/StickyBanner';

export const DemoBanner = () => (
  <StickyBanner>
    Discover how Dipilato Automations helps businesses scale with AI —
    {' '}
    <Link href="/sign-up" className="font-semibold underline">Launch Your Automation Dashboard</Link>
  </StickyBanner>
);
