'use client';

import { useUser } from '@clerk/nextjs';

import { PLAN_ID } from '@/utils/AppConfig';

type UsageData = {
  aiCalls: number;
  appointmentBookings: number;
  smsReminders: number;
  voiceMinutes: number;
  customers: number;
};

type UserSubscription = {
  currentPlan: (typeof PLAN_ID)[keyof typeof PLAN_ID];
  usage: UsageData;
  subscriptionId?: string;
  stripeCustomerId?: string;
};

export const useUserSubscription = (): UserSubscription => {
  const { user } = useUser();

  // In real implementation, this would fetch from your database
  // based on the user's Clerk ID and Stripe subscription

  // For now, return mock data based on user metadata
  const planFromMetadata = user?.publicMetadata?.plan as (typeof PLAN_ID)[keyof typeof PLAN_ID];
  const currentPlan = planFromMetadata || PLAN_ID.TRIAL;

  // Mock usage data - in real app, this would come from your analytics/usage tracking
  const mockUsage: UsageData = {
    aiCalls: currentPlan === PLAN_ID.TRIAL ? 12 : currentPlan === PLAN_ID.RECEPTION ? 45 : 156,
    appointmentBookings: currentPlan === PLAN_ID.TRIAL ? 23 : currentPlan === PLAN_ID.RECEPTION ? 123 : 267,
    smsReminders: currentPlan === PLAN_ID.TRIAL ? 0 : currentPlan === PLAN_ID.RECEPTION ? 0 : 89,
    voiceMinutes: currentPlan === PLAN_ID.TRIAL ? 8 : currentPlan === PLAN_ID.RECEPTION ? 68 : 234,
    customers: currentPlan === PLAN_ID.TRIAL ? 34 : currentPlan === PLAN_ID.RECEPTION ? 89 : 445,
  };

  return {
    currentPlan,
    usage: mockUsage,
    subscriptionId: user?.publicMetadata?.stripeSubscriptionId as string,
    stripeCustomerId: user?.publicMetadata?.stripeCustomerId as string,
  };
};
