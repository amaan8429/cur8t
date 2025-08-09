import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { db } from '@/db';
import { LemonSqueezyEventsTable, SubscriptionsTable } from '@/schema';
import { eq } from 'drizzle-orm';

function verifySignature(
  secret: string,
  rawBody: string,
  signature?: string | null
) {
  if (!secret || !signature) return false;
  const digest = createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');
  // timing-safe compare
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function parseJSONSafe(raw: string): unknown | null {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

type LemonMeta = {
  event_id?: string;
  id?: string;
  event_name?: string;
  event?: string;
  custom?: { user_id?: string };
  custom_data?: { user_id?: string };
};

type LemonRelRef = { data?: { id?: string } };

type LemonDataAttributes = {
  status?: string;
  period_starts_at?: string;
  renews_at?: string;
  period_ends_at?: string;
  ends_at?: string;
  trial_ends_at?: string;
  cancelled?: boolean;
  cancelled_at?: string;
  checkout_data?: { custom?: { user_id?: string } };
  custom?: { user_id?: string };
};

type LemonData = {
  id?: string;
  type?: string;
  attributes?: LemonDataAttributes;
  relationships?: {
    variant?: LemonRelRef;
    product?: LemonRelRef;
    customer?: LemonRelRef;
  };
};

type LemonWebhookPayload = {
  id?: string;
  meta?: LemonMeta;
  data?: LemonData;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLemonPayload(payload: unknown): payload is LemonWebhookPayload {
  if (!isObject(payload)) return false;
  const maybe = payload as LemonWebhookPayload;
  if (maybe.meta && !isObject(maybe.meta)) return false;
  if (maybe.data && !isObject(maybe.data)) return false;
  return true;
}

function getMeta(payload: LemonWebhookPayload) {
  const meta = payload.meta ?? {};
  return {
    eventId: meta.event_id || meta.id || payload.id || undefined,
    eventName: meta.event_name || meta.event || undefined,
    custom: meta.custom || meta.custom_data || undefined,
  } as { eventId?: string; eventName?: string; custom?: { user_id?: string } };
}

function getUserIdFromPayload(
  payload: LemonWebhookPayload
): string | undefined {
  // Prefer meta.custom
  const meta = payload.meta;
  const userIdFromMeta = meta?.custom?.user_id || meta?.custom_data?.user_id;
  if (userIdFromMeta) return String(userIdFromMeta);

  // Fallback to attributes.checkout_data.custom
  const custom =
    payload.data?.attributes?.checkout_data?.custom ||
    payload.data?.attributes?.custom ||
    undefined;
  const userIdFromAttrs = custom?.user_id;
  if (userIdFromAttrs) return String(userIdFromAttrs);
  return undefined;
}

export async function POST(request: Request) {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
    const signature = request.headers.get('x-signature');
    const rawBody = await request.text();

    if (!verifySignature(secret, rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const parsed = parseJSONSafe(rawBody);
    if (!parsed || !isLemonPayload(parsed)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const payload = parsed;

    const { eventId, eventName } = getMeta(payload);
    if (!eventId) {
      return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
    }

    // Idempotency: skip if already processed
    const existing = await db
      .select({ eventId: LemonSqueezyEventsTable.eventId })
      .from(LemonSqueezyEventsTable)
      .where(eq(LemonSqueezyEventsTable.eventId, eventId))
      .limit(1);
    if (existing.length) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    // Insert received event
    await db.insert(LemonSqueezyEventsTable).values({
      eventId,
      type: eventName || 'unknown',
      payloadHash: createHmac('sha256', secret).update(rawBody).digest('hex'),
      status: 'received',
    });

    // Handle subscription lifecycle
    const type = payload.data?.type;
    if (type === 'subscriptions') {
      const subId = String(payload.data?.id || '');
      const attrs = payload.data?.attributes ?? {};
      const rel = payload.data?.relationships ?? {};
      const variantId = rel.variant?.data?.id
        ? String(rel.variant.data.id)
        : null;
      const productId = rel.product?.data?.id
        ? String(rel.product.data.id)
        : null;
      const customerId = rel.customer?.data?.id
        ? String(rel.customer.data.id)
        : null;
      const status = String(attrs.status || 'none');
      const currentPeriodStart =
        attrs?.period_starts_at || attrs?.renews_at || null;
      const currentPeriodEnd = attrs?.period_ends_at || attrs?.ends_at || null;
      const trialEnd = attrs?.trial_ends_at || null;
      const cancelAtPeriodEnd = Boolean(
        attrs?.cancelled || attrs?.cancelled_at
      );

      const userId = getUserIdFromPayload(payload);
      if (userId) {
        // Upsert by subscriptionId if possible, otherwise by userId+variantId
        const whereById = eq(SubscriptionsTable.subscriptionId, subId);
        const existingSub = subId
          ? await db
              .select({ id: SubscriptionsTable.id })
              .from(SubscriptionsTable)
              .where(whereById)
              .limit(1)
          : [];

        if (existingSub.length) {
          await db
            .update(SubscriptionsTable)
            .set({
              userId,
              storeCustomerId: customerId,
              productId: productId,
              variantId: variantId,
              status,
              currentPeriodStart: currentPeriodStart
                ? new Date(currentPeriodStart)
                : null,
              currentPeriodEnd: currentPeriodEnd
                ? new Date(currentPeriodEnd)
                : null,
              cancelAtPeriodEnd,
              trialEnd: trialEnd ? new Date(trialEnd) : null,
            })
            .where(whereById);
        } else {
          await db.insert(SubscriptionsTable).values({
            userId,
            storeCustomerId: customerId,
            subscriptionId: subId || null,
            productId: productId,
            variantId: variantId,
            status,
            currentPeriodStart: currentPeriodStart
              ? new Date(currentPeriodStart)
              : null,
            currentPeriodEnd: currentPeriodEnd
              ? new Date(currentPeriodEnd)
              : null,
            cancelAtPeriodEnd,
            trialEnd: trialEnd ? new Date(trialEnd) : null,
          });
        }
      }
    }

    // Mark processed
    await db
      .update(LemonSqueezyEventsTable)
      .set({ status: 'processed', processedAt: new Date() })
      .where(eq(LemonSqueezyEventsTable.eventId, eventId));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
