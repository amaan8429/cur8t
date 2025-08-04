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

### 5. Add Multiple Links to Collection

**POST** `/collections/{collection_id}/links/bulk`

Add multiple bookmarks/links to a specific collection at once. Perfect for browser extensions that want to save all open tabs.

#### Request

```http
POST /api/v1/collections/123e4567-e89b-12d3-a456-426614174000/links/bulk
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
Content-Type: application/json

{
  "links": [
    {
      "url": "https://fastapi.tiangolo.com/",
      "title": "FastAPI Documentation"
    },
    {
      "url": "https://github.com/",
      "title": "GitHub"
    },
    {
      "url": "https://stackoverflow.com/"
    }
  ]
}
```

#### Request Body Schema

```json
{
  "links": [
    {
      "url": "string (required, must be valid URL)",
      "title": "string (optional, max 100 characters)"
    }
  ]
}
```

**Note:** If `title` is not provided or empty for any link, the API will automatically extract the page title from the URL.

#### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174222",
      "title": "FastAPI Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "linkCollectionId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
      "createdAt": "2024-01-01T10:35:00Z",
      "updatedAt": "2024-01-01T10:35:00Z"
    },
    {
      "id": "890e1234-e89b-12d3-a456-426614174333",
      "title": "GitHub",
      "url": "https://github.com/",
      "linkCollectionId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
      "createdAt": "2024-01-01T10:35:00Z",
      "updatedAt": "2024-01-01T10:35:00Z"
    },
    {
      "id": "901e2345-e89b-12d3-a456-426614174444",
      "title": "Stack Overflow",
      "url": "https://stackoverflow.com/",
      "linkCollectionId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
      "createdAt": "2024-01-01T10:35:00Z",
      "updatedAt": "2024-01-01T10:35:00Z"
    }
  ],
  "total_added": 3,
  "total_requested": 3
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
      "loc": ["body", "links", 0, "url"],
      "msg": "invalid or missing URL scheme",
      "type": "value_error.url.scheme"
    }
  ]
}
```

**500 Internal Server Error**

```json
{
  "detail": "Failed to create bulk links: Database error"
}
```

---

### 6. Create Collection

**POST** `/collections`

Create a new collection.

#### Request

```http
POST /api/v1/collections
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
Content-Type: application/json

