import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { PricingInformation } from '@/features/billing/PricingInformation';
import { Section } from '@/features/landing/Section';
import { PLAN_ID } from '@/utils/AppConfig';

export const Pricing = () => {
  const t = useTranslations('Pricing');

  return (
    <Section
      id="pricing"
      subtitle={t('section_subtitle')}
      title={t('section_title')}
      description={t('section_description')}
    >
      <PricingInformation
        buttonList={{
          [PLAN_ID.TRIAL]: (
            <Link
              className={buttonVariants({
                size: 'sm',
                className: 'mt-5 w-full',
              })}
              href="/sign-up"
            >
              {t('button_text')}
            </Link>
          ),
          [PLAN_ID.RECEPTION]: (
            <Link
              className={buttonVariants({
                size: 'sm',
                className: 'mt-5 w-full',
              })}
              href="/sign-up"
            >
              {t('button_text')}
            </Link>
          ),
          [PLAN_ID.BUSINESS]: (
            <Link
              className={buttonVariants({
                size: 'sm',
                className: 'mt-5 w-full',
              })}
              href="https://buy.stripe.com/7sI29t1s6aGe3CM14s"
            >
              {t('button_text')}
            </Link>
          ),
          [PLAN_ID.GROWTH]: (
            <Link
              className={buttonVariants({
                size: 'sm',
                className: 'mt-5 w-full',
              })}
              href="/sign-up"
            >
              {t('button_text')}
            </Link>
          ),
          [PLAN_ID.CUSTOM_MOBILE]: (
            <Link
              className={buttonVariants({
                size: 'sm',
                variant: 'outline',
                className: 'mt-5 w-full',
              })}
              href="mailto:jondipilato@dipilatoautomations.com?subject=Custom Mobile App Inquiry"
            >
              Contact Us
            </Link>
          ),
          [PLAN_ID.CUSTOM_WEB]: (
            <Link
              className={buttonVariants({
                size: 'sm',
                variant: 'outline',
                className: 'mt-5 w-full',
              })}
              href="mailto:jondipilato@dipilatoautomations.com?subject=Custom Web Platform Inquiry"
            >
              Contact Us
            </Link>
          ),
          [PLAN_ID.ENTERPRISE]: (
            <Link
              className={buttonVariants({
                size: 'sm',
                variant: 'outline',
                className: 'mt-5 w-full',
              })}
              href="mailto:jondipilato@dipilatoautomations.com?subject=Enterprise Solution Inquiry"
            >
              Contact Us
            </Link>
          ),
        }}
      />
    </Section>
  );
};
