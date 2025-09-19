'use client';

import { Clock, CreditCard } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useTrialStatus } from '@/hooks/useTrialStatus';

export const TrialStatusBanner = () => {
  const { isTrialActive, daysRemaining, hasTrialExpired } = useTrialStatus();

  // Don't show banner if not on trial
  if (!isTrialActive && !hasTrialExpired) {
    return null;
  }

  if (hasTrialExpired) {
    return (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-red-100 p-2">
              <Clock className="size-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Trial Expired</h3>
              <p className="text-sm text-red-700">
                Your 7-day trial has ended. Upgrade to continue using AI features.
              </p>
            </div>
          </div>
          <Link href="/dashboard/billing">
            <Button className="bg-red-600 hover:bg-red-700">
              <CreditCard className="mr-2 size-4" />
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const urgencyColor = daysRemaining <= 2 ? 'red' : daysRemaining <= 4 ? 'yellow' : 'blue';
  const bgColor = urgencyColor === 'red'
    ? 'bg-red-50 border-red-200'
    : urgencyColor === 'yellow'
      ? 'bg-yellow-50 border-yellow-200'
      : 'bg-blue-50 border-blue-200';
  const textColor = urgencyColor === 'red'
    ? 'text-red-900'
    : urgencyColor === 'yellow'
      ? 'text-yellow-900'
      : 'text-blue-900';
  const iconColor = urgencyColor === 'red'
    ? 'text-red-600'
    : urgencyColor === 'yellow'
      ? 'text-yellow-600'
      : 'text-blue-600';
  const iconBg = urgencyColor === 'red'
    ? 'bg-red-100'
    : urgencyColor === 'yellow'
      ? 'bg-yellow-100'
      : 'bg-blue-100';

  return (
    <div className={`${bgColor} mb-6 rounded-lg border p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-3 rounded-full ${iconBg} p-2`}>
            <Clock className={`size-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${textColor}`}>
              {daysRemaining}
              {' '}
              Day
              {daysRemaining !== 1 ? 's' : ''}
              {' '}
              Left in Trial
            </h3>
            <p className={`text-sm ${textColor.replace('900', '700')}`}>
              {daysRemaining <= 2
                ? 'Your trial is ending soon! Upgrade to keep your AI receptionist.'
                : 'Enjoying your AI receptionist? Upgrade to unlock unlimited features.'}
            </p>
          </div>
        </div>
        <Link href="/dashboard/billing">
          <Button
            className={
              urgencyColor === 'red'
                ? 'bg-red-600 hover:bg-red-700'
                : urgencyColor === 'yellow'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-blue-600 hover:bg-blue-700'
            }
          >
            <CreditCard className="mr-2 size-4" />
            {daysRemaining <= 2 ? 'Upgrade Now' : 'See Plans'}
          </Button>
        </Link>
      </div>
    </div>
  );
};
