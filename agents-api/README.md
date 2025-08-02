# Cur8t Agents API

AI agents for bookmark and collection management, powered by FastAPI and OpenAI.

## Features

- **Article Link Extractor**: Extract links from articles and create collections
- **Bookmark Importer**: Import and categorize bookmarks using AI
- **Smart Export Guide**: Export collections as detailed guides (coming soon)
- **Smart Collection Generator**: AI-powered collection creation (coming soon)
- **YouTube Link Extractor**: Extract links from YouTube descriptions (coming soon)
- **Watch Later Organizer**: Organize playlists into collections (coming soon)

## Quick Start

1. **Install Dependencies:**

```bash
pip install -r requirements.txt
```

2. **Environment Setup:**

```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your API keys
# OPENAI_API_KEY=your_openai_api_key_here
```

3. **Run the Development Server:**

```bash
python run_dev.py
```

4. **Access the API:**

- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Available Agents: http://localhost:8000/

## Environment Configuration

The API uses environment variables for configuration. Copy `env.example` to `.env` and configure:

```env
# Required for Bookmark Importer
OPENAI_API_KEY=your_openai_api_key_here

# Optional settings
OPENAI_MODEL=gpt-4-turbo-preview
MAX_BOOKMARKS_PER_BATCH=100
DEBUG=true
HOST=0.0.0.0
PORT=8000
```

## Available Agents

### 1. Article Link Extractor ✅

Extract all links from articles and create collections.

- **Endpoint**: `POST /agents/article-extractor/`
- **Status**: Active
- **Features**: HTML parsing, link filtering, collection creation

### 2. Bookmark Importer ✅

Import and categorize bookmarks using OpenAI.

- **Endpoint**: `POST /agents/bookmark-importer/upload`
- **Status**: Active
- **Features**: Multi-browser support, AI categorization, smart organization

### 3. Smart Export Guide

Export collections as detailed guides with descriptions.

- **Status**: Coming Soon
- **Features**: Markdown export, structured guides, custom formatting

### 4. Smart Collection Generator

AI-powered collection creation from topics or keywords.

- **Status**: Coming Soon
- **Features**: Topic-based generation, AI curation, smart categorization

### 5. YouTube Link Extractor

Extract links from YouTube video descriptions.

- **Status**: Coming Soon
- **Features**: YouTube API integration, description parsing, link extraction

### 6. Watch Later Organizer

Organize Watch Later playlists into collections.

- **Status**: Coming Soon
- **Features**: Playlist management, video categorization, collection creation

## API Documentation

Once running, visit http://localhost:8000/docs for interactive API documentation.

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp env.example .env
# Edit .env with your configuration

# Run development server
python run_dev.py

# Run tests
pytest tests/ -v
```

## Project Structure

```
agents-api/
├── agents/                 # Agent implementations
│   ├── article_extractor/  # Article link extraction
│   ├── bookmark_importer/  # Bookmark import & categorization
│   └── ...                # Other agents (coming soon)
├── config/                 # Configuration
├── core/                   # Shared models and utilities
├── tests/                  # Test files
└── main.py                # FastAPI application
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
