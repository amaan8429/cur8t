export type PlanMinimum = 'free' | 'pro' | 'business';

export function planMeetsMinimum(planSlug: string, min: PlanMinimum): boolean {
  if (min === 'free') return true;
  if (min === 'pro') {
    return planSlug.startsWith('pro') || planSlug.startsWith('business');
  }
  if (min === 'business') {
    return planSlug.startsWith('business');
  }
  return false;
}
