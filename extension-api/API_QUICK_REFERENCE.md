# Cur8t Extension API - Quick Reference

## Base URL

```
http://localhost:8001/api/v1
```

## Authentication

```
Authorization: Bearer {user_id}
```

---

## Endpoints

### 🏠 Health Check

```http
GET /
Response: {"message": "Extension API v1.0"}
```

### 🧪 Test Auth

```http
GET /test-auth
Headers: Authorization: Bearer user_123
```

### 📋 Get Top Collections

```http
GET /top-collections
Headers: Authorization: Bearer user_123
Response: {"data": [Collection...]}
```

### ➕ Add Bookmark

```http
POST /collections/{collection_id}/links
Headers: Authorization: Bearer user_123
Body: {"url": "https://...", "title": "optional"}
Response: {"success": true, "data": Link}
```

---

## Quick Code Examples

### Initialize API Client

```javascript
class Cur8tAPI {
  constructor(userId) {
    this.userId = userId;
    this.baseURL = "http://localhost:8001/api/v1";
  }

  async request(endpoint, options = {}) {
    return fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.userId}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    }).then((r) => r.json());
  }
}
```

### Get Collections

```javascript
const api = new Cur8tAPI("user_123");
const collections = await api.request("/top-collections");
// collections.data = [Collection...]
```

### Add Bookmark

```javascript
const bookmark = await api.request(`/collections/${collectionId}/links`, {
  method: "POST",
  body: JSON.stringify({
    url: window.location.href,
    title: document.title,
  }),
});
// bookmark.data = Link object
```

---

## Error Codes

| Code | Meaning                     |
| ---- | --------------------------- |
| 401  | Missing/invalid auth header |
| 404  | User/Collection not found   |
| 422  | Invalid request data        |
| 500  | Server/Database error       |

---

## Data Types

### Collection

```typescript
{
  id: string; // UUID
  title: string; // Name
  description: string; // Description
  visibility: string; // "private" | "public"
  totalLinks: number; // Link count
  createdAt: string; // ISO date
}
```

### Link

```typescript
{
  id: string; // UUID
  title: string; // Link title
  url: string; // Link URL
  linkCollectionId: string; // Parent collection
  userId: string; // Owner
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```
