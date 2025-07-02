# API Key Authentication - Updated Guide

## 🔄 **What Changed**

Your FastAPI backend now uses **API key authentication** instead of user IDs:

- ✅ **Before:** `Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC`
- ✅ **Now:** `Authorization: Bearer cur8t_api_1234567890abcdef1234567890abcdef`

## 🔑 **How It Works**

1. **Browser extension** sends API key in Authorization header
2. **FastAPI backend** validates API key against `api_keys` table
3. **Database lookup** retrieves the user who owns the API key
4. **Request processed** using the associated user ID

## 📊 **Database Schema**

```sql
api_keys table:
- id (UUID)          -- Primary key
- user_id (text)     -- References users.id
- name (text)        -- Human-readable name for the key
- key (text)         -- The actual API key value
- created_at         -- Timestamp
- updated_at         -- Timestamp
```

## 🔧 **Updated API Usage**

### **Authentication Header**

```http
Authorization: Bearer cur8t_api_1234567890abcdef1234567890abcdef
```

### **Test Authentication**

```http
GET /api/v1/test-auth
Authorization: Bearer cur8t_api_1234567890abcdef

Response:
{
  "success": true,
  "message": "API key authentication successful",
  "user_id": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC"
}
```

### **Get Top Collections**

```http
GET /api/v1/top-collections
Authorization: Bearer cur8t_api_1234567890abcdef

Response:
{
  "data": [
    {
      "id": "uuid",
      "title": "Collection Title",
      "description": "Description",
      "visibility": "private",
      "totalLinks": 10
    }
  ]
}
```

### **Add Bookmark**

```http
POST /api/v1/collections/{collection_id}/links
Authorization: Bearer cur8t_api_1234567890abcdef
Content-Type: application/json

{
  "url": "https://example.com",
  "title": "Optional Title"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Link Title",
    "url": "https://example.com",
    "linkCollectionId": "collection_uuid",
    "userId": "user_id"
  }
}
```

## 💻 **Updated JavaScript Code**

### **API Client Class**

```javascript
class Cur8tAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "http://localhost:8001/api/v1";
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new Error(`API Error: ${error.detail}`);
    }

    return response.json();
  }

  async getTopCollections() {
    const data = await this.request("/top-collections");
    return data.data;
  }

  async addBookmark(collectionId, url, title = null) {
    const data = await this.request(`/collections/${collectionId}/links`, {
      method: "POST",
      body: JSON.stringify({ url, ...(title && { title }) }),
    });
    return data.data;
  }

  async testAuth() {
    return await this.request("/test-auth");
  }
}
```

### **Usage Example**

```javascript
// Initialize with API key
const api = new Cur8tAPI("cur8t_api_1234567890abcdef1234567890abcdef");

// Test authentication
try {
  const authTest = await api.testAuth();
  console.log("Auth successful for user:", authTest.user_id);
} catch (error) {
  console.error("Auth failed:", error.message);
}

// Get collections
const collections = await api.getTopCollections();
console.log("User collections:", collections);

// Add bookmark
const bookmark = await api.addBookmark(
  collections[0].id,
  "https://example.com",
  "My Bookmark"
);
console.log("Bookmark created:", bookmark);
```

## 🚨 **Error Handling**

### **Invalid API Key**

```json
{
  "success": false,
  "error": "Invalid API key"
}
```

### **Missing Authorization Header**

```json
{
  "detail": "Authorization header required"
}
```

### **Database Connection Error**

```json
{
  "detail": "Authentication service unavailable"
}
```

## 🔍 **What the Backend Does**

### **1. API Key Validation**

```sql
SELECT ak.user_id, ak.name, ak.created_at, u.name as user_name
FROM api_keys ak
JOIN users u ON ak.user_id = u.id
WHERE ak.key = 'your_api_key'
```

### **2. User Lookup**

- If API key found → Extract `user_id`
- If API key not found → Return 401 error

### **3. Request Processing**

- Use the `user_id` for all subsequent database queries
- Same business logic as before, just different authentication

## 🧪 **Testing Your Setup**

### **1. Test Authentication**

```bash
curl -X GET "http://localhost:8001/api/v1/test-auth" \
  -H "Authorization: Bearer your_api_key_here"
```

### **2. Test Top Collections**

```bash
curl -X GET "http://localhost:8001/api/v1/top-collections" \
  -H "Authorization: Bearer your_api_key_here"
```

### **3. Test Add Bookmark**

```bash
curl -X POST "http://localhost:8001/api/v1/collections/collection_id/links" \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "title": "Test Bookmark"}'
```

## 📝 **Migration Notes**

### **For Your Browser Extension:**

1. **Replace user ID with API key** in storage/configuration
2. **Update all API calls** to use API key instead of user ID
3. **Test authentication** with the `/test-auth` endpoint
4. **Handle new error responses** for invalid API keys

### **For Development:**

1. **Create API keys** in your Cur8t web app settings
2. **Use real API keys** for testing (not user IDs)
3. **Check server logs** for detailed authentication flow
4. **Verify database queries** are working correctly

## 🔐 **Security Benefits**

- ✅ **API keys can be revoked** without affecting user account
- ✅ **Named API keys** for easier management
- ✅ **Audit trail** with creation timestamps
- ✅ **Separate from user credentials** for better security
- ✅ **Database validation** ensures keys are current and valid

## 🚀 **Next Steps**

1. **Update your browser extension** to use API keys
2. **Test all functionality** with the new authentication
3. **Update any documentation** or examples you have
4. **Consider rate limiting** API keys in production
5. **Add API key rotation** for enhanced security

Your FastAPI backend is now ready for production-grade API key authentication! 🎉
