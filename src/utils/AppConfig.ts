import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

import { BILLING_INTERVAL, type PricingPlan } from '@/types/Subscription';

const localePrefix: LocalePrefix = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'DiPilato Automations',
  locales: [
    {
      id: 'en',
      name: 'English',
    },
  ],

  defaultLocale: 'en',
  localePrefix,
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);

export const PLAN_ID = {
  TRIAL: 'trial',
  RECEPTION: 'reception',
  BUSINESS: 'business',
  GROWTH: 'growth',
  CUSTOM_MOBILE: 'custom_mobile',
  CUSTOM_WEB: 'custom_web',
  ENTERPRISE: 'enterprise',
} as const;

export const PricingPlanList: Record<string, PricingPlan> = {
  [PLAN_ID.TRIAL]: {
    id: PLAN_ID.TRIAL,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      aiCalls: 25,
      appointmentBookings: 50,
      smsReminders: 0,
      voiceMinutes: 15,
      customers: 50,
    },
  },
  [PLAN_ID.RECEPTION]: {
    id: PLAN_ID.RECEPTION,
    price: 97,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_1S8rFlF4wSZFuFpHMkG0HDpe',
    devPriceId: 'price_1S8rFlF4wSZFuFpHMkG0HDpe',
    prodPriceId: '',
    features: {
      aiCalls: 200,
      appointmentBookings: 500,
      smsReminders: 0,
      voiceMinutes: 120,
      customers: 500,
    },
  },
  [PLAN_ID.BUSINESS]: {
    id: PLAN_ID.BUSINESS,
    price: 297,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_business_test',
    devPriceId: 'price_1PNksvKOp3DEwzQlGOXO7YBK', // Keep existing
    prodPriceId: '',
    features: {
      aiCalls: 750,
      appointmentBookings: 2000,
      smsReminders: 1000,
      voiceMinutes: 500,
      customers: 2000,
    },
  },
  [PLAN_ID.GROWTH]: {
    id: PLAN_ID.GROWTH,
    price: 597,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_1S8rG6F4wSZFuFpHdlFh8LxB',
    devPriceId: 'price_1S8rG6F4wSZFuFpHdlFh8LxB',
    prodPriceId: '',
    features: {
      aiCalls: 2000,
      appointmentBookings: 5000,
      smsReminders: 3000,
      voiceMinutes: 1500,
      customers: 5000,
    },
  },
  [PLAN_ID.CUSTOM_MOBILE]: {
    id: PLAN_ID.CUSTOM_MOBILE,
    price: 15000,
    interval: BILLING_INTERVAL.YEAR,
    testPriceId: 'price_custom_mobile_test',
    devPriceId: 'price_custom_mobile_dev',
    prodPriceId: '',
    features: {
      aiCalls: 10000,
      appointmentBookings: 25000,
      smsReminders: 15000,
      voiceMinutes: 5000,
      customers: 25000,
    },
  },
  [PLAN_ID.CUSTOM_WEB]: {
    id: PLAN_ID.CUSTOM_WEB,
    price: 25000,
    interval: BILLING_INTERVAL.YEAR,
    testPriceId: 'price_custom_web_test',
    devPriceId: 'price_custom_web_dev',
    prodPriceId: '',
    features: {
      aiCalls: 25000,
      appointmentBookings: 50000,
      smsReminders: 30000,
      voiceMinutes: 10000,
      customers: 50000,
    },
  },
  [PLAN_ID.ENTERPRISE]: {
    id: PLAN_ID.ENTERPRISE,
    price: 50000,
    interval: BILLING_INTERVAL.YEAR,
    testPriceId: 'price_enterprise_test',
    devPriceId: 'price_enterprise_dev',
    prodPriceId: '',
    features: {
      aiCalls: 100000,
      appointmentBookings: 200000,
      smsReminders: 100000,
      voiceMinutes: 50000,
      customers: 200000,
    },
  },
};
