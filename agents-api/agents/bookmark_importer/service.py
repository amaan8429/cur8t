"""
Bookmark Importer service implementation
"""

import asyncio
import json
import os
import re
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup
from openai import OpenAI

from config.settings import settings
from core.models import ErrorResponse
from core.utils import clean_text, get_domain_from_url, is_valid_url

from .models import (
    BookmarkAnalysisResponse,
    BookmarkCategory,
    BookmarkImportStatus,
    BookmarkItem,
    BookmarkPreviewResponse,
    BookmarkSessionStatus,
    BookmarkUploadResponse,
    CollectionCreationResponse,
)


class BookmarkImporterService:
    """Service for importing and categorizing bookmarks using OpenAI"""

    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}  # In-memory session storage
        self._initialize_openai()

    def _initialize_openai(self):
        """Initialize OpenAI client"""
        api_key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError(
                "OpenAI API key not configured. Set OPENAI_API_KEY environment variable"
            )

        self.client = OpenAI(api_key=api_key)
        self.model = settings.openai_model

    async def upload_bookmarks(
        self,
        file_content: str,
        filename: str,
        browser_type: Optional[str] = None,
        user_preferences: Optional[Dict[str, Any]] = None,
    ) -> Tuple[Optional[BookmarkUploadResponse], Optional[ErrorResponse]]:
        """
        Upload and parse bookmark file

        Args:
            file_content: HTML content of bookmark file
            filename: Original filename
            browser_type: Browser type hint
            user_preferences: User categorization preferences

        Returns:
            Tuple of (response, error) - one will be None
        """
        try:
            # Create session
            session_id = str(uuid.uuid4())

            # Parse bookmarks
            bookmarks, detected_browser, folder_structure = self._parse_bookmark_file(
                file_content, browser_type
            )

            if not bookmarks:
                return None, ErrorResponse(
                    error="No bookmarks found",
                    details="Could not extract any valid bookmarks from the file",
                )

            # Store session data
            self.sessions[session_id] = {
                "bookmarks": bookmarks,
                "filename": filename,
                "browser_type": detected_browser,
                "folder_structure": folder_structure,
                "user_preferences": user_preferences or {},
                "status": BookmarkImportStatus.UPLOADED,
                "created_at": datetime.now(),
                "categories": None,
                "analysis_result": None,
            }

            # Create response
            response = BookmarkUploadResponse(
                success=True,
                message=f"Successfully uploaded {len(bookmarks)} bookmarks",
                session_id=session_id,
                total_bookmarks=len(bookmarks),
                browser_detected=detected_browser,
                folder_structure=folder_structure,
                processing_status=BookmarkImportStatus.UPLOADED,
            )

            return response, None

        except Exception as e:
            return None, ErrorResponse(
                error="Upload failed", details=str(e), error_code="UPLOAD_ERROR"
            )

    def _parse_bookmark_file(
        self, file_content: str, browser_hint: Optional[str] = None
    ) -> Tuple[List[BookmarkItem], Optional[str], Dict[str, int]]:
        """Parse HTML bookmark file from various browsers"""

        soup = BeautifulSoup(file_content, "html.parser")
        bookmarks = []
        folder_structure = {}

        # Detect browser type
        browser_type = self._detect_browser_type(soup, browser_hint)

        # Parse bookmarks based on browser type
        if browser_type == "chrome":
            bookmarks, folder_structure = self._parse_chrome_bookmarks(soup)
        elif browser_type == "firefox":
            bookmarks, folder_structure = self._parse_firefox_bookmarks(soup)
        elif browser_type == "safari":
            bookmarks, folder_structure = self._parse_safari_bookmarks(soup)
        else:
            # Generic parsing
            bookmarks, folder_structure = self._parse_generic_bookmarks(soup)

        return bookmarks, browser_type, folder_structure

    def _detect_browser_type(
        self, soup: BeautifulSoup, hint: Optional[str]
    ) -> Optional[str]:
        """Detect browser type from HTML structure"""
        if hint and hint.lower() in ["chrome", "firefox", "safari", "edge"]:
            return hint.lower()

        # Look for browser-specific patterns
        if soup.find(
            "meta",
            {"name": "GENERATOR", "content": re.compile(r"Bookmarks.*Chrome", re.I)},
        ):
            return "chrome"
        elif soup.find("h1", string=re.compile(r"Bookmarks.*Firefox", re.I)):
            return "firefox"
        elif soup.find("title", string=re.compile(r"Safari.*Bookmarks", re.I)):
            return "safari"
        elif soup.find("dt") and soup.find("a", href=True):
            return "generic"

        return None

    def _parse_chrome_bookmarks(
        self, soup: BeautifulSoup
    ) -> Tuple[List[BookmarkItem], Dict[str, int]]:
        """Parse Chrome bookmark format"""
        bookmarks = []
        folder_structure = {}

        def parse_folder(dl_element, folder_path=""):
            for item in dl_element.find_all(["dt"], recursive=False):
                # Check if it's a folder
                folder_header = item.find("h3")
                if folder_header:
                    folder_name = folder_header.get_text(strip=True)
                    current_path = (
                        f"{folder_path}/{folder_name}" if folder_path else folder_name
                    )
                    folder_structure[current_path] = 0

                    # Find the nested DL element
                    nested_dl = item.find("dl")
                    if nested_dl:
                        parse_folder(nested_dl, current_path)

                # Check if it's a bookmark
                link = item.find("a", href=True)
                if link:
                    url = link["href"]
                    title = link.get_text(strip=True)
                    date_added = self._parse_chrome_date(link.get("add_date"))

                    if is_valid_url(url):
                        bookmark = BookmarkItem(
                            url=url,
                            title=title,
                            date_added=date_added,
                            folder_path=folder_path,
                        )
                        bookmarks.append(bookmark)

                        if folder_path:
                            folder_structure[folder_path] = (
                                folder_structure.get(folder_path, 0) + 1
                            )

        # Start parsing from the root DL element
        root_dl = soup.find("dl")
        if root_dl:
            parse_folder(root_dl)

        return bookmarks, folder_structure

    def _parse_firefox_bookmarks(
        self, soup: BeautifulSoup
    ) -> Tuple[List[BookmarkItem], Dict[str, int]]:
        """Parse Firefox bookmark format"""
        # Firefox format is similar to Chrome but with some differences
        return self._parse_chrome_bookmarks(soup)  # Use Chrome parser as base

    def _parse_safari_bookmarks(
        self, soup: BeautifulSoup
    ) -> Tuple[List[BookmarkItem], Dict[str, int]]:
        """Parse Safari bookmark format"""
        # Safari exports are typically in plist format, but also support HTML
        return self._parse_chrome_bookmarks(soup)

    def _parse_generic_bookmarks(
        self, soup: BeautifulSoup
    ) -> Tuple[List[BookmarkItem], Dict[str, int]]:
        """Generic bookmark parsing for unknown formats"""
        bookmarks = []
        folder_structure = {"Unknown": 0}

        # Find all links
        for link in soup.find_all("a", href=True):
            url = link["href"]
            title = link.get_text(strip=True)

            if is_valid_url(url) and title:
                bookmark = BookmarkItem(url=url, title=title, folder_path="Unknown")
                bookmarks.append(bookmark)
                folder_structure["Unknown"] += 1

        return bookmarks, folder_structure

    def _parse_chrome_date(self, date_str: Optional[str]) -> Optional[datetime]:
        """Parse Chrome bookmark date format"""
        if not date_str:
            return None
        try:
            # Chrome uses Unix timestamp in seconds
            timestamp = int(date_str)
            return datetime.fromtimestamp(timestamp)
        except (ValueError, TypeError):
            return None

    async def analyze_bookmarks(
        self,
        session_id: str,
        max_categories: int = 5,
        min_bookmarks_per_category: int = 3,
        preferred_categories: Optional[List[str]] = None,
        merge_similar_categories: bool = True,
    ) -> Tuple[Optional[BookmarkAnalysisResponse], Optional[ErrorResponse]]:
        """
        Analyze bookmarks using OpenAI for intelligent categorization
        """
        try:
            # Get session data
            session = self.sessions.get(session_id)
            if not session:
                return None, ErrorResponse(
                    error="Session not found",
                    details="Invalid session ID or session expired",
                )

            # Update status
            session["status"] = BookmarkImportStatus.ANALYZING

            bookmarks = session["bookmarks"]
            start_time = datetime.now()

            # Prepare bookmark data for AI analysis
            bookmark_data = []
            for bookmark in bookmarks:
                bookmark_data.append(
                    {
                        "url": bookmark.url,
                        "title": bookmark.title,
                        "domain": get_domain_from_url(bookmark.url),
                        "folder": bookmark.folder_path,
                    }
                )

            # Get categorization from OpenAI
            categories = await self._categorize_with_openai(
                bookmark_data,
                max_categories,
                min_bookmarks_per_category,
                preferred_categories,
                merge_similar_categories,
            )

            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds()

            # Separate categorized and uncategorized bookmarks
            categorized_urls = set()
            for category in categories:
                for bookmark in category.bookmarks:
                    categorized_urls.add(bookmark.url)

            uncategorized_bookmarks = [
                bookmark
                for bookmark in bookmarks
                if bookmark.url not in categorized_urls
            ]

            # Calculate AI confidence score
            total_bookmarks = len(bookmarks)
            categorized_count = len(categorized_urls)
            ai_confidence = (
                categorized_count / total_bookmarks if total_bookmarks > 0 else 0.0
            )

            # Update session
            session["categories"] = categories
            session["analysis_result"] = {
                "categories": categories,
                "uncategorized_bookmarks": uncategorized_bookmarks,
                "processing_time": processing_time,
                "confidence_score": ai_confidence,
            }
            session["status"] = BookmarkImportStatus.READY

            # Create response
            response = BookmarkAnalysisResponse(
                success=True,
                message=f"Successfully categorized {categorized_count} bookmarks into {len(categories)} categories",
                session_id=session_id,
                categories=categories,
                total_bookmarks_processed=len(bookmarks),
                uncategorized_bookmarks=uncategorized_bookmarks,
                processing_time_seconds=processing_time,
                ai_confidence_score=ai_confidence,
                processing_status=BookmarkImportStatus.READY,
            )

            return response, None

        except Exception as e:
            # Update session status on error
            if session_id in self.sessions:
                self.sessions[session_id]["status"] = BookmarkImportStatus.FAILED

            return None, ErrorResponse(
                error="Analysis failed", details=str(e), error_code="ANALYSIS_ERROR"
            )

    async def _categorize_with_openai(
        self,
        bookmark_data: List[Dict[str, Any]],
        max_categories: int,
        min_bookmarks_per_category: int,
        preferred_categories: Optional[List[str]],
        merge_similar_categories: bool,
    ) -> List[BookmarkCategory]:
        """Use OpenAI to categorize bookmarks"""

        # Prepare the prompt for OpenAI
        prompt = self._create_categorization_prompt(
            bookmark_data,
            max_categories,
            min_bookmarks_per_category,
            preferred_categories,
            merge_similar_categories,
        )

        try:
            # Generate categorization using OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=4000,  # Reduced to match model limits
                temperature=0.3,  # Lower temperature for more consistent categorization
                response_format={"type": "json_object"},
            )

            # Parse the response
            categories = self._parse_openai_response(
                response.choices[0].message.content, bookmark_data
            )
            return categories

        except Exception as e:
            print(f"OpenAI API failed: {e}")
            print(f"Prompt length: {len(prompt)} characters")
            print(f"Bookmarks count: {len(bookmark_data)}")
            # Fallback to simple categorization if AI fails
            return self._fallback_categorization(
                bookmark_data, max_categories, min_bookmarks_per_category
            )

    def _create_categorization_prompt(
        self,
        bookmark_data: List[Dict[str, Any]],
        max_categories: int,
        min_bookmarks_per_category: int,
        preferred_categories: Optional[List[str]],
        merge_similar_categories: bool,
    ) -> str:
        """Create prompt for OpenAI categorization"""

        bookmark_summary = []
        # Include ALL bookmarks in the prompt for complete categorization
        for i, bookmark in enumerate(bookmark_data):
            bookmark_summary.append(
                f"{i+1}. {bookmark['title']} - {bookmark['url']} (Domain: {bookmark['domain']})"
            )

        prompt = f"""
You are an expert at organizing and categorizing bookmarks. I have {len(bookmark_data)} bookmarks that need to be intelligently categorized.

BOOKMARKS TO CATEGORIZE:
{chr(10).join(bookmark_summary)}

REQUIREMENTS:
- Create at most {max_categories} categories
- Each category should have at least {min_bookmarks_per_category} bookmarks
- Categories should be meaningful and distinct
- Focus on technology, topics, and use cases
- Merge similar categories: {merge_similar_categories}
{f"- Preferred categories (if applicable): {', '.join(preferred_categories)}" if preferred_categories else ""}

RESPONSE FORMAT (JSON):
{{
  "categories": [
    {{
      "name": "Category Name",
      "description": "Brief description of what this category contains",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "bookmark_indices": [1, 5, 12, 18],
      "confidence_score": 0.85,
      "suggested_collection_name": "Collection Name"
    }}
  ]
}}

CATEGORIZATION RULES:
1. Group by technology stack (React, Python, JavaScript, etc.)
2. Group by purpose (Learning, Tools, Documentation, etc.)
3. Group by domain/industry if relevant
4. Create a "Miscellaneous" category only if needed
5. Ensure bookmark_indices refer to the numbered bookmarks above
6. Confidence score should reflect how well bookmarks fit the category (0.0-1.0)

Analyze the bookmarks and provide intelligent categorization in the exact JSON format above.
"""

        return prompt

    def _parse_openai_response(
        self, response_text: str, bookmark_data: List[Dict[str, Any]]
    ) -> List[BookmarkCategory]:
        """Parse OpenAI response into BookmarkCategory objects"""

        try:
            # OpenAI with response_format={"type": "json"} returns JSON directly
            parsed = json.loads(response_text)

            categories = []
            for cat_data in parsed.get("categories", []):
                # Convert bookmark indices to actual bookmark objects
                bookmark_items = []
                for idx in cat_data.get("bookmark_indices", []):
                    # Handle both prompt bookmarks and full dataset
                    if 1 <= idx <= len(bookmark_data):
                        bookmark_dict = bookmark_data[
                            idx - 1
                        ]  # Convert to 0-based index
                        bookmark_item = BookmarkItem(
                            url=bookmark_dict["url"],
                            title=bookmark_dict["title"],
                            folder_path=bookmark_dict.get("folder"),
                        )
                        bookmark_items.append(bookmark_item)

                if bookmark_items:  # Only create category if it has bookmarks
                    category = BookmarkCategory(
                        name=cat_data.get("name", "Untitled Category"),
                        description=cat_data.get("description", ""),
                        keywords=cat_data.get("keywords", []),
                        bookmarks=bookmark_items,
                        confidence_score=cat_data.get("confidence_score", 0.5),
                        suggested_collection_name=cat_data.get(
                            "suggested_collection_name",
                            cat_data.get("name", "Untitled"),
                        ),
                    )
                    categories.append(category)

            return categories

        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"JSON parsing failed: {e}")
            print(f"Response text: {response_text[:500]}...")
            # If JSON parsing fails, fall back to simple categorization
            return self._fallback_categorization(bookmark_data, 5, 1)

    def _fallback_categorization(
        self,
        bookmark_data: List[Dict[str, Any]],
        max_categories: int,
        min_bookmarks_per_category: int = 1,
    ) -> List[BookmarkCategory]:
        """Fallback categorization when AI fails"""

        # Simple domain-based categorization
        domain_groups = {}
        for bookmark in bookmark_data:
            domain = bookmark["domain"]
            if domain not in domain_groups:
                domain_groups[domain] = []
            domain_groups[domain].append(bookmark)

        # Create categories for domains with multiple bookmarks
        categories = []
        for domain, bookmarks in domain_groups.items():
            if (
                len(bookmarks) >= min_bookmarks_per_category
            ):  # Use parameter instead of hardcoded 3
                bookmark_items = [
                    BookmarkItem(
                        url=b["url"], title=b["title"], folder_path=b.get("folder")
                    )
                    for b in bookmarks
                ]

                category = BookmarkCategory(
                    name=f"{domain.title()} Links",
                    description=f"Bookmarks from {domain}",
                    keywords=[domain],
                    bookmarks=bookmark_items,
                    confidence_score=0.7,
                    suggested_collection_name=f"{domain.title()} Collection",
                )
                categories.append(category)

        return categories[:max_categories]

    def get_session_status(self, session_id: str) -> Optional[BookmarkSessionStatus]:
        """Get current session status"""
        session = self.sessions.get(session_id)
        if not session:
            return None

        total_bookmarks = len(session.get("bookmarks", []))

        # Calculate progress based on status
        progress_map = {
            BookmarkImportStatus.UPLOADED: 25,
            BookmarkImportStatus.PARSING: 50,
            BookmarkImportStatus.ANALYZING: 75,
            BookmarkImportStatus.READY: 100,
            BookmarkImportStatus.COMPLETED: 100,
            BookmarkImportStatus.FAILED: 0,
        }

        return BookmarkSessionStatus(
            session_id=session_id,
            status=session["status"],
            progress_percentage=progress_map.get(session["status"], 0),
            current_step=session["status"].value,
            total_bookmarks=total_bookmarks,
            processed_bookmarks=(
                total_bookmarks
                if session["status"]
                in [BookmarkImportStatus.READY, BookmarkImportStatus.COMPLETED]
                else 0
            ),
            error_message=session.get("error_message"),
        )


# Global instance
bookmark_importer_service = BookmarkImporterService()
