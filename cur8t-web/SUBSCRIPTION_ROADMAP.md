# Lemon Squeezy Subscription Roadmap

This roadmap implements subscription-based access for Cur8t using Lemon Squeezy. Section 1 delivers normal subscriptions only (no AI token usage/overage). Section 2 outlines future work for AI tokens and usage-based billing to be tackled after Section 1 ships.

## Section 1 — Normal subscriptions only (Phase 1)

Implement standard recurring subscriptions without AI token allowances or metered overages.

### 1) Lemon Squeezy dashboard setup

- Create a product: “Cur8t”.
  - Success URL: `https://your-domain.com/dashboard?billing=success`
  - Cancel URL: `https://your-domain.com/pricing?canceled=1`
- Create subscription variants:
  - Pro Monthly — $9/month
  - Pro Yearly — $90/year (2 months free)
  - Business Monthly — $29/month
  - Business Yearly — $290/year (2 months free)
- Create a webhook endpoint in Lemon Squeezy:
  - Endpoint URL: `https://your-domain.com/api/lemonsqueezy/webhooks`
  - Copy/store the Webhook Secret (used to verify requests)
- Collect and save IDs you will need:
  - store_id, product_id, variant_ids for each plan

### 2) Database schema planning (no tokens in this phase)

Add the following tables (omit any token/usage tables for now):

- plans
  - id (uuid, pk)
  - name (text)
  - productId (text) — Lemon Squeezy product ID
  - variantId (text) — Lemon Squeezy variant ID
  - interval (text) — e.g., "month", "year"
  - price (integer or numeric) — price in cents
  - limits (jsonb) — per-plan limits, e.g. `{ collections, linksPerCollection, totalLinks, favorites, topCollections }`
  - sort (integer)

- subscriptions
  - id (uuid, pk)
  - userId (text, fk → users.id)
  - storeCustomerId (text) — LS customer ID
  - subscriptionId (text) — LS subscription ID
  - productId (text)
  - variantId (text)
  - status (text) — e.g., trialing, active, past_due, cancelled
  - currentPeriodStart (timestamp)
  - currentPeriodEnd (timestamp)
  - cancelAtPeriodEnd (boolean)
  - trialEnd (timestamp, nullable)
  - billingAnchor (timestamp, nullable)

- lemonsqueezy_events (idempotency)
  - eventId (text, pk) — LS event ID
  - type (text)
  - payloadHash (text)
  - receivedAt (timestamp)
  - processedAt (timestamp, nullable)
  - status (text) — processed|failed
  - error (text, nullable)

Seed plan rows (example):

- Free (internal only; no LS IDs) with limits:
  - collections: 5
  - linksPerCollection: 50
  - totalLinks: 250
  - favorites: 3
  - topCollections: 3
- Pro Monthly/Yearly (with LS variant IDs) with limits:
  - collections: 25
  - linksPerCollection: 200
  - totalLinks: 5,000
  - favorites: 50
  - topCollections: 10
- Business Monthly/Yearly (with LS variant IDs) with limits:
  - collections: 100
  - linksPerCollection: 500
  - totalLinks: 50,000
  - favorites: 200
  - topCollections: 50

### 3) Environment variables

Add to your environment:

- LEMON_SQUEEZY_API_KEY
- LEMON_SQUEEZY_STORE_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

### 4) Webhook events to handle (subscriptions only)

- Subscription lifecycle:
  - created/activated → upsert `subscriptions` row, link to user, set status and period dates
  - updated → update status, plan (variant change), dates, cancellation flag
  - cancelled/expired/past_due/unpaid → set `status` accordingly for gating
- Security and idempotency:
  - Verify webhook signature with `LEMON_SQUEEZY_WEBHOOK_SECRET`
  - Store `eventId` in `lemonsqueezy_events` and skip if already processed

### 5) App integration and feature gating (no tokens yet)

- Server-side checks
  - Read the user’s active subscription (join `subscriptions` → `plans`), then use `limits` JSON to enforce:
    - `createCollectionAction` → max collections per plan ✅ Implemented
    - `createLinkAction` → max links per collection and total links ✅ Implemented
    - `createFavorite` → max favorites ✅ Implemented
    - `setTopCollections`, `addPinnedCollection` → max top/pinned collections (replace hardcoded 3) ✅ Implemented
- Middleware
  - Keep current public routes public.
  - For premium-only pages, redirect to `/pricing` if user lacks required plan.
- Client state (UI helpers)
  - A subscription snapshot (plan name, status, limits) made available to UI.
  - `<FeatureGate>` and `<UpgradePrompt>` components use the snapshot to show/hide actions and suggest upgrades.

