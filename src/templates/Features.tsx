import {
  Bot,
  CalendarClock,
  MessageCircle,
  PhoneCall,
  Puzzle,
  Slack,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Background } from '@/components/Background';
import { FeatureCard } from '@/features/landing/FeatureCard';
import { Section } from '@/features/landing/Section';

export const Features = () => {
  const t = useTranslations('Features');

  return (
    <Background>
      <Section
        id="features"
        subtitle={t('section_subtitle')}
        title={t('section_title')}
        description={t('section_description')}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-8 md:grid-cols-3">
          <FeatureCard icon={<PhoneCall className="size-8 stroke-primary-foreground stroke-2" />} title={t('feature1_title')}>
            {t('feature1_description')}
          </FeatureCard>

          <FeatureCard icon={<Bot className="size-8 stroke-primary-foreground stroke-2" />} title={t('feature2_title')}>
            {t('feature2_description')}
          </FeatureCard>

          <FeatureCard icon={<MessageCircle className="size-8 stroke-primary-foreground stroke-2" />} title={t('feature3_title')}>
            {t('feature3_description')}
          </FeatureCard>

          <FeatureCard icon={<CalendarClock className="size-8 stroke-primary-foreground stroke-2" />} title={t('feature4_title')}>
            {t('feature4_description')}
          </FeatureCard>

          <FeatureCard icon={<Slack className="size-8 stroke-primary-foreground stroke-2" />} title={t('feature5_title')}>
            {t('feature5_description')}
          </FeatureCard>

          <FeatureCard icon={<Puzzle className="size-8 stroke-primary-foreground stroke-2" />} title={t('feature6_title')}>
            {t('feature6_description')}
          </FeatureCard>
        </div>
      </Section>
    </Background>
  );
};
