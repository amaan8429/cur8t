import { Webhooks } from '@polar-sh/nextjs';
import { db } from '@/db';
import { SubscriptionsTable } from '@/schema';
import { eq } from 'drizzle-orm';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || '',
  onPayload: async (payload: any) => {
    console.log('=== POLAR WEBHOOK START ===');
    console.log('Webhook received at:', new Date().toISOString());
    console.log('Webhook type:', payload.type);
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    console.log('Payload data:', JSON.stringify(payload.data, null, 2));
    console.log(
      'Webhook secret configured:',
      !!process.env.POLAR_WEBHOOK_SECRET
    );

    // Handle all webhook types manually since the specific handlers might not be firing
    if (payload.type === 'subscription.created') {
      console.log('🔄 Processing subscription.created event...');
      await handleSubscriptionCreated(payload.data);
    } else if (payload.type === 'subscription.updated') {
      console.log('🔄 Processing subscription.updated event...');
      await handleSubscriptionUpdated(payload.data);
    } else {
      console.log('⚠️ Unhandled webhook type:', payload.type);
      console.log('Available payload keys:', Object.keys(payload));
    }

    console.log('=== POLAR WEBHOOK END ===');
  },
});

// Separate function to handle subscription created
async function handleSubscriptionCreated(subscription: any) {
  console.log('=== HANDLING SUBSCRIPTION CREATED ===');
  console.log('Subscription object:', JSON.stringify(subscription, null, 2));
  console.log('Subscription ID:', subscription.id);
  console.log('Customer ID:', subscription.customer_id);
  console.log('Product ID:', subscription.product_id);
  console.log('Status:', subscription.status);
  console.log('Metadata:', JSON.stringify(subscription.metadata, null, 2));

  try {
    // Extract user ID from metadata (set during checkout)
    const userId = subscription.metadata?.user_id;
    console.log('Extracted user ID:', userId);

    if (!userId) {
      console.error('❌ No user_id found in subscription metadata');
      console.log(
        'Available metadata keys:',
        Object.keys(subscription.metadata || {})
      );
      console.log('Full metadata object:', subscription.metadata);
      return;
    }

    console.log('✅ Found user ID:', userId);

    // Check if subscription already exists
    console.log(
      '🔍 Checking for existing subscription with customer ID:',
      subscription.customerId
    );
    const existingSubscription = await db
      .select()
      .from(SubscriptionsTable)
      .where(eq(SubscriptionsTable.storeCustomerId, subscription.customerId))
      .limit(1);

    console.log(
      'Existing subscription found:',
      existingSubscription.length > 0
    );
    if (existingSubscription.length > 0) {
      console.log('📝 Updating existing subscription...');
      // Update existing subscription
      await db
        .update(SubscriptionsTable)
        .set({
          subscriptionId: subscription.id,
          status: subscription.status === 'active' ? 'active' : 'none',
          productId: subscription.productId,
          currentPeriodStart: subscription.currentPeriodStart
            ? new Date(subscription.currentPeriodStart)
            : null,
          currentPeriodEnd: subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : null,
          updatedAt: new Date(),
        })
        .where(eq(SubscriptionsTable.storeCustomerId, subscription.customerId));

      console.log('✅ Updated existing subscription for user:', userId);
    } else {
      console.log('🆕 Creating new subscription...');
      // Create new subscription
      await db.insert(SubscriptionsTable).values({
        userId: userId,
        storeCustomerId: subscription.customerId,
        subscriptionId: subscription.id,
        productId: subscription.productId,
        status: subscription.status === 'active' ? 'active' : 'none',
        currentPeriodStart: subscription.currentPeriodStart
          ? new Date(subscription.currentPeriodStart)
          : null,
        currentPeriodEnd: subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : null,
      });

      console.log('✅ Created new subscription for user:', userId);
    }
  } catch (error) {
    console.error('❌ Error handling subscription created:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      subscription: subscription,
    });
  }
  console.log('=== SUBSCRIPTION CREATED HANDLING END ===');
}

// Separate function to handle subscription updated
async function handleSubscriptionUpdated(subscription: any) {
  console.log('=== HANDLING SUBSCRIPTION UPDATED ===');
  console.log('Subscription object:', JSON.stringify(subscription, null, 2));
  console.log('Subscription ID:', subscription.id);
  console.log('Customer ID:', subscription.customer_id);
  console.log('Status:', subscription.status);
  console.log('Metadata:', JSON.stringify(subscription.metadata, null, 2));

  try {
    const userId = subscription.metadata?.user_id;
    console.log('Extracted user ID:', userId);

    if (!userId) {
      console.error('❌ No user_id found in subscription metadata');
      console.log(
        'Available metadata keys:',
        Object.keys(subscription.metadata || {})
      );
      return;
    }

    console.log('✅ Found user ID:', userId);
    console.log('🔄 Updating subscription status...');

    // Update subscription status
    await db
      .update(SubscriptionsTable)
      .set({
        status: subscription.status === 'active' ? 'active' : 'none',
        currentPeriodStart: subscription.current_period_start
          ? new Date(subscription.current_period_start)
          : null,
        currentPeriodEnd: subscription.current_period_end
          ? new Date(subscription.current_period_end)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(SubscriptionsTable.storeCustomerId, subscription.customer_id));

    console.log('✅ Updated subscription for user:', userId);
  } catch (error) {
    console.error('❌ Error handling subscription updated:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      subscription: subscription,
    });
  }
  console.log('=== SUBSCRIPTION UPDATED HANDLING END ===');
}
