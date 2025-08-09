import { db } from '@/db';
import { PlansTable } from '@/schema';
import { eq } from 'drizzle-orm';

export function assertEnvOrThrow() {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  if (!apiKey || !storeId) {
    throw new Error(
      'Lemon Squeezy not configured. Missing LEMON_SQUEEZY_API_KEY or LEMON_SQUEEZY_STORE_ID'
    );
  }
  return { apiKey, storeId } as const;
}

export function getReturnUrls() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const successPath =
    process.env.LS_SUCCESS_URL || '/dashboard?billing=success';
  const cancelPath = process.env.LS_CANCEL_URL || '/pricing?canceled=1';
  const successUrl = base ? `${base}${successPath}` : successPath;
  const cancelUrl = base ? `${base}${cancelPath}` : cancelPath;
  return { successUrl, cancelUrl } as const;
}

export async function getPlanBySlug(slug: string) {
  const plans = await db
    .select()
    .from(PlansTable)
    .where(eq(PlansTable.slug, slug))
    .limit(1);
  return plans[0] || null;
}
