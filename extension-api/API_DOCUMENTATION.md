# Cur8t Extension API Documentation

## Overview

The Cur8t Extension API is a FastAPI backend designed specifically for browser extensions to interact with the Cur8t bookmark collection system. It provides endpoints to fetch user collections and add new bookmarks without overloading the main Next.js application.

## Base URL

```
http://localhost:8001/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header.

### Header Format

```
Authorization: Bearer {user_id}
```

### Example

```
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
```

**Note:** Currently uses Clerk user IDs directly. In production, this should be replaced with JWT tokens.

---

## Endpoints

### 1. Health Check

**GET** `/`

Check if the API is running.

#### Request

```http
GET /api/v1/
```

#### Response

```json
{
  "message": "Extension API v1.0"
}
```

---

### 2. Test Authentication

**GET** `/test-auth`

Debug endpoint to test authorization header parsing.

#### Request

```http
GET /api/v1/test-auth
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
```

#### Response

```json
{
  "received_header": "Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
  "extracted_user_id": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
  "header_present": true,
  "header_length": 45,
  "starts_with_bearer": true
}
```

---

### 3. Get Top Collections

**GET** `/top-collections`

Retrieve the user's top 5 favorite collections as configured in their settings.

#### Request

```http
GET /api/v1/top-collections
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
Content-Type: application/json
```

#### Success Response (200)

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "My Favorite Articles",
      "description": "Collection of interesting reads",
      "visibility": "private",
      "totalLinks": 15,
      "createdAt": "2024-01-01T10:30:00Z"
    },
    {
      "id": "456e7890-e89b-12d3-a456-426614174111",
      "title": "Tech Resources",
      "description": "Useful development tools and tutorials",
      "visibility": "public",
      "totalLinks": 23,
      "createdAt": "2024-01-15T14:20:00Z"
    }
  ]
}
```

#### Error Responses

**401 Unauthorized**

```json
{
  "detail": "Authorization header required"
}
```

**404 Not Found**

```json
{
  "detail": "User not found"
}
```

**500 Internal Server Error**

```json
{
  "detail": "Failed to fetch top collections: Database connection error"
}
```

---

### 4. Add Link to Collection

**POST** `/collections/{collection_id}/links`

Add a new bookmark/link to a specific collection.

#### Request

```http
POST /api/v1/collections/123e4567-e89b-12d3-a456-426614174000/links
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
Content-Type: application/json

{
  "url": "https://fastapi.tiangolo.com/",
  "title": "FastAPI Documentation"
}
```

#### Request Body Schema

```json
{
  "url": "string (required, must be valid URL)",
  "title": "string (optional, max 100 characters)"
}
```

**Note:** If `title` is not provided or empty, the API will automatically extract the page title from the URL.

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "789e0123-e89b-12d3-a456-426614174222",
    "title": "FastAPI Documentation",
    "url": "https://fastapi.tiangolo.com/",
    "linkCollectionId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
    "createdAt": "2024-01-01T10:35:00Z",
    "updatedAt": "2024-01-01T10:35:00Z"
  }
}
```

#### Error Responses

**401 Unauthorized**

```json
{
  "detail": "Authorization header required"
}
```

**404 Not Found**

```json
{
  "detail": "Collection not found"
}
```

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": ["body", "url"],
      "msg": "invalid or missing URL scheme",
      "type": "value_error.url.scheme"
    }
  ]
}
```

**500 Internal Server Error**

```json
{
  "detail": "Failed to create link: Database error"
}
```

---

## Data Models

### Collection

```typescript
interface Collection {
  id: string; // UUID
  title: string; // Collection name
  description: string; // Collection description
  visibility: string; // "private" | "public"
  totalLinks: number; // Number of links in collection
  createdAt: string; // ISO date string
}
```

### Link

```typescript
interface Link {
  id: string; // UUID
  title: string; // Link title
  url: string; // Link URL
  linkCollectionId: string; // Parent collection UUID
  userId: string; // Owner user ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

---

## Browser Extension Integration Examples

### JavaScript/TypeScript

#### Fetch Top Collections

```javascript
async function getTopCollections(userId) {
  try {
    const response = await fetch(
      "http://localhost:8001/api/v1/top-collections",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userId}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Array of collections
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw error;
  }
}
```

#### Add Bookmark to Collection

```javascript
async function addBookmark(userId, collectionId, url, title = null) {
  try {
    const response = await fetch(
      `http://localhost:8001/api/v1/collections/${collectionId}/links`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userId}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          ...(title && { title: title }),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.detail}`
      );
    }

    const data = await response.json();
    return data.data; // Created link object
  } catch (error) {
    console.error("Failed to add bookmark:", error);
    throw error;
  }
}
```

#### Complete Extension Example

```javascript
// Background script or content script
class Cur8tAPI {
  constructor(userId) {
    this.userId = userId;
    this.baseURL = "http://localhost:8001/api/v1";
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultHeaders = {
      Authorization: `Bearer ${this.userId}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
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
}

// Usage in extension
const api = new Cur8tAPI("user_2rpYE73BYUo1CtmFy3hXiV0Z8BC");

// Get collections for dropdown
const collections = await api.getTopCollections();

// Add current page to collection
const currentUrl = window.location.href;
const pageTitle = document.title;
const newBookmark = await api.addBookmark(
  collections[0].id,
  currentUrl,
  pageTitle
);
```

---

## Error Handling

### Common Error Patterns

#### Authentication Errors

- **401**: Missing or invalid authorization header
- **404**: User not found in database

#### Validation Errors

- **422**: Invalid request body (malformed URL, missing required fields)

#### Server Errors

- **500**: Database connection issues, internal server errors

### Error Response Format

All errors follow this structure:

```json
{
  "detail": "Error message description"
}
```

For validation errors (422), additional details are provided:

```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "Error description",
      "type": "error_type"
    }
  ]
}
```

---

## CORS Configuration

The API is configured to allow all origins for development:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

**Note:** Configure CORS properly for production deployment.

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

---

## Development Notes

### Environment Setup

1. Create `.env` file with `DATABASE_URL`
2. Install dependencies: `pip install -r requirements.txt`
3. Run server: `python run_dev.py`
4. API available at: `http://localhost:8001`
5. Documentation at: `http://localhost:8001/docs`

### Testing

- Use the `/test-auth` endpoint to verify authorization setup
- Check server logs for detailed debugging information
- Use Swagger UI at `/docs` for interactive testing

### Production Considerations

1. Replace direct user ID auth with JWT token validation
2. Configure proper CORS origins
3. Add rate limiting
4. Set up proper logging and monitoring
5. Use environment variables for configuration
6. Set up database connection pooling
