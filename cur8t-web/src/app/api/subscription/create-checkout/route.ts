import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { assertEnvOrThrow, getPlanBySlug, getReturnUrls } from '@/lib/billing';

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
    if (!plan || !plan.variantId) {
      return NextResponse.json(
        { error: 'Plan not available for checkout yet. Please try later.' },
        { status: 400 }
      );
    }

    const { apiKey, storeId } = assertEnvOrThrow();
    const { successUrl, cancelUrl } = getReturnUrls();

    // Lemon Squeezy Checkout API (JSON:API)
    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId,
              },
            },
            checkout_options: {
              success_url: successUrl,
              cancel_url: cancelUrl,
            },
          },
          relationships: {
            store: {
              data: { type: 'stores', id: String(storeId) },
            },
            variant: {
              data: { type: 'variants', id: String(plan.variantId) },
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      console.error('Lemon Squeezy checkout error:', msg);
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
