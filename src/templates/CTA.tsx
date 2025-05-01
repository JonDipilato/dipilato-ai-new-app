import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';

import { ClientButton } from '@/components/ClientButton';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CTABanner } from '@/features/landing/CTABanner';
import { Section } from '@/features/landing/Section';

declare global {
  type WindowWithTracking = typeof window & {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
  };
}

const trackEvent = (
  eventName: 'Lead' | 'Purchase' | 'Subscribe' | 'Contact',
  label = 'Generic',
) => {
  if (typeof window !== 'undefined') {
    const win = window as WindowWithTracking;

    if (win.fbq) {
      win.fbq('track', eventName);
    }

    if (win.gtag) {
      win.gtag('event', eventName.toLowerCase(), {
        event_category: 'button',
        event_label: label,
        value: 1,
      });
    }
  }
};

export const CTA = () => {
  const t = useTranslations('CTA');

  return (
    <Section>
      <CTABanner
        title={t('title')}
        description={t('description')}
        buttons={(
          <ClientButton
            onClick={() => trackEvent('Lead', 'CTA Book Call')}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
            href="https://cal.com/jon-dipilato/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon className="mr-2 size-5" />
            {t('button_text')}
          </ClientButton>
        )}
      />
    </Section>
  );
};
