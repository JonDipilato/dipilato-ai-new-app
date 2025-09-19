'use client';

import { Calendar, CheckCircle, MessageSquare, Phone, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
};

export const OnboardingFlow = () => {
  const t = useTranslations('Onboarding');

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'phone',
      title: t('step_phone_title'),
      description: t('step_phone_description'),
      completed: false,
      icon: <Phone className="size-5" />,
    },
    {
      id: 'calendar',
      title: t('step_calendar_title'),
      description: t('step_calendar_description'),
      completed: false,
      icon: <Calendar className="size-5" />,
    },
    {
      id: 'services',
      title: t('step_services_title'),
      description: t('step_services_description'),
      completed: false,
      icon: <Settings className="size-5" />,
    },
    {
      id: 'test',
      title: t('step_test_title'),
      description: t('step_test_description'),
      completed: false,
      icon: <MessageSquare className="size-5" />,
    },
  ]);

  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, completed: true } : step,
    ));
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const isComplete = completedSteps === totalSteps;

  if (isComplete) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto mb-4 size-12 text-green-500" />
        <h3 className="text-lg font-semibold text-green-800">{t('complete_title')}</h3>
        <p className="text-green-600">{t('complete_description')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{t('welcome_title')}</h2>
        <p className="text-muted-foreground">{t('welcome_description')}</p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t('progress_label')}</span>
            <span>
              {completedSteps}
              /
              {totalSteps}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map(step => (
          <div
            key={step.id}
            className={`flex items-center rounded-lg border p-4 transition-colors ${
              step.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`mr-4 flex size-8 items-center justify-center rounded-full ${
              step.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
            }`}
            >
              {step.completed ? <CheckCircle className="size-5" /> : step.icon}
            </div>

            <div className="flex-1">
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>

            {!step.completed && (
              <Button
                size="sm"
                onClick={() => handleStepComplete(step.id)}
                className="ml-4"
              >
                {t('complete_button')}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t('help_text')}
          {' '}
          <a
            href="mailto:support@dipilatoautomations.com"
            className="text-primary hover:underline"
          >
            {t('contact_support')}
          </a>
        </p>
      </div>
    </div>
  );
};
