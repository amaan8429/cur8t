"""
Tests for Article Link Extractor agent
"""

from unittest.mock import Mock, patch

import pytest
import requests

from core.models import ErrorResponse

from .models import ArticleLinkRequest, ArticleLinkResponse
from .service import ArticleLinkExtractorService


class TestArticleLinkExtractorService:
    """Test suite for ArticleLinkExtractorService"""

    def setup_method(self):
        """Setup test instance"""
        self.service = ArticleLinkExtractorService()

    def test_valid_url_validation(self):
        """Test URL validation with valid URLs"""
        valid_urls = [
            "https://example.com",
            "http://test.com/article",
            "https://subdomain.example.com/path",
        ]

        for url in valid_urls:
            # Should not return validation error
            result, error = self.service.extract_links_from_article(url)
            if error and error.error == "Invalid URL":
                pytest.fail(f"Valid URL {url} was rejected")

    def test_invalid_url_validation(self):
        """Test URL validation with invalid URLs"""
        invalid_urls = [
            "not-a-url",
            "ftp://example.com",
            "javascript:alert('test')",
            "",
        ]

        for url in invalid_urls:
            result, error = self.service.extract_links_from_article(url)
            assert error is not None
            assert error.error == "Invalid URL"

    @patch("requests.Session.get")
    def test_successful_extraction(self, mock_get):
        """Test successful link extraction"""
        # Mock HTML response
        mock_response = Mock()
        mock_response.content = b"""
        <html>
            <head><title>Test Article</title></head>
            <body>
                <h1>Article Title</h1>
                <p>Some content with <a href="https://example.com">a link</a></p>
                <a href="/relative-link">Relative Link</a>
                <a href="https://test.com">Another Link</a>
            </body>
        </html>
        """
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        result, error = self.service.extract_links_from_article(
            "https://test-article.com"
        )

        assert error is None
        assert result is not None
        assert result.success is True
        assert result.article_title == "Test Article"
        assert result.total_links_found > 0
        assert len(result.extracted_links) > 0

    @patch("requests.Session.get")
    def test_request_exception_handling(self, mock_get):
        """Test handling of request exceptions"""
        mock_get.side_effect = requests.exceptions.ConnectionError("Connection failed")

        result, error = self.service.extract_links_from_article("https://example.com")

        assert result is None
        assert error is not None
        assert error.error == "Failed to fetch article"
        assert error.error_code == "FETCH_ERROR"

    def test_collection_name_generation(self):
        """Test automatic collection name generation"""
        # Test with custom name
        with patch("requests.Session.get") as mock_get:
            mock_response = Mock()
            mock_response.content = (
                b"<html><head><title>Test</title></head><body></body></html>"
            )
            mock_response.raise_for_status.return_value = None
            mock_get.return_value = mock_response

            result, error = self.service.extract_links_from_article(
                "https://example.com", collection_name="Custom Collection"
            )

            assert error is None
            assert result.collection_name == "Custom Collection"

        # Test with auto-generated name
        with patch("requests.Session.get") as mock_get:
            mock_response = Mock()
            mock_response.content = (
                b"<html><head><title>Article Title</title></head><body></body></html>"
            )
            mock_response.raise_for_status.return_value = None
            mock_get.return_value = mock_response

            result, error = self.service.extract_links_from_article(
                "https://example.com"
            )

            assert error is None
            assert "Links from Article Title" in result.collection_name


def test_article_link_request_model():
    """Test ArticleLinkRequest model validation"""
    # Valid request
    request = ArticleLinkRequest(
        article_url="https://example.com", collection_name="Test Collection"
    )
    assert request.article_url == "https://example.com"
    assert request.collection_name == "Test Collection"

    # Request without collection name (optional)
    request = ArticleLinkRequest(article_url="https://example.com")
    assert request.article_url == "https://example.com"
    assert request.collection_name is None


if __name__ == "__main__":
    pytest.main([__file__])
