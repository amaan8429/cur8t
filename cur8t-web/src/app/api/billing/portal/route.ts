import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { assertEnvOrThrow } from '@/lib/billing';

// Lemon Squeezy customer portal is typically `https://app.lemonsqueezy.com/my-orders` for purchases.
// For subscriptions, you can link to the hosted portal URL returned on checkout or stored from customer data.
// Placeholder: return generic portal URL for now.

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    assertEnvOrThrow();

    // TODO: Optionally look up and return a customer-specific portal URL if you store it.
    const url = 'https://app.lemonsqueezy.com/my-orders';
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Error getting billing portal URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
