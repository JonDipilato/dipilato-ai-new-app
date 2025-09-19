import { useTranslations } from 'next-intl';

import { PricingCard } from '@/features/billing/PricingCard';
import { PricingFeature } from '@/features/billing/PricingFeature';
import { PricingPlanList } from '@/utils/AppConfig';

export const PricingInformation = (props: {
  buttonList: Record<string, React.ReactNode>;
}) => {
  const t = useTranslations('PricingPlan');

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
      {Object.values(PricingPlanList).map(plan => (
        <PricingCard
          key={plan.id}
          planId={plan.id}
          price={plan.price}
          interval={plan.interval}
          button={props.buttonList[plan.id]}
        >
          <PricingFeature>
            {t('feature_ai_calls', {
              number: plan.features.aiCalls,
            })}
          </PricingFeature>

          <PricingFeature>
            {t('feature_appointment_bookings', {
              number: plan.features.appointmentBookings,
            })}
          </PricingFeature>

          {plan.features.smsReminders > 0 && (
            <PricingFeature>
              {t('feature_sms_reminders', {
                number: plan.features.smsReminders,
              })}
            </PricingFeature>
          )}

          <PricingFeature>
            {t('feature_voice_minutes', {
              number: plan.features.voiceMinutes,
            })}
          </PricingFeature>

          <PricingFeature>
            {t('feature_customers', {
              number: plan.features.customers,
            })}
          </PricingFeature>

          <PricingFeature>{t('feature_calendar_integration')}</PricingFeature>
          <PricingFeature>{t('feature_crm_sync')}</PricingFeature>
          <PricingFeature>{t('feature_support')}</PricingFeature>
        </PricingCard>

      ))}
    </div>
  );
};
