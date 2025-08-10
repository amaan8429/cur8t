import { db } from '../src/db';
import { PlansTable } from '../src/schema';
import { randomUUID } from 'crypto';

async function seedPlans() {
  try {
    console.log('Seeding plans...');

    // Clear existing plans first
    await db.delete(PlansTable);
    console.log('Cleared existing plans');

    // Insert new plans with updated pricing
    const plans = [
      {
        id: randomUUID(),
        name: 'Free',
        slug: 'free',
        description: 'Great for getting started and casual use',
        productId: null, // No Lemon Squeezy product for free
        variantId: null,
        interval: 'none',
        priceCents: 0,
        limits: {
          collections: 5,
          linksPerCollection: 50,
          totalLinks: 250,
          favorites: 3,
          topCollections: 3,
        },
        sort: 0,
      },
      {
        id: randomUUID(),
        name: 'Pro Monthly',
        slug: 'pro-monthly',
        description: 'For power users who want more scale and features',
        productId: '605487', // Cur8t product ID
        variantId: '944383', // Pro Monthly variant ID
        interval: 'month',
        priceCents: 900, // $9.00
        limits: {
          collections: 25,
          linksPerCollection: 200,
          totalLinks: 5000,
          favorites: 50,
          topCollections: 10,
        },
        sort: 1,
      },
      {
        id: randomUUID(),
        name: 'Pro Yearly',
        slug: 'pro-yearly',
        description:
          'For power users who want more scale and features (save with yearly)',
        productId: '605487', // Cur8t product ID
        variantId: '944394', // Pro Yearly variant ID
        interval: 'year',
        priceCents: 9000, // $90.00
        limits: {
          collections: 25,
          linksPerCollection: 200,
          totalLinks: 5000,
          favorites: 50,
          topCollections: 10,
        },
        sort: 2,
      },
      {
        id: randomUUID(),
        name: 'Business Monthly',
        slug: 'business-monthly',
        description: 'For teams and heavy usage with generous limits',
        productId: '605487', // Cur8t product ID
        variantId: '944405', // Business Monthly variant ID
        interval: 'month',
        priceCents: 2900, // $29.00
        limits: {
          collections: 100,
          linksPerCollection: 500,
          totalLinks: 50000,
          favorites: 200,
          topCollections: 50,
        },
        sort: 3,
      },
      {
        id: randomUUID(),
        name: 'Business Yearly',
        slug: 'business-yearly',
        description:
          'For teams and heavy usage with generous limits (save with yearly)',
        productId: '605487', // Cur8t product ID
        variantId: '944407', // Business Yearly variant ID
        interval: 'year',
        priceCents: 29000, // $290.00
        limits: {
          collections: 100,
          linksPerCollection: 500,
          totalLinks: 50000,
          favorites: 200,
          topCollections: 50,
        },
        sort: 4,
      },
    ];

    console.log(`Total plans to insert: ${plans.length}`);
    for (const plan of plans) {
      console.log(`Inserting plan: ${plan.name} (${plan.slug})`);
      await db.insert(PlansTable).values(plan);
      console.log(`Inserted plan: ${plan.name}`);
    }

    console.log('✅ Plans seeded successfully!');
    console.log('\n✅ All Lemon Squeezy IDs have been configured:');
    console.log('- Product ID: 605487 (Cur8t)');
    console.log('- Pro Monthly: 944383');
    console.log('- Pro Yearly: 944394');
    console.log('- Business Monthly: 944405');
    console.log('- Business Yearly: 944407');
  } catch (error) {
    console.error('Error seeding plans:', error);
  } finally {
    process.exit(0);
  }
}

seedPlans();
