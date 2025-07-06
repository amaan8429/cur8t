# Bookmark Importer Agent

The Bookmark Importer Agent intelligently imports and categorizes bookmarks from various browsers using Google Gemini AI.

## Features

- **Multi-Browser Support**: Import bookmarks from Chrome, Firefox, Safari, and Edge
- **AI-Powered Categorization**: Uses Google Gemini to intelligently group bookmarks
- **Smart Organization**: Creates meaningful collections based on technology, topic, and purpose
- **Preview Mode**: Review categorizations before creating collections
- **Session Management**: Track processing status and progress
- **Flexible Configuration**: Customize categorization parameters

## API Endpoints

### 1. Upload Bookmarks

```
POST /agents/bookmark-importer/upload
```

Upload and parse bookmark HTML files.

**Parameters:**

- `file`: HTML bookmark file (multipart/form-data)
- `browser_type`: Optional browser hint (chrome, firefox, safari, edge)
- `user_preferences`: Optional JSON preferences

**Response:**

```json
{
  "success": true,
  "message": "Successfully uploaded 150 bookmarks",
  "session_id": "uuid-session-id",
  "total_bookmarks": 150,
  "browser_detected": "chrome",
  "folder_structure": {
    "Bookmarks bar": 25,
    "Development": 45,
    "Learning": 30
  },
  "processing_status": "uploaded"
}
```

### 2. Analyze Bookmarks

```
POST /agents/bookmark-importer/analyze
```

Categorize bookmarks using Gemini AI.

**Request Body:**

```json
{
  "session_id": "uuid-session-id",
  "max_categories": 5,
  "min_bookmarks_per_category": 3,
  "preferred_categories": ["React", "Python", "Tools"],
  "merge_similar_categories": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully categorized 140 bookmarks into 4 categories",
  "session_id": "uuid-session-id",
  "categories": [
    {
      "name": "React Development",
      "description": "React.js libraries and resources",
      "keywords": ["react", "javascript", "frontend"],
      "bookmarks": [...],
      "confidence_score": 0.9,
      "suggested_collection_name": "React Resources"
    }
  ],
  "total_bookmarks_processed": 150,
  "uncategorized_bookmarks": [...],
  "processing_time_seconds": 12.5,
  "ai_confidence_score": 0.87
}
```

### 3. Preview Categories

```
GET /agents/bookmark-importer/preview/{session_id}
```

Get categorization preview with statistics.

### 4. Create Collections

```
POST /agents/bookmark-importer/create-collections
```

Create final collections from selected categories.

**Request Body:**

```json
{
  "session_id": "uuid-session-id",
  "selected_categories": ["React Development", "Python Tools"],
  "custom_category_names": {
    "React Development": "My React Collection"
  }
}
```

### 5. Session Status

```
GET /agents/bookmark-importer/status/{session_id}
```

Get processing status and progress.

## Setup

1. **Install Dependencies:**

```bash
pip install -r requirements.txt
```

2. **Set Gemini API Key:**

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

3. **Run the API:**

```bash
python run_dev.py
```

## Usage Flow

1. **Upload** bookmark HTML file
2. **Analyze** bookmarks for categorization
3. **Preview** results and adjust if needed
4. **Create** collections from selected categories
5. **Clean up** session when done

## Browser Export Instructions

### Chrome

1. Settings → Bookmarks → Bookmark Manager
2. Three dots menu → Export bookmarks
3. Save as HTML file

### Firefox

1. Library → Bookmarks → Show All Bookmarks
2. Import and Backup → Export Bookmarks to HTML
3. Save as HTML file

### Safari

1. File → Export Bookmarks
2. Save as HTML file

### Edge

1. Settings → Profiles → Import browser data
2. Export to HTML file

## Configuration

Configure via `.env` file:

```env
# Required: Your Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Override default settings
GEMINI_MODEL=gemini-1.5-flash
MAX_BOOKMARKS_PER_BATCH=100
MAX_CATEGORIES_PER_ANALYSIS=10
MIN_BOOKMARKS_PER_CATEGORY=3
```

The settings will be automatically loaded from your `.env` file.

## Error Handling

The API provides detailed error responses:

- **400**: Invalid request or file format
- **404**: Session not found
- **500**: Processing error or AI service unavailable

## Testing

Run tests with:

```bash
pytest agents/bookmark_importer/tests.py -v
```

## Supported Formats

- **Chrome**: Standard HTML export format
- **Firefox**: Netscape bookmark format
- **Safari**: HTML bookmark format
- **Edge**: HTML export format
- **Generic**: Basic HTML with anchor tags
