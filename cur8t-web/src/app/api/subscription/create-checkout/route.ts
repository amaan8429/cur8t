import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { assertEnvOrThrow, getPlanBySlug } from '@/lib/billing';

export function getReturnUrls() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const successPath =
    process.env.LS_SUCCESS_URL || '/settings?billing=success&tab=subscription';
  const cancelPath =
    process.env.LS_CANCEL_URL || '/settings?billing=canceled&tab=subscription';
  const successUrl = base ? `${base}${successPath}` : successPath;
  const cancelUrl = base ? `${base}${cancelPath}` : cancelPath;
  return { successUrl, cancelUrl } as const;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planSlug } = await req.json();
    if (!planSlug || typeof planSlug !== 'string') {
      return NextResponse.json(
        { error: 'planSlug is required' },
        { status: 400 }
      );
    }

    const plan = await getPlanBySlug(planSlug);
    console.log('Retrieved plan:', plan); // Debug log

    if (!plan) {
      return NextResponse.json(
        { error: `Plan with slug '${planSlug}' not found` },
        { status: 400 }
      );
    }

    if (!plan.variantId) {
      console.error('Plan missing variantId:', plan);
      return NextResponse.json(
        {
          error: `Plan '${plan.name}' is not available for checkout yet. Missing variant ID.`,
        },
        { status: 400 }
      );
    }

    const { apiKey, storeId } = assertEnvOrThrow();
    const { successUrl, cancelUrl } = getReturnUrls();

    console.log('Creating checkout with:', {
      variantId: plan.variantId,
      storeId,
      successUrl,
      cancelUrl,
    });

    const requestBody = {
      data: {
        type: 'checkouts',
        attributes: {},
        relationships: {
          store: {
            data: { type: 'stores', id: String(storeId) },
          },
          variant: {
            data: { type: 'variants', id: String(plan.variantId) },
          },
        },
      },
    };

    // Note: We can't pass custom data during checkout creation
    // We'll need to handle user association when the webhook is received
    // The webhook will contain the checkout ID which we can use to track the user

    console.log(
      'Lemon Squeezy request body:',
      JSON.stringify(requestBody, null, 2)
    );

    // Lemon Squeezy Checkout API
    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const msg = await res.text();
      console.error('Lemon Squeezy checkout error:', msg);
      console.error('Response status:', res.status);
      console.error(
        'Response headers:',
        Object.fromEntries(res.headers.entries())
      );

      try {
        const errorJson = JSON.parse(msg);
        console.error('Parsed error response:', errorJson);
      } catch (e) {
        console.error('Could not parse error response as JSON');
      }

      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      );
    }

    const payload = await res.json();
    const url = payload?.data?.attributes?.url;
    if (!url) {
      return NextResponse.json(
        { error: 'Invalid checkout response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