{
  "title": "My New Collection",
  "description": "A collection for my saved tabs",
  "visibility": "private"
}
```

#### Request Body Schema

```json
{
  "title": "string (required)",
  "description": "string (optional, defaults to empty string)",
  "visibility": "string (optional, 'private' or 'public', defaults to 'private')"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My New Collection",
    "description": "A collection for my saved tabs",
    "visibility": "private",
    "totalLinks": 0,
    "createdAt": "2024-01-01T10:35:00Z"
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

**422 Validation Error**

```json
{
  "detail": "Visibility must be 'private' or 'public'"
}
```

**500 Internal Server Error**

```json
{
  "detail": "Failed to create collection: Database error"
}
```

---

### 7. Create Collection with Links

**POST** `/collections/with-links`

Create a new collection and add multiple links to it in one call. Perfect for browser extensions that want to create a new collection and save all open tabs at once.

#### Request

```http
POST /api/v1/collections/with-links
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
Content-Type: application/json

{
  "title": "My Saved Tabs",
  "description": "Tabs saved on 2024-01-01",
  "visibility": "private",
  "links": [
    {
      "url": "https://fastapi.tiangolo.com/",
      "title": "FastAPI Documentation"
    },
    {
      "url": "https://github.com/",
      "title": "GitHub"
    },
    {
      "url": "https://stackoverflow.com/"
    }
  ]
}
```

#### Request Body Schema

```json
{
  "title": "string (required)",
  "description": "string (optional, defaults to empty string)",
  "visibility": "string (optional, 'private' or 'public', defaults to 'private')",
  "links": [
    {
      "url": "string (required, must be valid URL)",
      "title": "string (optional, max 100 characters)"
    }
  ]
}
```

**Note:** If `title` is not provided or empty for any link, the API will automatically extract the page title from the URL.

#### Success Response (200)

```json
{
  "success": true,
  "collection": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My Saved Tabs",
    "description": "Tabs saved on 2024-01-01",
    "visibility": "private",
    "totalLinks": 3,
    "createdAt": "2024-01-01T10:35:00Z"
  },
  "links": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174222",
      "title": "FastAPI Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "linkCollectionId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
      "createdAt": "2024-01-01T10:35:00Z",
      "updatedAt": "2024-01-01T10:35:00Z"
    },
    {
      "id": "890e1234-e89b-12d3-a456-426614174333",
      "title": "GitHub",
      "url": "https://github.com/",
      "linkCollectionId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
      "createdAt": "2024-01-01T10:35:00Z",
      "updatedAt": "2024-01-01T10:35:00Z"
    },
    {
      "id": "901e2345-e89b-12d3-a456-426614174444",
      "title": "Stack Overflow",
      "url": "https://stackoverflow.com/",
      "linkCollectionId": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
      "createdAt": "2024-01-01T10:35:00Z",
      "updatedAt": "2024-01-01T10:35:00Z"
    }
  ],
  "total_added": 3,
  "total_requested": 3
}
```

#### Error Responses

**401 Unauthorized**

```json
{
  "detail": "Authorization header required"
}
```

**422 Validation Error**

```json
{
  "detail": "Visibility must be 'private' or 'public'"
}
```

**500 Internal Server Error**

```json
{
  "detail": "Failed to create collection with links: Database error"
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

#### Add Multiple Bookmarks to Collection

```javascript
async function addBulkBookmarks(userId, collectionId, links) {
  try {
    const response = await fetch(
      `http://localhost:8001/api/v1/collections/${collectionId}/links/bulk`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userId}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          links: links.map((link) => ({
            url: link.url,
            ...(link.title && { title: link.title }),
          })),
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
    return data; // Returns { success, data, total_added, total_requested }
  } catch (error) {
    console.error("Failed to add bulk bookmarks:", error);
    throw error;
  }
}
```

#### Create New Collection

```javascript
async function createCollection(
  userId,
  title,
  description = "",
  visibility = "private"
) {
  try {
    const response = await fetch("http://localhost:8001/api/v1/collections", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        visibility,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.detail}`
      );
    }

    const data = await response.json();
    return data.data; // Returns the created collection
  } catch (error) {
    console.error("Failed to create collection:", error);
    throw error;
  }
}
```

#### Create Collection with Links

```javascript
async function createCollectionWithLinks(
  userId,
  title,
  links,
  description = "",
  visibility = "private"
) {
  try {
    const response = await fetch(
      "http://localhost:8001/api/v1/collections/with-links",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userId}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          visibility,
          links: links.map((link) => ({
            url: link.url,
            ...(link.title && { title: link.title }),
          })),
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
    return data; // Returns { success, collection, links, total_added, total_requested }
  } catch (error) {
    console.error("Failed to create collection with links:", error);
    throw error;
  }
}
```

#### Complete Extension Example

````javascript
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

// Add all open tabs to collection (browser extension use case)
async function saveAllTabsToCollection(userId, collectionId) {
  try {
    // Get all open tabs
    const tabs = await chrome.tabs.query({});

    // Prepare links data
    const links = tabs.map(tab => ({
      url: tab.url,
      title: tab.title
    }));

    // Add all tabs to collection
    const result = await addBulkBookmarks(userId, collectionId, links);

    console.log(`Successfully added ${result.total_added} out of ${result.total_requested} tabs`);

    // Close all tabs after successful save
    if (result.total_added > 0) {
      const tabIds = tabs.map(tab => tab.id);
      await chrome.tabs.remove(tabIds);
    }

    return result;
  } catch (error) {
    console.error("Failed to save all tabs:", error);
    throw error;
  }
}

// Create new collection and save all open tabs (browser extension use case)
async function createCollectionAndSaveTabs(userId, collectionTitle, collectionDescription = "") {
  try {
    // Get all open tabs
    const tabs = await chrome.tabs.query({});

    // Prepare links data
    const links = tabs.map(tab => ({
      url: tab.url,
      title: tab.title
    }));

    // Create collection with all tabs
    const result = await createCollectionWithLinks(
      userId,
      collectionTitle,
      links,
      collectionDescription
    );

    console.log(`Successfully created collection "${result.collection.title}" with ${result.total_added} tabs`);

    // Close all tabs after successful save
    if (result.total_added > 0) {
      const tabIds = tabs.map(tab => tab.id);
      await chrome.tabs.remove(tabIds);
    }

    return result;
  } catch (error) {
    console.error("Failed to create collection and save tabs:", error);
    throw error;
  }
}

// Example usage in extension popup
async function handleSaveAllTabs() {
  const userId = "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC";

  // Option 1: Save to existing collection
  const collections = await getTopCollections(userId);
  if (collections.length > 0) {
    await saveAllTabsToCollection(userId, collections[0].id);
  }

  // Option 2: Create new collection with tabs
  const timestamp = new Date().toISOString().split('T')[0];
  await createCollectionAndSaveTabs(
    userId,
    `Saved Tabs - ${timestamp}`,
    `Tabs saved on ${timestamp}`
  );
}

---

## Favorites Endpoints

### Get Favorites

**GET** `/favorites`

Retrieve the user's favorite links.

#### Request

```http
GET /api/v1/favorites
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
````

#### Success Response (200)

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "GitHub",
      "url": "https://github.com",
      "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Favorite

**POST** `/favorites`

Add a new favorite link.

#### Request

```http
POST /api/v1/favorites
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
Content-Type: application/json

{
  "title": "GitHub",
  "url": "https://github.com"
}
```

#### Request Body

| Field   | Type   | Required | Description                |
| ------- | ------ | -------- | -------------------------- |
| `title` | string | Yes      | The title for the favorite |
| `url`   | string | Yes      | The URL to favorite        |

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "GitHub",
    "url": "https://github.com",
    "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Favorite

**PUT** `/favorites/{favorite_id}`

Update a favorite link's title.

#### Request

```http
PUT /api/v1/favorites/{favorite_id}
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated Title",
    "url": "https://github.com",
    "userId": "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

### Delete Favorite

**DELETE** `/favorites/{favorite_id}`

Delete a favorite link.

#### Request

```http
DELETE /api/v1/favorites/{favorite_id}
Authorization: Bearer user_2rpYE73BYUo1CtmFy3hXiV0Z8BC
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Favorite deleted successfully"
}
```

### Favorite Data Model

```typescript
interface Favorite {
  id: string; // UUID
  title: string; // Favorite title
  url: string; // Favorite URL
  userId: string; // Owner user ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
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
