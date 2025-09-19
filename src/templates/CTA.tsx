import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { CTABanner } from '@/features/landing/CTABanner';
import { Section } from '@/features/landing/Section';

export const CTA = () => {
  const t = useTranslations('CTA');

  return (
    <Section>
      <CTABanner
        title={t('title')}
        description={t('description')}
        buttons={(
          <a
            className={buttonVariants({ variant: 'default', size: 'lg' })}
            href="https://cal.com/jon-dipilato/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('button_text')}
          </a>
        )}
      />
    </Section>
  );
};
