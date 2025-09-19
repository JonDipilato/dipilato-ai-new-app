import {
  ArrowRight,
  BarChart3,
  Calendar,
  MessageSquare,
  PhoneCall,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Section } from '@/features/landing/Section';

export const HowItWorks = () => {
  const t = useTranslations('HowItWorks');

  const steps = [
    {
      icon: <PhoneCall className="size-12 text-white" />,
      title: t('step1_title'),
      description: t('step1_description'),
      bgGradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      icon: <Calendar className="size-12 text-white" />,
      title: t('step2_title'),
      description: t('step2_description'),
      bgGradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
    {
      icon: <MessageSquare className="size-12 text-white" />,
      title: t('step3_title'),
      description: t('step3_description'),
      bgGradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      icon: <BarChart3 className="size-12 text-white" />,
      title: t('step4_title'),
      description: t('step4_description'),
      bgGradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
  ];

  return (
    <Section
      id="how-it-works"
      subtitle={t('section_subtitle')}
      title={t('section_title')}
      description={t('section_description')}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="group text-center">
            <div className="relative">
              <div className={`mx-auto mb-4 flex size-20 items-center justify-center rounded-full ${step.iconBg} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {step.icon}
              </div>
              <div className={`absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-gradient-to-r ${step.bgGradient} text-sm font-bold text-white shadow-md`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-full top-10 hidden w-full lg:block">
                  <ArrowRight className="mx-auto size-6 animate-pulse text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Demo Video Section */}
      <div className="mt-16 text-center">
        <h3 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">{t('demo_title')}</h3>
        <p className="mx-auto mb-8 max-w-2xl text-gray-600">{t('demo_description')}</p>
        <div className="mx-auto max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/Cdn2E-ttvwY"
              title="AI Receptionist Demo"
              className="absolute inset-0 size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