### 6) Caching strategy

- Compute a subscription snapshot per user: plan, status, and limits.
- Cache in Redis (Upstash) for ~5 minutes under a stable key (e.g., `subsnap:{userId}`).
- Invalidate on relevant webhook events (status or plan changes).

### 7) Pricing and checkout UX

- Pricing page shows Free, Pro, Business (with limits above).
- “Upgrade” buttons call a server endpoint to create an LS checkout for the chosen variant and redirect.
- “Manage billing” links to the Lemon Squeezy Customer Portal.

### Progress log

- DB schema created: `plans`, `subscriptions`, `lemonsqueezy_events` ✅
- Plans seeded on Neon (Free/Pro/Business) ✅
- Subscription snapshot helper added: `src/lib/subscription.ts` ✅
- Gating added:
  - Collections: `createCollectionAction` ✅
  - Links: `createLinkAction` ✅
  - Favorites: `createFavorite` ✅
  - Pinned/Top collections: `pinnedCollections.ts` ✅
- API endpoint: `GET /api/subscription/status` ✅
- Checkout endpoint: `POST /api/subscription/create-checkout` (programmatic success/cancel URLs) ✅
- Billing portal endpoint: `GET /api/billing/portal` (placeholder URL for now) ✅
- Webhook receiver: `POST /api/webhooks/lemonsqueezy` with signature verification and subscription upsert ✅
- Client hook: `useSubscriptionStatus` for consuming `/api/subscription/status` ✅
- UI component: `<FeatureGate>` for gating sections client-side ✅

### 8) Migration plan

- Default all existing users to Free.
- For 1–2 weeks: soft gating with banners and upgrade CTAs; log over-limit attempts.
- After grace period: hard enforce limits.

### 9) Testing plan (LS test mode)

- Subscribe, cancel, switch variants; verify status and periods update.
- Failed payments → ensure status transitions enforce gating.
- Webhook signature verification and idempotency handling.
- Middleware redirects and server-side gating paths.

### 10) Deployment checklist

- All env vars set in the deployment platform.
- Webhook endpoint configured in Lemon Squeezy (production URL).
- DB migrations applied and `plans` seeded with correct LS IDs.
- Pricing page and upgrade/portal flows wired to production.

---

## Section 2 — AI tokens & usage-based billing (Future work)

This section is deferred until Section 1 is complete. It outlines how to add tokens and usage-based billing on top of the core subscription system.

### Overview

- Introduce AI token allowances per plan and charge overage beyond the included amount.
- Optionally offer one-time Token Packs for Free users (and discounted packs for Pro/Business) to prepay usage.

### Lemon Squeezy configuration

- Enable usage-based billing (metered components/add-ons) if your store supports it.
- Create a metered component: “AI Tokens Overage” with unit “per 100 tokens”.
  - Attach to Pro variants at $0.05 / 100 tokens.
  - Attach to Business variants at $0.02 / 100 tokens.
- Create a separate “Token Packs” product with variants:
  - 1,000 tokens — $10
  - 5,000 tokens — $40
  - 10,000 tokens — $70
- Optional coupons for paid tiers:
  - Pro: 50% off
  - Business: 80% off

### Database additions

- Extend `plans` with token fields:
  - tokenAllowance (integer), overageUnitSize (integer, e.g., 100), overagePricePerUnit (integer in cents)
- New tables:
  - token_usage: id, userId, periodStart, periodEnd, tokensIncluded, tokensUsed, tokensOverageReported, lastReportedAt
  - token_topups: id, userId, orderId, variantId, tokensGranted, status, purchasedAt

### Server logic

- Track token consumption per user. Compute remaining = included − used + unspent top-ups.
- When remaining < 0, accumulate overage units in 100-token blocks.
- Report usage to Lemon Squeezy periodically or at period end.
- Reset included tokens each billing period; define carryover policy for top-ups (typically carry over until used).

### Webhooks

- Subscriptions: continue handling lifecycle events as in Section 1.
- Orders (Token Packs): on payment, grant tokens and persist `token_topups`.
- Invoices: confirm usage charges were invoiced; reconcile with `tokensOverageReported`.

### UI/UX additions

- Show token balance and usage progress indicators.
- Add “Buy Token Pack” flows for Free (and optionally paid tiers with coupons).
- Display overage costs and next reset date.

### Testing plan (tokens)

- Simulate token consumption past allowance; verify usage reporting and invoicing.
- Purchase Token Packs and confirm balance increases.
  -- Handle webhook retries and idempotency for token events.
