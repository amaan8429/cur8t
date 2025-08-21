# Polar Integration Setup

## Environment Variables

Add these to your `.env.local` file:

```bash
# Polar Configuration
POLAR_ACCESS_TOKEN=your_polar_access_token_here
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret_here

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Getting Polar Credentials

1. **Access Token**: Create an organization access token from your Polar organization settings
2. **Webhook Secret**: Generate a secret key when setting up webhooks in Polar

## Webhook Configuration

1. Go to your Polar organization settings
2. Add a new webhook endpoint pointing to: `your-app.com/api/webhook/polar`
3. Select events: `order.created`, `customer.state_changed`
4. Generate and save the webhook secret

## Product Setup

1. Create products in Polar for each plan:
   - Pro Monthly ($4.99/month)
   - Pro Yearly ($49.99/year)
   - Business Monthly ($9.99/month)
   - Business Yearly ($99.99/year)

2. Update the product and variant IDs in `src/lib/plans.ts`

## Testing

- Use Polar's sandbox environment for development
- Test webhooks locally using ngrok: `ngrok http 3000`
- Update webhook URL to your ngrok URL during development
