# Rate Limiting Implementation Guide for cur8t-web

> **Status**: Username API ✅ **COMPLETED** - All others pending implementation

## 🎯 Implementation Priority Matrix

### 🔴 **HIGH PRIORITY** - Implement First (Abuse-prone endpoints)

| Endpoint                        | Type             | Current Status          | Rate Limit Suggestion    | Reasoning                            |
| ------------------------------- | ---------------- | ----------------------- | ------------------------ | ------------------------------------ |
| **✅ `/api/user/username`**     | **API Route**    | **COMPLETED**           | **5 req/15min per user** | **Username changes (Done!)**         |
| `/api/settings`                 | API Route (PUT)  | ❌ Needs Implementation | `10 req/5min per user`   | Profile updates - prevent spam       |
| `/api/settings/socialmedia`     | API Route (PUT)  | ❌ Needs Implementation | `10 req/5min per user`   | Social media updates - prevent spam  |
| `/api/github/sync`              | API Route (POST) | ❌ Needs Implementation | `3 req/10min per user`   | Heavy GitHub operations - expensive  |
| `createCollectionAction`        | Server Action    | ❌ Needs Implementation | `20 req/hour per user`   | Collection creation - prevent spam   |
| `createLinkAction`              | Server Action    | ❌ Needs Implementation | `50 req/10min per user`  | Link creation - high frequency use   |
| `saveExtractedCollectionAction` | Server Action    | ❌ Needs Implementation | `10 req/hour per user`   | Article extraction - heavy operation |

### 🟡 **MEDIUM PRIORITY** - Implement Second (Moderate abuse risk)

| Endpoint                          | Type          | Current Status          | Rate Limit Suggestion   | Reasoning                    |
| --------------------------------- | ------------- | ----------------------- | ----------------------- | ---------------------------- |
| `deleteCollectionAction`          | Server Action | ❌ Needs Implementation | `30 req/hour per user`  | Deletion operations          |
| `deleteLinkAction`                | Server Action | ❌ Needs Implementation | `100 req/hour per user` | Link deletion - frequent use |
| `likeCollectionAction`            | Server Action | ❌ Needs Implementation | `100 req/hour per user` | Prevent like bombing         |
| `saveCollectionAction`            | Server Action | ❌ Needs Implementation | `50 req/hour per user`  | Collection bookmarking       |
| `duplicatePublicCollectionAction` | Server Action | ❌ Needs Implementation | `20 req/hour per user`  | Collection duplication       |
| `changeCollectionName`            | Server Action | ❌ Needs Implementation | `20 req/hour per user`  | Collection name updates      |
| `changeCollectionDescription`     | Server Action | ❌ Needs Implementation | `30 req/hour per user`  | Description updates          |
| `changeCollectionVisi`            | Server Action | ❌ Needs Implementation | `20 req/hour per user`  | Visibility changes           |
| `searchAction`                    | Server Action | ❌ Needs Implementation | `200 req/hour per user` | Search queries               |

### 🟢 **LOW PRIORITY** - Implement Third (Read-heavy, less abuse-prone)

| Endpoint                    | Type            | Current Status          | Rate Limit Suggestion   | Reasoning                      |
| --------------------------- | --------------- | ----------------------- | ----------------------- | ------------------------------ |
| `/api/user/info`            | API Route (GET) | ❌ Needs Implementation | `100 req/hour per user` | User info retrieval            |
| `/api/settings/socialmedia` | API Route (GET) | ❌ Needs Implementation | `100 req/hour per user` | Settings retrieval             |
| `/api/github/status`        | API Route (GET) | ❌ Needs Implementation | `50 req/hour per user`  | Status checks                  |
| `/api/profile/[username]`   | API Route (GET) | ❌ Needs Implementation | `500 req/hour per IP`   | Public profiles - IP-based     |
| `getCollectionsAction`      | Server Action   | ❌ Needs Implementation | `200 req/hour per user` | Collection listing             |
| `getLinksAction`            | Server Action   | ❌ Needs Implementation | `200 req/hour per user` | Link retrieval                 |
| `getSingleCollectionAction` | Server Action   | ❌ Needs Implementation | `300 req/hour per user` | Collection details             |
| `getPlatformStats`          | Server Action   | ❌ Needs Implementation | `100 req/hour per IP`   | Platform statistics - IP-based |

