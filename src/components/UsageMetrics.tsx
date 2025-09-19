'use client';

import { Calendar, Clock, MessageSquare, Phone, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

type UsageData = {
  aiCalls: number;
  appointmentBookings: number;
  smsReminders: number;
  voiceMinutes: number;
  customers: number;
};

type UsageMetricsProps = {
  currentPlan: (typeof PLAN_ID)[keyof typeof PLAN_ID];
  usage: UsageData;
};

export const UsageMetrics = ({ currentPlan, usage }: UsageMetricsProps) => {
  const t = useTranslations('Usage');
  const plan = PricingPlanList[currentPlan];

  if (!plan) {
    return <div>Plan not found</div>;
  }

  const metrics = [
    {
      label: t('ai_calls'),
      icon: <Phone className="size-5" />,
      current: usage.aiCalls,
      limit: plan.features.aiCalls,
      color: 'blue',
    },
    {
      label: t('appointments'),
      icon: <Calendar className="size-5" />,
      current: usage.appointmentBookings,
      limit: plan.features.appointmentBookings,
      color: 'green',
    },
    {
      label: t('sms_reminders'),
      icon: <MessageSquare className="size-5" />,
      current: usage.smsReminders,
      limit: plan.features.smsReminders,
      color: 'purple',
      hidden: plan.features.smsReminders === 0,
    },
    {
      label: t('voice_minutes'),
      icon: <Clock className="size-5" />,
      current: usage.voiceMinutes,
      limit: plan.features.voiceMinutes,
      color: 'orange',
    },
    {
      label: t('customers'),
      icon: <Users className="size-5" />,
      current: usage.customers,
      limit: plan.features.customers,
      color: 'teal',
    },
  ].filter(metric => !metric.hidden);

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) {
      return 'bg-red-500';
    }
    if (percentage >= 75) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  const getStatusColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) {
      return 'text-red-600';
    }
    if (percentage >= 75) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const percentage = Math.min((metric.current / metric.limit) * 100, 100);

        return (
          <div key={metric.label} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-muted p-2">
                  {metric.icon}
                </div>
                <div>
                  <h3 className="font-medium">{metric.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan === PLAN_ID.TRIAL ? t('plan_trial') : t('plan_paid')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${getStatusColor(metric.current, metric.limit)}`}>
                  {metric.current.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  /
                  {' '}
                  {metric.limit.toLocaleString()}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-300 ${getProgressColor(metric.current, metric.limit)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {percentage.toFixed(0)}
                  % used
                </span>
                {percentage >= 90 && (
                  <span className="font-medium text-red-600">
                    {t('limit_warning')}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
