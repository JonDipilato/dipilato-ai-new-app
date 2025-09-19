'use client';

import { useUser } from '@clerk/nextjs';

import { PLAN_ID, PricingPlanList } from '@/utils/AppConfig';

import { useLocalStorage } from './useLocalStorage';
import { useTrialStatus } from './useTrialStatus';

type UsageData = {
  aiCalls: number;
  appointmentBookings: number;
  smsReminders: number;
  voiceMinutes: number;
  customers: number;
  resetDate: string; // Monthly reset
};

type UsageTrackingHook = {
  usage: UsageData;
  currentPlan: (typeof PLAN_ID)[keyof typeof PLAN_ID];
  canUseFeature: (feature: keyof Omit<UsageData, 'resetDate'>) => boolean;
  trackUsage: (feature: keyof Omit<UsageData, 'resetDate'>, amount?: number) => boolean;
  getRemainingUsage: (feature: keyof Omit<UsageData, 'resetDate'>) => number;
  getUsagePercentage: (feature: keyof Omit<UsageData, 'resetDate'>) => number;
  isNearLimit: (feature: keyof Omit<UsageData, 'resetDate'>, threshold?: number) => boolean;
};

export const useUsageTracking = (): UsageTrackingHook => {
  const { user } = useUser();
  const { hasTrialExpired } = useTrialStatus();
  const [usage, setUsage] = useLocalStorage<UsageData>('usage-tracking', {
    aiCalls: 0,
    appointmentBookings: 0,
    smsReminders: 0,
    voiceMinutes: 0,
    customers: 0,
    resetDate: new Date().toISOString().split('T')[0]!, // Today's date
  });

  // Get current plan from user metadata or default to TRIAL
  const planFromMetadata = user?.publicMetadata?.plan as (typeof PLAN_ID)[keyof typeof PLAN_ID];
  const currentPlan = planFromMetadata || PLAN_ID.TRIAL;
  const planLimits = PricingPlanList[currentPlan];

  // Check if we need to reset monthly usage
  const resetUsageIfNeeded = () => {
    const today = new Date().toISOString().split('T')[0]!;
    const lastReset = new Date(usage.resetDate);
    const currentDate = new Date(today!);

    // Reset if it's been more than 30 days
    const daysDiff = Math.floor((currentDate.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 30) {
      setUsage({
        aiCalls: 0,
        appointmentBookings: 0,
        smsReminders: 0,
        voiceMinutes: 0,
        customers: 0,
        resetDate: today!,
      });
      return true;
    }
    return false;
  };

  // Check monthly reset on every call
  resetUsageIfNeeded();

  const canUseFeature = (feature: keyof Omit<UsageData, 'resetDate'>): boolean => {
    if (!planLimits) {
      return false;
    }

    // If trial has expired, block all features
    if (currentPlan === PLAN_ID.TRIAL && hasTrialExpired) {
      return false;
    }

    const currentUsage = usage[feature];
    const limit = planLimits.features[feature];
    return currentUsage < limit;
  };

  const trackUsage = (feature: keyof Omit<UsageData, 'resetDate'>, amount: number = 1): boolean => {
    if (!canUseFeature(feature)) {
      return false; // Usage blocked - at limit
    }

    setUsage(prev => ({
      ...prev,
      [feature]: prev[feature] + amount,
    }));

    return true; // Usage tracked successfully
  };

  const getRemainingUsage = (feature: keyof Omit<UsageData, 'resetDate'>): number => {
    if (!planLimits) {
      return 0;
    }
    const currentUsage = usage[feature];
    const limit = planLimits.features[feature];
    return Math.max(0, limit - currentUsage);
  };

  const getUsagePercentage = (feature: keyof Omit<UsageData, 'resetDate'>): number => {
    if (!planLimits) {
      return 100;
    }
    const currentUsage = usage[feature];
    const limit = planLimits.features[feature];
    return Math.min(100, (currentUsage / limit) * 100);
  };

  const isNearLimit = (feature: keyof Omit<UsageData, 'resetDate'>, threshold: number = 90): boolean => {
    return getUsagePercentage(feature) >= threshold;
  };

  return {
    usage,
    currentPlan,
    canUseFeature,
    trackUsage,
    getRemainingUsage,
    getUsagePercentage,
    isNearLimit,
  };
};
