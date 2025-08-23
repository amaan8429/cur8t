import { Webhooks } from '@polar-sh/nextjs';
import { db } from '@/db';
import { SubscriptionsTable } from '@/schema';
import { eq } from 'drizzle-orm';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || '',
  onPayload: async (payload: any) => {
    console.log('Polar webhook received:', payload);
    console.log('Webhook type:', payload.type);
    console.log('Webhook timestamp:', new Date().toISOString());
  },
  onOrderCreated: async (order: any) => {
    console.log('Order created:', order);
    // Handle new order creation
    // You can access order.customer_id, order.subscription_id, etc.
  },
  onCustomerStateChanged: async (customerState: any) => {
    console.log('Customer state changed:', customerState);

    // Update subscription in database
    if (customerState.customer_id && customerState.subscription_id) {
      try {
        // Find existing subscription by customer ID
        const existingSubscription = await db
          .select()
          .from(SubscriptionsTable)
          .where(
            eq(SubscriptionsTable.storeCustomerId, customerState.customer_id)
          )
          .limit(1);

        if (existingSubscription.length > 0) {
          // Update existing subscription
          await db
            .update(SubscriptionsTable)
            .set({
              subscriptionId: customerState.subscription_id,
              status: customerState.state === 'active' ? 'active' : 'none',
              updatedAt: new Date(),
            })
            .where(
              eq(SubscriptionsTable.storeCustomerId, customerState.customer_id)
            );
        } else {
          // Create new subscription (you might want to get user ID from somewhere)
          console.log(
            'New customer subscription - need to handle user association'
          );
        }
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    }
  },
});
