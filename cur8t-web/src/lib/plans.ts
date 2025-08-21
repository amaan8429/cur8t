import { InsertPlan } from '@/schema';

export interface PlanData
  extends Omit<InsertPlan, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export const plans: PlanData[] = [
  {
    name: 'Free',
    slug: 'free',
    productId: null,
    variantId: null,
    interval: 'none',
    priceCents: 0,
    limits: {
      collections: 3,
      linksPerCollection: 50,
      totalLinks: 100,
      favorites: 10,
      topCollections: 1,
    },
    sort: 0,
  },
  {
    name: 'Pro Monthly',
    slug: 'pro-monthly',
    productId: '52976f11-6817-41cd-8c1f-129adbb42824',
    variantId: null, // Not used in Polar
    interval: 'month',
    priceCents: 499, // $4.99
    limits: {
      collections: 25,
      linksPerCollection: 200,
      totalLinks: 2000,
      favorites: 100,
      topCollections: 5,
    },
    sort: 1,
  },
  {
    name: 'Pro Yearly',
    slug: 'pro-yearly',
    productId: '10ecf5bb-c644-47f1-8454-4314e0cd3233',
    variantId: null, // Not used in Polar
    interval: 'year',
    priceCents: 4999, // $49.99
    limits: {
      collections: 25,
      linksPerCollection: 200,
      totalLinks: 2000,
      favorites: 100,
      topCollections: 5,
    },
    sort: 2,
  },
  {
    name: 'Business Monthly',
    slug: 'business-monthly',
    productId: 'b83bda1d-4980-4f8b-92f9-0353ee5e28b2',
    variantId: null, // Not used in Polar
    interval: 'month',
    priceCents: 999, // $9.99
    limits: {
      collections: 100,
      linksPerCollection: 500,
      totalLinks: 10000,
      favorites: 500,
      topCollections: 10,
    },
    sort: 3,
  },
  {
    name: 'Business Yearly',
    slug: 'business-yearly',
    productId: '6d17aa6c-2834-4be5-92cd-518b4e8a15e2',
    variantId: null, // Not used in Polar
    interval: 'year',
    priceCents: 9999, // $99.99
    limits: {
      collections: 100,
      linksPerCollection: 500,
      totalLinks: 10000,
      favorites: 500,
      topCollections: 10,
    },
    sort: 4,
  },
];

// Helper functions
export const getPlanBySlug = (slug: string) => {
  return plans.find((plan) => plan.slug === slug);
};

export const getPlanByName = (name: string) => {
  return plans.find((plan) => plan.name === name);
};

export const getFreePlan = () => {
  return plans.find((plan) => plan.slug === 'free');
};

export const getPaidPlans = () => {
  return plans.filter((plan) => plan.slug !== 'free');
};

export const getMonthlyPlans = () => {
  return plans.filter((plan) => plan.interval === 'month');
};

export const getYearlyPlans = () => {
  return plans.filter((plan) => plan.interval === 'year');
};

// Pricing display helpers
export const formatPrice = (priceCents: number, interval: string) => {
  if (priceCents === 0) return 'Free forever';

  const price = priceCents / 100;
  const period = interval === 'year' ? 'year' : 'month';

  return {
    amount: price,
    period,
    display: `$${price}/${period}`,
    yearlyDisplay:
      interval === 'year' ? `$${price}/year` : `$${price * 12}/year`,
  };
};

// Plan comparison data for UI components
export const planComparisonData = {
  features: [
    { name: 'Collections', key: 'collections' },
    { name: 'Links per Collection', key: 'linksPerCollection' },
    { name: 'Total Links', key: 'totalLinks' },
    { name: 'Favorites', key: 'favorites' },
    { name: 'Pinned Collections', key: 'topCollections' },
  ],
  plans: ['free', 'pro-monthly', 'business-monthly'],
};

// Extended plan data for UI components (includes description for display purposes)
export interface ExtendedPlanData extends PlanData {
  description: string;
}

export const extendedPlans: ExtendedPlanData[] = [
  {
    ...plans[0], // Free plan
    description: 'Great for getting started and casual use',
  },
  {
    ...plans[1], // Pro Monthly
    description: 'For power users who want more scale and features',
  },
  {
    ...plans[2], // Pro Yearly
    description:
      'For power users who want more scale and features (save with yearly)',
  },
  {
    ...plans[3], // Business Monthly
    description: 'For teams and heavy usage with generous limits',
  },
  {
    ...plans[4], // Business Yearly
    description:
      'For teams and heavy usage with generous limits (save with yearly)',
  },
];