### ⚪ **EXCLUDE from Rate Limiting**

| Endpoint               | Type             | Reason                                                    |
| ---------------------- | ---------------- | --------------------------------------------------------- |
| `/api/webhooks`        | API Route (POST) | **Clerk webhooks** - external service, has own protection |
| `/api/github/connect`  | API Route (GET)  | **OAuth redirect** - GitHub handles rate limiting         |
| `/api/github/callback` | API Route (GET)  | **OAuth callback** - GitHub handles rate limiting         |

---

## 🛠️ **Implementation Templates**

### Template 1: High-Frequency User Actions

```typescript
// For: createLinkAction, deleteLinkAction, searchAction
const clientId = getClientId(request, userId);
const rateLimitResult = await checkRateLimit(
  rateLimiters.userUpdate, // 10 req/5min
  clientId,
  "Too many requests. Please slow down."
);
```

### Template 2: Heavy Operations

```typescript
// For: github/sync, saveExtractedCollectionAction
const clientId = getClientId(request, userId);
const rateLimitResult = await checkRateLimit(
  rateLimiters.heavyOperation, // 3 req/10min (create new limiter)
  clientId,
  "This operation is rate limited. Please try again later."
);
```

### Template 3: Public/Anonymous Endpoints

```typescript
// For: /api/profile/[username], getPlatformStats
const clientId = getClientId(request); // IP-based, no userId
const rateLimitResult = await checkRateLimit(
  rateLimiters.publicApi, // 100 req/hour
  clientId,
  "Too many requests from your IP. Please slow down."
);
```

---

## 📋 **Implementation Checklist**

### Step 1: Extend Rate Limiter Configuration

Add these to `src/lib/ratelimit/index.ts`:

```typescript
export const rateLimiters = {
  // ✅ Already exists
  username: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:username",
  }),

  // 🆕 Add these new ones
  heavyOperation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    analytics: true,
    prefix: "ratelimit:heavy",
  }),

  collectionCreate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "ratelimit:collection-create",
  }),

  linkActions: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "10 m"),
    analytics: true,
    prefix: "ratelimit:links",
  }),

  socialActions: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:social",
  }),
};
```

### Step 2: Implementation Order

1. **Week 1**: HIGH PRIORITY (7 endpoints)
2. **Week 2**: MEDIUM PRIORITY (9 endpoints)
3. **Week 3**: LOW PRIORITY (8 endpoints)

### Step 3: Testing Strategy

- Test each endpoint with rapid requests
- Verify error messages are user-friendly
- Confirm rate limits reset properly
- Monitor Redis usage in Upstash dashboard

---

## 💡 **Implementation Notes**

### Server Actions vs API Routes

- **API Routes**: Use `NextRequest` and return `NextResponse` with headers
- **Server Actions**: Return error objects, no HTTP headers needed

### Rate Limit Strategies

- **User-based**: Authenticated actions (`createLink`, `createCollection`)
- **IP-based**: Public endpoints (`/api/profile/[username]`, `getPlatformStats`)
- **Hybrid**: Fall back to IP if no user authentication

### Error Handling Patterns

- **API Routes**: Return 429 status with rate limit headers
- **Server Actions**: Return `{ error: "Rate limit message" }`
- **Frontend**: Handle both patterns in your components

---

## 🎯 **Next Steps**

1. **Pick one HIGH PRIORITY endpoint** to start with
2. **Copy the pattern** from `/api/user/username` (already working!)
3. **Test thoroughly** before moving to the next
4. **Monitor Upstash usage** as you add more endpoints
5. **Update this document** as you complete each item

**Recommended starting order:**

1. ✅ ~~`/api/user/username`~~ (Done!)
2. 🎯 **`createCollectionAction`** (Start here!)
3. 🎯 **`createLinkAction`** (Then this)
4. 🎯 **`/api/settings`** (Then this)

---

> **Remember**: Rate limiting is about finding the balance between preventing abuse and maintaining good user experience. Start conservative and adjust based on real usage patterns!
