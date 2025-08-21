import { Checkout } from '@polar-sh/nextjs';
import { getPolarServer } from '@/lib/polar';

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: '/dashboard?billing=success&checkout_id={CHECKOUT_ID}',
  server: getPolarServer(), // Will default to 'production'
});
