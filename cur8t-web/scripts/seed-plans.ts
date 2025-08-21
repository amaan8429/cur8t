import { db } from '../src/db';
import { PlansTable } from '../src/schema';
import { plans } from '../src/lib/plans';
import { randomUUID } from 'crypto';

async function seedPlans() {
  try {
    console.log('Seeding plans...');

    // Clear existing plans first
    await db.delete(PlansTable);
    console.log('Cleared existing plans');

    // Insert new plans with updated pricing
    const plansToInsert = plans.map((plan) => ({
      ...plan,
      id: randomUUID(),
    }));

    console.log(`Total plans to insert: ${plansToInsert.length}`);
    for (const plan of plansToInsert) {
      console.log(`Inserting plan: ${plan.name} (${plan.slug})`);
      await db.insert(PlansTable).values(plan);
      console.log(`Inserted plan: ${plan.name}`);
    }

    console.log('✅ Plans seeded successfully!');
    console.log(
      '\n✅ All plans have been configured (payment provider IDs to be added later)'
    );
  } catch (error) {
    console.error('Error seeding plans:', error);
  } finally {
    process.exit(0);
  }
}

seedPlans();
