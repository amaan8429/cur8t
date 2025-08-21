# Subscription Limits Implementation in Extension API

## Overview

This document describes the implementation of subscription plan limits enforcement in the Cur8t Extension API. The system now enforces limits on collections, links, favorites, and top collections based on the user's subscription plan.

## What Was Implemented

### 1. Subscription Service (`app/core/subscription.py`)

A comprehensive service that handles:

- **User Subscription Retrieval**: Gets current subscription plan and limits from the database
- **Usage Tracking**: Counts current usage of collections, links, favorites, and top collections
- **Limit Enforcement**: Checks if operations are allowed based on current usage vs. plan limits
- **Fallback Handling**: Provides hardcoded defaults if database queries fail

#### Key Methods:

- `get_user_subscription(user_id)`: Retrieves user's current plan and limits
- `get_user_usage(user_id)`: Gets current usage counts
- `check_collection_limit(user_id)`: Verifies if user can create more collections
- `check_links_limit(user_id, collection_id, links_to_add)`: Checks link creation limits
- `check_favorites_limit(user_id)`: Verifies favorites limit
- `check_top_collections_limit(user_id, collections_to_add)`: Checks top collections limit

### 2. Enhanced API Endpoints

All relevant endpoints now enforce subscription limits:

#### Collections

- `POST /collections` - Checks collection creation limit
- `POST /collections/{id}/links` - Checks link addition limit
- `POST /collections/{id}/links/bulk` - Checks bulk link addition limit
- `POST /collections/with-links` - Checks both collection and link limits

#### Favorites

- `POST /favorites` - Checks favorites limit

#### New Endpoint

- `GET /subscription/status` - Returns current subscription status and usage

### 3. Enhanced Error Responses

New error response model `SubscriptionErrorResponse` includes:

- `error`: Human-readable error message
- `plan`: Current plan slug for upgrade suggestions
- `upgrade_required`: Boolean flag indicating upgrade is needed

## How It Works

### 1. Limit Checking Flow

```
User Request → API Key Validation → Subscription Check → Limit Enforcement → Operation
```

### 2. Database Queries

The service queries these tables:

- `subscriptions`: Active user subscriptions
- `plans`: Plan definitions and limits
- `collections`: User's collections count
- `links`: User's total links count
- `favorites`: User's favorites count
- `users.top_collections`: User's pinned collections count

### 3. Fallback Strategy

If database queries fail, the service provides hardcoded defaults:

- **Free Plan**: 3 collections, 50 links/collection, 150 total links, 5 favorites, 3 top collections

## Error Handling

### HTTP Status Codes

- `403 Forbidden`: Limit exceeded (with upgrade suggestion)
- `500 Internal Server Error`: Database/service errors

### Error Response Format

```json
{
  "error": "Collection limit reached (3). Upgrade your plan to create more.",
  "plan": "free",
  "upgrade_required": true
}
```

## Rate Limiting

All endpoints maintain existing rate limits:

- Collection creation: 10/minute
- Link creation: 60/minute
- Bulk operations: 120/minute
- Favorites: 60/minute
- Subscription status: 60/minute

## Testing

Run the test script to verify the implementation:

```bash
cd extension-api
python test_subscription.py
```

## Database Requirements

The system expects these tables to exist:

- `subscriptions` with columns: `user_id`, `product_id`, `variant_id`, `status`
- `plans` with columns: `id`, `name`, `slug`, `interval`, `price_cents`, `limits`
- `collections` with columns: `id`, `user_id`, `title`, `description`, `visibility`
- `links` with columns: `id`, `user_id`, `link_collection_id`, `title`, `url`
- `favorites` with columns: `id`, `user_id`, `title`, `url`
- `users` with columns: `id`, `top_collections` (array)

## Benefits

1. **Consistent Limits**: Extension API now enforces the same limits as the web app
2. **User Experience**: Clear error messages with upgrade suggestions
3. **Security**: Prevents abuse of free tier resources
4. **Scalability**: Database-driven limits that can be updated without code changes
5. **Reliability**: Graceful fallbacks if database is unavailable

## Future Enhancements

1. **Caching**: Cache subscription data to reduce database queries
2. **Real-time Updates**: WebSocket notifications when limits are approached
3. **Usage Analytics**: Track usage patterns for business insights
4. **Dynamic Limits**: Allow admins to adjust limits per user/plan
5. **Grace Periods**: Temporary overages for premium users

## Monitoring

The system logs all limit checks and violations:

- Successful operations: Info level
- Limit violations: Warning level
- Service errors: Error level

Check logs for patterns in limit violations to identify users who might benefit from plan upgrades.
