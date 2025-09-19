import { useTranslations } from 'next-intl';

import { Section } from '@/features/landing/Section';

export const SuccessStories = () => {
  const t = useTranslations('SuccessStories');

  return (
    <Section
      id="success-stories"
      subtitle={t('section_subtitle')}
      title={t('section_title')}
      description={t('section_description')}
      className="bg-muted"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Success Story 1 */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <div className="mr-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xl font-bold text-white">
              SM
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('story1_name')}</h3>
              <p className="text-sm text-muted-foreground">{t('story1_business')}</p>
            </div>
          </div>
          <blockquote className="mb-4 italic text-muted-foreground">
            "
            {t('story1_quote')}
            "
          </blockquote>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-muted-foreground">{t('story1_metric1')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">25</div>
              <div className="text-muted-foreground">{t('story1_metric2')}</div>
            </div>
          </div>
        </div>

        {/* Success Story 2 */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <div className="mr-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-xl font-bold text-white">
              DF
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('story2_name')}</h3>
              <p className="text-sm text-muted-foreground">{t('story2_business')}</p>
            </div>
          </div>
          <blockquote className="mb-4 italic text-muted-foreground">
            "
            {t('story2_quote')}
            "
          </blockquote>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$12K</div>
              <div className="text-muted-foreground">{t('story2_metric1')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">40%</div>
              <div className="text-muted-foreground">{t('story2_metric2')}</div>
            </div>
          </div>
        </div>

        {/* Success Story 3 */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <div className="mr-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-xl font-bold text-white">
              ZY
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('story3_name')}</h3>
              <p className="text-sm text-muted-foreground">{t('story3_business')}</p>
            </div>
          </div>
          <blockquote className="mb-4 italic text-muted-foreground">
            "
            {t('story3_quote')}
            "
          </blockquote>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-muted-foreground">{t('story3_metric1')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3x</div>
              <div className="text-muted-foreground">{t('story3_metric2')}</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
