import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { polarApi } from '@/lib/polar';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, redirect to the main checkout page since Polar doesn't have a direct customer portal creation method
    // In a full implementation, you'd need to:
    // 1. Find the customer in Polar using external_customer_id
    // 2. Create a customer portal session or redirect to Polar's customer portal
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const portalUrl = `${baseUrl}/checkout?customer_portal=true`;

    return NextResponse.json({ url: portalUrl }, { status: 200 });
  } catch (error) {
    console.error('Error creating billing portal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
