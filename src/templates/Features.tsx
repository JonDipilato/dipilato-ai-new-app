import { useTranslations } from 'next-intl';
import {
  PhoneCall,
  Bot,
  MessageCircle,
  CalendarClock,
  Slack,
  Puzzle,
} from 'lucide-react';

import { Background } from '@/components/Background';
import { FeatureCard } from '@/features/landing/FeatureCard';
import { Section } from '@/features/landing/Section';

export const Features = () => {
  const t = useTranslations('Features');

  return (
    <Background>
      <Section
        subtitle={t('section_subtitle')}
        title={t('section_title')}
        description={t('section_description')}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-8 md:grid-cols-3">
          <FeatureCard icon={<PhoneCall className="stroke-primary-foreground stroke-2 size-8" />} title={t('feature1_title')}>
            {t('feature1_description')}
          </FeatureCard>

          <FeatureCard icon={<Bot className="stroke-primary-foreground stroke-2 size-8" />} title={t('feature2_title')}>
            {t('feature2_description')}
          </FeatureCard>

          <FeatureCard icon={<MessageCircle className="stroke-primary-foreground stroke-2 size-8" />} title={t('feature3_title')}>
            {t('feature3_description')}
          </FeatureCard>

          <FeatureCard icon={<CalendarClock className="stroke-primary-foreground stroke-2 size-8" />} title={t('feature4_title')}>
            {t('feature4_description')}
          </FeatureCard>

          <FeatureCard icon={<Slack className="stroke-primary-foreground stroke-2 size-8" />} title={t('feature5_title')}>
            {t('feature5_description')}
          </FeatureCard>

          <FeatureCard icon={<Puzzle className="stroke-primary-foreground stroke-2 size-8" />} title={t('feature6_title')}>
            {t('feature6_description')}
          </FeatureCard>
        </div>
      </Section>
    </Background>
  );
};
