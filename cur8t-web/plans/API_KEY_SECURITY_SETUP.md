# API Key Security Setup

## Overview

This project now uses **HMAC-SHA256 with pepper** for API key storage and validation, providing industry-standard security for API authentication.

## Security Features

- **HMAC-SHA256**: Cryptographic hash with server-side secret (pepper)
- **Show-once generation**: API keys are only displayed once when created
- **Immediate revocation**: Keys can be deleted instantly
- **Rate limiting**: Per-user and per-key rate limiting
- **No plaintext storage**: Only hashed keys are stored in the database

## Environment Variables Required

### Next.js App (cur8t-web)

Create a `.env.local` file in the `cur8t-web` directory:

```bash
# API Key Security: HMAC-SHA256 pepper (32+ character random string)
# This MUST match the pepper in extension-api/.env
API_KEY_PEPPER=your-super-secret-32-byte-pepper-here

# Other existing variables...
DATABASE_URL=your-database-url
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
# ... etc
```

### Extension API (extension-api)

Create a `.env` file in the `extension-api` directory:

```bash
# Database URL for asyncpg (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Debug mode
DEBUG=True

# API Key Security: HMAC-SHA256 pepper (32+ character random string)
# This MUST match the pepper in cur8t-web/.env.local
API_KEY_PEPPER=your-super-secret-32-byte-pepper-here

# Other variables...
CLERK_SECRET_KEY=your-clerk-secret
RATE_LIMIT_ENABLED=true
RATE_LIMIT_DEFAULT=120/minute
RATE_LIMIT_TRUST_FORWARDED=true
```

## Generating the Pepper

### Option 1: OpenSSL (Recommended)

```bash
openssl rand -hex 32
```

### Option 2: Python

```python
import secrets
print(secrets.token_hex(32))
```

### Option 3: Node.js

```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

## Important Notes

1. **Same Pepper**: The `API_KEY_PEPPER` must be identical in both `.env` files
2. **Keep Secret**: Never commit the pepper to version control
3. **Length**: Use at least 32 bytes (64 hex characters) for security
4. **Rotation**: You can rotate the pepper, but existing API keys will become invalid

## Migration from Plain SHA-256

⚠️ **WARNING**: If you have existing API keys stored with plain SHA-256 hashing:

- **All existing API keys will stop working** after this upgrade
- **Users must regenerate their API keys**
- **No automatic migration is possible** (one-way hashing)

## Testing the Setup

1. Set the `API_KEY_PEPPER` in both environment files
2. Restart both services
3. Generate a new API key in the web app
4. Test the key with the extension API
5. Verify the key works and can be revoked

## Security Benefits

- **Rainbow table resistance**: Pepper prevents pre-computed hash attacks
- **Server compromise protection**: Even if database is leaked, keys are safe without pepper
- **Industry standard**: Same approach used by GitHub, Stripe, AWS
- **Performance**: Fast enough for high-frequency API calls
