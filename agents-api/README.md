# Cur8t Agents API

AI agents for bookmark and collection management built with FastAPI.

## 🏗️ Project Structure

```
agents-api/
├── main.py                    # FastAPI app entry point
├── requirements.txt           # Python dependencies
├── test_api.py               # Quick API test script
├── README.md                 # This file
├── config/                   # Configuration
│   ├── __init__.py
│   └── settings.py           # Application settings
├── core/                     # Shared components
│   ├── __init__.py
│   ├── models.py             # Shared models (BaseResponse, ErrorResponse, etc.)
│   └── utils.py              # Shared utilities (URL validation, etc.)
├── agents/                   # Individual agent modules
│   ├── __init__.py           # Agent registry and routing
│   ├── article_extractor/    # Article Link Extractor Agent
│   │   ├── __init__.py
│   │   ├── models.py         # Agent-specific models
│   │   ├── service.py        # Core business logic
│   │   ├── routes.py         # API endpoints
│   │   └── tests.py          # Agent tests
│   ├── smart_export/         # Smart Export Guide Agent (Coming Soon)
│   │   └── __init__.py
│   ├── collection_generator/ # Smart Collection Generator (Coming Soon)
│   │   └── __init__.py
│   ├── youtube_extractor/    # YouTube Link Extractor (Coming Soon)
│   │   └── __init__.py
│   ├── watch_later_organizer/ # Watch Later Organizer (Coming Soon)
│   │   └── __init__.py
│   └── bookmark_importer/    # Bookmark File Importer (Coming Soon)
│       └── __init__.py
└── tests/                    # Integration tests
    ├── __init__.py
    └── test_integration.py   # API integration tests
```

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

Run the quick test script:

```bash
python test_api.py
```

Or run the full test suite:

```bash
pytest tests/
```

## 🤖 Available Agents

### 1. Article Link Extractor ✅ ACTIVE

**Endpoint**: `POST /agents/article-extractor/`

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
  "created_at": "2024-01-01T12:00:00",
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
  "collection_name": "Links from Example Article Title"
}
```

**Features**:

- ✅ Smart link detection and extraction
- ✅ Filters out social sharing links and duplicates
- ✅ Extracts article title automatically
- ✅ Generates collection name if not provided
- ✅ Returns structured data ready for collection creation

### 2-6. Other Agents 🚧 COMING SOON

- **Smart Export Guide** - Export collections as detailed guides
- **Smart Collection Generator** - AI-powered collection creation
- **YouTube Link Extractor** - Extract links from video descriptions
- **Watch Later Organizer** - Organize playlists into collections
- **Bookmark File Importer** - Import and organize bookmark files

## 🛠️ API Endpoints

### Core Endpoints

- `GET /` - API information and available agents
- `GET /health` - API health check
- `GET /docs` - Interactive API documentation

### Agent Endpoints

- `POST /agents/article-extractor/` - Extract links from article
- `GET /agents/article-extractor/health` - Article extractor health check

## 🧪 Development

### Adding New Agents

1. Create a new directory in `agents/` for your agent
2. Add the following files:
   ```
   agents/your_agent/
   ├── __init__.py
   ├── models.py      # Pydantic models for requests/responses
   ├── service.py     # Core business logic
   ├── routes.py      # FastAPI routes
   └── tests.py       # Unit tests
   ```
3. Update `agents/__init__.py` to register your agent
4. The agent will automatically be included in the API

### Running Tests

```bash
# Run all tests
pytest

# Run specific agent tests
pytest agents/article_extractor/tests.py

# Run integration tests
pytest tests/

# Run with coverage
pytest --cov=agents --cov=core
```

### Configuration

Settings are managed in `config/settings.py`. Key settings:

- `request_timeout`: HTTP request timeout (default: 30s)
- `max_links_per_extraction`: Maximum links per extraction (default: 50)
- `allowed_origins`: CORS allowed origins
- `user_agent`: User agent for web scraping

## 🌐 CORS Configuration

The API accepts requests from:

- `http://localhost:3000` (Next.js frontend)
- `http://127.0.0.1:3000`
- `https://localhost:3000`

## 📝 Example Usage

### With curl

```bash
# Health check
curl http://localhost:8000/health

# Extract links from article
curl -X POST "http://localhost:8000/agents/article-extractor/" \
  -H "Content-Type: application/json" \
  -d '{
    "article_url": "https://example.com/article",
    "collection_name": "My Test Collection"
  }'
```

### With Python

```python
import requests

# Test the API
response = requests.post(
    "http://localhost:8000/agents/article-extractor/",
    json={
        "article_url": "https://example.com/article",
        "collection_name": "My Collection"
    }
)

if response.status_code == 200:
    result = response.json()
    print(f"Found {result['total_links_found']} links!")
    for link in result['extracted_links']:
        print(f"- {link['title']}: {link['url']}")
```

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid URL or request data
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Processing errors

All errors return a standard format:

```json
{
  "success": false,
  "error": "Error description",
  "details": "Detailed error information",
  "error_code": "ERROR_TYPE"
}
```

---

Built with ❤️ using FastAPI and Python
