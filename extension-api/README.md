# Extension API

FastAPI backend for the Cur8t browser extension.

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up environment variables:
   Create a `.env` file with:

```
DATABASE_URL=postgresql://username:password@localhost:5432/cur8t
CLERK_SECRET_KEY=your_clerk_secret_key_here
DEBUG=True
```

3. Run the development server:

```bash
python run_dev.py
```

The API will be available at `http://localhost:8001`

## API Endpoints

### GET /api/v1/top-collections

Fetch user's top 5 collections.

**Headers:**

- `Authorization: Bearer {user_id}`

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Collection Title",
      "description": "Collection description",
      "visibility": "private",
      "totalLinks": 10,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/v1/collections/{collection_id}/links

Add a link to a specific collection.

**Headers:**

- `Authorization: Bearer {user_id}`

**Request Body:**

```json
{
  "title": "Optional link title",
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Link Title",
    "url": "https://example.com",
    "linkCollectionId": "collection_uuid",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## Authentication

Currently, the API expects the user ID to be passed in the Authorization header as `Bearer {user_id}`. In production, this should be replaced with proper JWT token validation from Clerk.

## Database

The API connects to the same PostgreSQL database used by the Next.js application, using the tables:

- `users` - User information and top collections
- `collections` - Collection metadata
- `links` - Individual links within collections
