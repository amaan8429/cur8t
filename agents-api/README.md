# Cur8t Agents API

AI agents for bookmark and collection management built with FastAPI.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd agents-api
pip install -r requirements.txt
```

### 2. Run the API Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### 3. View API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 4. Test the API

Run the test script to verify everything works:

```bash
python test_api.py
```

## 🤖 Available Agents

### 1. Article Link Extractor

**Endpoint**: `POST /agents/article-extractor`

**Description**: Extracts all links from an article and prepares them for collection creation.

**Request Body**:

```json
{
  "article_url": "https://example.com/article",
  "collection_name": "Optional Custom Collection Name"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Successfully extracted 15 links from the article",
  "article_title": "Example Article Title",
  "article_url": "https://example.com/article",
  "total_links_found": 15,
  "extracted_links": [
    {
      "url": "https://example.com/link1",
      "title": "Link Title",
      "description": "Link description",
      "domain": "example.com"
    }
  ],
  "collection_name": "Links from Example Article Title",
  "created_at": "2024-01-01T12:00:00"
}
```

**Features**:

- ✅ Smart link detection and extraction
- ✅ Filters out social sharing links and duplicates
- ✅ Extracts article title automatically
- ✅ Generates collection name if not provided
- ✅ Returns structured data ready for collection creation

## 🛠️ API Endpoints

### Core Endpoints

- `GET /` - API information and available agents
- `GET /health` - API health check

### Agent Endpoints

- `POST /agents/article-extractor` - Extract links from article
- `GET /agents/article-extractor/health` - Article extractor health check

## 🔧 Development

### Project Structure

```
agents-api/
├── main.py              # FastAPI app entry point
├── requirements.txt     # Python dependencies
├── test_api.py         # Test script
├── README.md           # This file
└── agents/             # Agents package
    ├── __init__.py     # Package init
    ├── models.py       # Pydantic models
    ├── routes.py       # API routes
    └── article_extractor.py  # Article link extractor implementation
```

### Adding New Agents

1. Create a new agent file in the `agents/` directory
2. Add Pydantic models to `agents/models.py`
3. Add routes to `agents/routes.py`
4. Update the agents list in `main.py`

### Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid URL or request data
- **500 Internal Server Error**: Processing errors
- **422 Unprocessable Entity**: Validation errors

## 🌐 CORS Configuration

The API is configured to accept requests from:

- `http://localhost:3000` (Next.js frontend)

To add more origins, update the `allow_origins` list in `main.py`.

## 📝 Example Usage with curl

```bash
# Health check
curl http://localhost:8000/health

# Extract links from article
curl -X POST "http://localhost:8000/agents/article-extractor" \
  -H "Content-Type: application/json" \
  -d '{
    "article_url": "https://example.com/article",
    "collection_name": "My Test Collection"
  }'
```

## 🔮 Coming Soon

- Agent 2: Smart Export Guide
- Agent 3: Smart Collection Generator
- Agent 4: YouTube Link Extractor
- Agent 5: Watch Later Organizer
- Agent 6: Bookmark File Importer

---

Built with ❤️ using FastAPI and Python
