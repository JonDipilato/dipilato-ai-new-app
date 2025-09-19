import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { PricingInformation } from '@/features/billing/PricingInformation';
import { Section } from '@/features/landing/Section';
import { PLAN_ID } from '@/utils/AppConfig';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Billing',
  });

  return {
    title: t('title_bar'),
    description: t('title_bar_description'),
  };
}

export default function BillingPage() {
  const t = useTranslations('Billing');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title_bar')}</h1>
        <p className="text-muted-foreground">{t('title_bar_description')}</p>
      </div>

      <Section
        subtitle={t('current_section_title')}
        title="Choose Your Plan"
        description={t('current_section_description')}
      >
        <PricingInformation
          buttonList={{
            [PLAN_ID.TRIAL]: (
              <button
                type="button"
                className="mt-5 w-full cursor-not-allowed rounded-md bg-gray-500 px-4 py-2 text-white"
                disabled
              >
                Current Plan
              </button>
            ),
            [PLAN_ID.RECEPTION]: (
              <a
                href="/sign-up"
                className="mt-5 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
              >
                Upgrade Now
              </a>
            ),
            [PLAN_ID.BUSINESS]: (
              <a
                href="https://buy.stripe.com/7sI29t1s6aGe3CM14s"
                className="mt-5 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
              >
                Upgrade Now
              </a>
            ),
            [PLAN_ID.GROWTH]: (
              <a
                href="/sign-up"
                className="mt-5 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
              >
                Upgrade Now
              </a>
            ),
            [PLAN_ID.CUSTOM_MOBILE]: (
              <a
                href="mailto:jondipilato@dipilatoautomations.com?subject=Custom Mobile App Inquiry"
                className="mt-5 block w-full rounded-md border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
              >
                Contact Us
              </a>
            ),
            [PLAN_ID.CUSTOM_WEB]: (
              <a
                href="mailto:jondipilato@dipilatoautomations.com?subject=Custom Web Platform Inquiry"
                className="mt-5 block w-full rounded-md border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
              >
                Contact Us
              </a>
            ),
            [PLAN_ID.ENTERPRISE]: (
              <a
                href="mailto:jondipilato@dipilatoautomations.com?subject=Enterprise Solution Inquiry"
                className="mt-5 block w-full rounded-md border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
              >
                Contact Us
              </a>
            ),
          }}
        />
      </Section>
    </div>
  );
}
