'use client';

import { useUser } from '@clerk/nextjs';

import { PLAN_ID } from '@/utils/AppConfig';

import { useLocalStorage } from './useLocalStorage';

export const useTrialStatus = () => {
  const { user } = useUser();
  const [trialData] = useLocalStorage<{ startDate: string }>('trial-data', {
    startDate: new Date().toISOString(),
  });

  // Get current plan from user metadata
  const planFromMetadata = user?.publicMetadata?.plan as (typeof PLAN_ID)[keyof typeof PLAN_ID];
  const currentPlan = planFromMetadata || PLAN_ID.TRIAL;

  // Only apply trial logic if user is on TRIAL plan
  if (currentPlan !== PLAN_ID.TRIAL) {
    return {
      isTrialActive: false,
      daysRemaining: 0,
      trialStartDate: '',
      trialEndDate: '',
      hasTrialExpired: false,
    };
  }

  const startDate = new Date(trialData.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7); // 7-day trial

  const now = new Date();
  const timeRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

  const hasTrialExpired = timeRemaining <= 0;
  const isTrialActive = !hasTrialExpired;

  return {
    isTrialActive,
    daysRemaining,
    trialStartDate: startDate.toISOString(),
    trialEndDate: endDate.toISOString(),
    hasTrialExpired,
  };
};
