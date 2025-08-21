import { db } from '@/db';
import { PlansTable } from '@/schema';
import { eq } from 'drizzle-orm';

export function getReturnUrls() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const successPath = '/dashboard?billing=success';
  const cancelPath = '/pricing?canceled=1';
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
