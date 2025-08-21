import { Polar } from '@polar-sh/sdk';

export const polarApi = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server:
    (process.env.POLAR_SERVER as 'production' | 'sandbox') || 'production', // Default to production, can override with POLAR_SERVER=sandbox
});

// Helper function to get the current server environment
export function getPolarServer() {
  return (process.env.POLAR_SERVER as 'production' | 'sandbox') || 'production';
}
