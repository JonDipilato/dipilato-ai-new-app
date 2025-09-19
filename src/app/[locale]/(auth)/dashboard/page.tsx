'use client';

import { useTranslations } from 'next-intl';

import { AiCallWidget } from '@/components/AiCallWidget';
import { AppointmentWidget } from '@/components/AppointmentWidget';
import { BusinessAnalyticsWidget } from '@/components/BusinessAnalyticsWidget';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { TrialStatusBanner } from '@/components/TrialStatusBanner';
import { UsageMetrics } from '@/components/UsageMetrics';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { useUsageTracking } from '@/hooks/useUsageTracking';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');

  const { currentPlan, usage } = useUsageTracking();

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <TrialStatusBanner />

      <div className="mb-8">
        <OnboardingFlow />
      </div>

      {/* Usage Metrics */}
      <div className="mb-8">
        <UsageMetrics currentPlan={currentPlan} usage={usage} />
      </div>

      {/* Main Dashboard Widgets */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AiCallWidget />
          <AppointmentWidget />
        </div>

        {/* Business Analytics - Full Width */}
        <BusinessAnalyticsWidget />
      </div>
    </>
  );
};

export default DashboardIndexPage;
