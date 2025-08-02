"""
Tests for Bookmark Importer agent
"""

import pytest
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime

from .service import BookmarkImporterService
from .models import BookmarkItem, BookmarkCategory, BookmarkImportStatus
from core.models import ErrorResponse

# Sample Chrome bookmark HTML
CHROME_BOOKMARK_HTML = """
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3>Bookmarks bar</H3>
    <DL><p>
        <DT><A HREF="https://react.dev/" ADD_DATE="1642512000" LAST_MODIFIED="1642512000">React</A>
        <DT><A HREF="https://python.org/" ADD_DATE="1642512000" LAST_MODIFIED="1642512000">Python</A>
        <DT><A HREF="https://docs.python.org/3/" ADD_DATE="1642512000" LAST_MODIFIED="1642512000">Python Documentation</A>
    </DL><p>
    <DT><H3>Development Tools</H3>
    <DL><p>
        <DT><A HREF="https://github.com/" ADD_DATE="1642512000" LAST_MODIFIED="1642512000">GitHub</A>
        <DT><A HREF="https://stackoverflow.com/" ADD_DATE="1642512000" LAST_MODIFIED="1642512000">Stack Overflow</A>
    </DL><p>
</DL><p>
"""

class TestBookmarkImporterService:
    
    @pytest.fixture
    def service(self):
        """Create a service instance with mocked OpenAI"""
        with patch('agents.bookmark_importer.service.OpenAI') as mock_openai:
            mock_client = Mock()
            mock_openai.return_value = mock_client
            service = BookmarkImporterService()
            return service
    
    def test_parse_chrome_bookmarks(self, service):
        """Test parsing Chrome bookmark format"""
        bookmarks, browser_type, folder_structure = service._parse_bookmark_file(
            CHROME_BOOKMARK_HTML, "chrome"
        )
        
        assert browser_type == "chrome"
        assert len(bookmarks) == 5
        assert folder_structure["Bookmarks bar"] == 3
        assert folder_structure["Development Tools"] == 2
        
        # Check specific bookmarks
        react_bookmark = next((b for b in bookmarks if "react.dev" in b.url), None)
        assert react_bookmark is not None
        assert react_bookmark.title == "React"
        assert react_bookmark.folder_path == "Bookmarks bar"
        
        github_bookmark = next((b for b in bookmarks if "github.com" in b.url), None)
        assert github_bookmark is not None
        assert github_bookmark.folder_path == "Development Tools"
    
    def test_detect_browser_type(self, service):
        """Test browser type detection"""
        # Test with Chrome HTML
        soup = service._parse_bookmark_file(CHROME_BOOKMARK_HTML)[0]
        
        # Test with hint
        assert service._detect_browser_type(Mock(), "firefox") == "firefox"
        assert service._detect_browser_type(Mock(), "chrome") == "chrome"
    
    @pytest.mark.asyncio
    async def test_upload_bookmarks_success(self, service):
        """Test successful bookmark upload"""
        result, error = await service.upload_bookmarks(
            file_content=CHROME_BOOKMARK_HTML,
            filename="bookmarks.html",
            browser_type="chrome"
        )
        
        assert error is None
        assert result is not None
        assert result.success is True
        assert result.total_bookmarks == 5
        assert result.browser_detected == "chrome"
        assert result.session_id is not None
        assert result.processing_status == BookmarkImportStatus.UPLOADED
    
    @pytest.mark.asyncio
    async def test_upload_bookmarks_no_bookmarks(self, service):
        """Test upload with no valid bookmarks"""
        empty_html = "<html><body>No bookmarks here</body></html>"
        
        result, error = await service.upload_bookmarks(
            file_content=empty_html,
            filename="empty.html"
        )
        
        assert result is None
        assert error is not None
        assert error.error == "No bookmarks found"
    
    @pytest.mark.asyncio
    async def test_analyze_bookmarks_success(self, service):
        """Test successful bookmark analysis"""
        # First upload bookmarks
        upload_result, _ = await service.upload_bookmarks(
            file_content=CHROME_BOOKMARK_HTML,
            filename="bookmarks.html",
            browser_type="chrome"
        )
        
        # Mock OpenAI response
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = '''
        {
            "categories": [
                {
                    "name": "Programming Languages",
                    "description": "Programming language resources",
                    "keywords": ["python", "react", "programming"],
                    "bookmark_indices": [1, 2, 3],
                    "confidence_score": 0.9,
                    "suggested_collection_name": "Programming Resources"
                },
                {
                    "name": "Development Tools",
                    "description": "Tools for software development",
                    "keywords": ["github", "stackoverflow", "development"],
                    "bookmark_indices": [4, 5],
                    "confidence_score": 0.8,
                    "suggested_collection_name": "Dev Tools"
                }
            ]
        }
        '''
        
        with patch.object(service.client.chat.completions, 'create', return_value=mock_response):
            result, error = await service.analyze_bookmarks(
                session_id=upload_result.session_id,
                max_categories=5,
                min_bookmarks_per_category=2
            )
        
        assert error is None
        assert result is not None
        assert result.success is True
        assert len(result.categories) == 2
        assert result.total_bookmarks_processed == 5
        assert result.processing_status == BookmarkImportStatus.READY
        
        # Check categories
        programming_cat = next((c for c in result.categories if c.name == "Programming Languages"), None)
        assert programming_cat is not None
        assert len(programming_cat.bookmarks) == 3
        assert programming_cat.confidence_score == 0.9
    
    @pytest.mark.asyncio
    async def test_analyze_bookmarks_invalid_session(self, service):
        """Test analysis with invalid session ID"""
        result, error = await service.analyze_bookmarks(
            session_id="invalid-session-id",
            max_categories=5
        )
        
        assert result is None
        assert error is not None
        assert "not found" in error.error.lower()
    
    def test_session_status(self, service):
        """Test session status tracking"""
        # Create a mock session
        session_id = "test-session-123"
        service.sessions[session_id] = {
            "bookmarks": [Mock() for _ in range(10)],
            "status": BookmarkImportStatus.ANALYZING,
            "created_at": datetime.now()
        }
        
        status = service.get_session_status(session_id)
        
        assert status is not None
        assert status.session_id == session_id
        assert status.status == BookmarkImportStatus.ANALYZING
        assert status.total_bookmarks == 10
        assert status.progress_percentage == 75  # Based on ANALYZING status
    
    def test_session_status_not_found(self, service):
        """Test session status for non-existent session"""
        status = service.get_session_status("non-existent-session")
        assert status is None
    
    def test_fallback_categorization(self, service):
        """Test fallback categorization when AI fails"""
        bookmark_data = [
            {"url": "https://python.org", "title": "Python", "domain": "python.org"},
            {"url": "https://docs.python.org", "title": "Python Docs", "domain": "docs.python.org"},
            {"url": "https://github.com", "title": "GitHub", "domain": "github.com"},
            {"url": "https://stackoverflow.com", "title": "Stack Overflow", "domain": "stackoverflow.com"}
        ]
        
        categories = service._fallback_categorization(bookmark_data, 3)
        
        assert len(categories) >= 1
        for category in categories:
            assert len(category.bookmarks) >= 3  # Minimum threshold
            assert category.confidence_score == 0.7
    
    def test_create_categorization_prompt(self, service):
        """Test OpenAI prompt creation"""
        bookmark_data = [
            {"url": "https://python.org", "title": "Python", "domain": "python.org"},
            {"url": "https://react.dev", "title": "React", "domain": "react.dev"}
        ]
        
        prompt = service._create_categorization_prompt(
            bookmark_data=bookmark_data,
            max_categories=5,
            min_bookmarks_per_category=2,
            preferred_categories=["Programming", "Web Development"],
            merge_similar_categories=True
        )
        
        assert "2 bookmarks" in prompt
        assert "Python" in prompt
        assert "React" in prompt
        assert "max_categories" in prompt or "5" in prompt
        assert "Programming" in prompt
        assert "Web Development" in prompt
        assert "JSON" in prompt
    
    def test_parse_chrome_date(self, service):
        """Test Chrome date parsing"""
        # Test valid Unix timestamp
        date = service._parse_chrome_date("1642512000")
        assert date is not None
        assert isinstance(date, datetime)
        
        # Test invalid date
        invalid_date = service._parse_chrome_date("invalid")
        assert invalid_date is None
        
        # Test None date
        none_date = service._parse_chrome_date(None)
        assert none_date is None 