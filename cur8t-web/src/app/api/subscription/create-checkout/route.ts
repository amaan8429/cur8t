import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPlanBySlug } from '@/lib/billing';
import { polarApi } from '@/lib/polar';

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
    if (!plan) {
      return NextResponse.json(
        { error: `Plan with slug '${planSlug}' not found` },
        { status: 400 }
      );
    }

    if (!plan.productId) {
      return NextResponse.json(
        {
          error: `Plan '${plan.name}' is not available for checkout yet. Missing product ID.`,
        },
        { status: 400 }
      );
    }

    // Create a checkout session with Polar
    try {
      console.log(
        'Using Polar access token:',
        process.env.POLAR_ACCESS_TOKEN ? 'Token exists' : 'No token found'
      );
      const checkout = await polarApi.checkouts.create({
        products: [plan.productId],
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?billing=success&checkout_id={CHECKOUT_ID}`,
        metadata: {
          plan_slug: planSlug,
          user_id: userId,
        },
      });

      return NextResponse.json({ url: checkout.url }, { status: 200 });
    } catch (polarError) {
      console.error('Polar checkout creation error:', polarError);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
