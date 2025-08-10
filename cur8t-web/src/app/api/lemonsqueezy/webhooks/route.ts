import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { db } from '@/db';
import {
  LemonSqueezyEventsTable,
  SubscriptionsTable,
  UsersTable,
} from '@/schema';
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
  customer_email?: string;
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

  // Check checkout_data.custom (for checkout events)
  const checkoutData = payload.data?.attributes?.checkout_data;
  if (checkoutData?.custom?.user_id) {
    return String(checkoutData.custom.user_id);
  }

  // Check data.attributes.custom (alternative location)
  const dataCustom = payload.data?.attributes?.custom;
  if (dataCustom?.user_id) {
    return String(dataCustom.user_id);
  }

  console.log('No user ID found in payload. Available fields:', {
    meta: payload.meta,
    dataAttributes: payload.data?.attributes,
    checkoutData: payload.data?.attributes?.checkout_data,
  });

  return undefined;
}

async function findUserByEmail(email: string): Promise<string | undefined> {
  try {
    const user = await db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
      .limit(1);

    return user.length > 0 ? user[0].id : undefined;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return undefined;
  }
}

export async function POST(request: Request) {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
    // Try multiple possible signature header names
    const signature =
      request.headers.get('x-signature') ||
      request.headers.get('x-lemonsqueezy-signature') ||
      request.headers.get('signature');
    const rawBody = await request.text();

    console.log('=== LEMON SQUEEZY WEBHOOK DEBUG ===');
    console.log('Webhook received request at /api/lemonsqueezy/webhooks');
    console.log('All headers:', Object.fromEntries(request.headers.entries()));
    console.log('Raw body length:', rawBody.length);
    console.log('Raw body preview:', rawBody.substring(0, 500));
    console.log('Webhook secret configured:', !!secret);
    console.log('Webhook secret value:', secret);
    console.log('Signature header present:', !!signature);
    console.log('Signature header value:', signature);
    console.log('=== END DEBUG ===');

    if (!secret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (!verifySignature(secret, rawBody, signature)) {
      console.error('Webhook signature verification failed');
      console.error('Expected secret:', secret);
      console.error('Received signature:', signature);
      console.error(
        'Body hash:',
        createHmac('sha256', secret).update(rawBody).digest('hex')
      );
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const parsed = parseJSONSafe(rawBody);
    if (!parsed || !isLemonPayload(parsed)) {
      console.error('Webhook payload validation failed');
      console.error('Parsed payload:', parsed);
      console.error('Payload type:', typeof parsed);
      console.error('Is object:', isObject(parsed));
      console.error('Raw body that failed to parse:', rawBody);
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const payload = parsed;

    const { eventId, eventName } = getMeta(payload);
    console.log('Extracted eventId:', eventId, 'eventName:', eventName);

    // Generate a fallback eventId if none is provided
    const finalEventId =
      eventId ||
      `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Only check for duplicates if we have a real eventId
    if (eventId) {
      const existing = await db
        .select({ eventId: LemonSqueezyEventsTable.eventId })
        .from(LemonSqueezyEventsTable)
        .where(eq(LemonSqueezyEventsTable.eventId, eventId))
        .limit(1);
      if (existing.length) {
        console.log('Duplicate event, skipping:', eventId);
        return NextResponse.json(
          { ok: true, duplicate: true },
          { status: 200 }
        );
      }
    }

    // Insert received event
    try {
      await db.insert(LemonSqueezyEventsTable).values({
        eventId: finalEventId,
        type: eventName || 'unknown',
        payloadHash: createHmac('sha256', secret).update(rawBody).digest('hex'),
        status: 'received',
      });
    } catch (dbError) {
      console.error('Failed to insert event into database:', dbError);
      // Continue processing even if event logging fails
    }

    // Handle subscription lifecycle
    const type = payload.data?.type;
    console.log('Webhook received event type:', type);
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    try {
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
        const currentPeriodEnd =
          attrs?.period_ends_at || attrs?.ends_at || null;
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
      } else if (type === 'checkouts') {
        // Handle checkout completion
        console.log('Processing checkout event:', payload.data?.id);
        const checkoutId = String(payload.data?.id || '');
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

        console.log('Checkout details:', {
          checkoutId,
          variantId,
          productId,
          customerId,
          status: attrs.status,
        });
        console.log('Checkout attributes:', attrs);

        // Check if this is a completed checkout
        if (attrs.status === 'completed' || attrs.status === 'paid') {
          let userId = getUserIdFromPayload(payload);
          console.log('User ID from payload:', userId);

          // If no user ID found, try to find by customer email
          if (!userId && attrs.customer_email) {
            console.log('Trying to find user by email:', attrs.customer_email);
            userId = await findUserByEmail(attrs.customer_email);
            console.log('User ID found by email:', userId);
          }

          if (userId && variantId) {
            // Create or update subscription
            const existingSub = await db
              .select({ id: SubscriptionsTable.id })
              .from(SubscriptionsTable)
              .where(eq(SubscriptionsTable.userId, userId))
              .limit(1);

            if (existingSub.length) {
              // Update existing subscription
              console.log('Updating existing subscription for user:', userId);
              await db
                .update(SubscriptionsTable)
                .set({
                  storeCustomerId: customerId,
                  productId: productId,
                  variantId: variantId,
                  status: 'active',
                  currentPeriodStart: new Date(),
                  currentPeriodEnd: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ), // 30 days from now
                  cancelAtPeriodEnd: false,
                })
                .where(eq(SubscriptionsTable.userId, userId));
              console.log('Subscription updated successfully');
            } else {
              // Create new subscription
              console.log('Creating new subscription for user:', userId);
              await db.insert(SubscriptionsTable).values({
                userId,
                storeCustomerId: customerId,
                productId: productId,
                variantId: variantId,
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ), // 30 days from now
                cancelAtPeriodEnd: false,
              });
              console.log('Subscription created successfully');
            }
          }
        }
      } else if (type === 'orders') {
        // Handle order completion (might be sent after successful checkout)
        console.log('Processing order event:', payload.data?.id);
        const orderId = String(payload.data?.id || '');
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

        console.log('Order details:', {
          orderId,
          variantId,
          productId,
          customerId,
          status: attrs.status,
          customerEmail: attrs.customer_email,
        });
        console.log('Order attributes:', attrs);

        // Check if this is a completed order
        if (attrs.status === 'completed' || attrs.status === 'paid') {
          let userId = getUserIdFromPayload(payload);
          console.log('User ID from payload:', userId);

          // If no user ID found, try to find by customer email
          if (!userId && attrs.customer_email) {
            console.log('Trying to find user by email:', attrs.customer_email);
            userId = await findUserByEmail(attrs.customer_email);
            console.log('User ID found by email:', userId);
          }

          if (userId && variantId) {
            // Create or update subscription
            const existingSub = await db
              .select({ id: SubscriptionsTable.id })
              .from(SubscriptionsTable)
              .where(eq(SubscriptionsTable.userId, userId))
              .limit(1);

            if (existingSub.length) {
              // Update existing subscription
              console.log('Updating existing subscription for user:', userId);
              await db
                .update(SubscriptionsTable)
                .set({
                  storeCustomerId: customerId,
                  productId: productId,
                  variantId: variantId,
                  status: 'active',
                  currentPeriodStart: new Date(),
                  currentPeriodEnd: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ), // 30 days from now
                  cancelAtPeriodEnd: false,
                })
                .where(eq(SubscriptionsTable.userId, userId));
              console.log('Subscription updated successfully');
            } else {
              // Create new subscription
              console.log('Creating new subscription for user:', userId);
              await db.insert(SubscriptionsTable).values({
                userId,
                storeCustomerId: customerId,
                productId: productId,
                variantId: variantId,
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ), // 30 days from now
                cancelAtPeriodEnd: false,
              });
              console.log('Subscription created successfully');
            }
          } else {
            console.log('Missing required data for subscription creation:', {
              userId,
              variantId,
              customerEmail: attrs.customer_email,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
      return NextResponse.json(
        { error: 'Failed to process webhook event' },
        { status: 500 }
      );
    }

    // Mark processed
    await db
      .update(LemonSqueezyEventsTable)
      .set({ status: 'processed', processedAt: new Date() })
      .where(eq(LemonSqueezyEventsTable.eventId, finalEventId));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
