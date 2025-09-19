import { useTranslations } from 'next-intl';
import React from 'react';

import type { BillingInterval } from '@/types/Subscription';

export const PricingCard = (props: {
  planId: string;
  price: number;
  interval: BillingInterval;
  button: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('PricingPlan');

  const isPopular = props.planId === 'business';
  const isHighTier = props.price > 597;
  const showContactUs = isHighTier;

  return (
    <div className={`relative rounded-xl border px-6 py-8 text-center ${
      isPopular
        ? 'scale-105 border-2 border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-lg'
        : 'border-border'
    }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className={`text-lg font-semibold ${
        isPopular ? 'text-blue-600' : ''
      }`}
      >
        {t(`${props.planId}_plan_name`)}
      </div>

      <div className="mt-3 flex items-center justify-center">
        {showContactUs
          ? (
              <div className="text-3xl font-bold text-blue-600">
                Contact Us
              </div>
            )
          : (
              <>
                <div className="text-5xl font-bold">
                  {`$${props.price}`}
                </div>
                <div className="ml-1 text-muted-foreground">
                  {`/ ${t(`plan_interval_${props.interval}`)}`}
                </div>
              </>
            )}
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        {t(`${props.planId}_plan_description`)}
      </div>

      {props.button}

      <ul className="mt-8 space-y-3">{props.children}</ul>
    </div>
  );
};
