"""
Bookmark Importer agent models
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
from core.models import BaseResponse, ExtractedLink

class BookmarkImportStatus(str, Enum):
    """Status of bookmark import process"""
    UPLOADED = "uploaded"
    PARSING = "parsing"
    ANALYZING = "analyzing"
    CATEGORIZING = "categorizing"
    READY = "ready"
    COMPLETED = "completed"
    FAILED = "failed"

class BookmarkItem(BaseModel):
    """Individual bookmark item"""
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    date_added: Optional[datetime] = None
    folder_path: Optional[str] = None  # Original folder structure
    favicon_url: Optional[str] = None
    tags: Optional[List[str]] = None

class BookmarkCategory(BaseModel):
    """AI-generated bookmark category"""
    name: str
    description: str
    keywords: List[str]
    bookmarks: List[BookmarkItem]
    confidence_score: float = Field(ge=0.0, le=1.0)
    suggested_collection_name: str

class BookmarkUploadRequest(BaseModel):
    """Request model for bookmark file upload"""
    file_content: str = Field(..., description="HTML content of the bookmark file")
    original_filename: str = Field(..., description="Original filename of the bookmark file")
    browser_type: Optional[str] = Field(None, description="Browser type (chrome, firefox, safari, edge)")
    user_preferences: Optional[Dict[str, Any]] = Field(None, description="User categorization preferences")

class BookmarkAnalysisRequest(BaseModel):
    """Request model for bookmark analysis and categorization"""
    session_id: str = Field(..., description="Session ID from upload")
    max_categories: Optional[int] = Field(5, ge=1, le=15, description="Maximum number of categories to create")
    min_bookmarks_per_category: Optional[int] = Field(3, ge=1, le=20, description="Minimum bookmarks per category")
    preferred_categories: Optional[List[str]] = Field(None, description="User-suggested category names")
    merge_similar_categories: bool = Field(True, description="Whether to merge similar categories")

class CollectionCreationRequest(BaseModel):
    """Request model for creating collections from categorized bookmarks"""
    session_id: str = Field(..., description="Session ID from analysis")
    selected_categories: List[str] = Field(..., description="Category names to create as collections")
    custom_category_names: Optional[Dict[str, str]] = Field(None, description="Custom names for categories")

class BookmarkUploadResponse(BaseResponse):
    """Response model for bookmark file upload"""
    session_id: str
    total_bookmarks: int
    browser_detected: Optional[str] = None
    folder_structure: Optional[Dict[str, int]] = None  # folder_name -> count
    processing_status: BookmarkImportStatus = BookmarkImportStatus.UPLOADED

class BookmarkAnalysisResponse(BaseResponse):
    """Response model for bookmark analysis"""
    session_id: str
    categories: List[BookmarkCategory]
    total_bookmarks_processed: int
    uncategorized_bookmarks: List[BookmarkItem]
    processing_time_seconds: float
    ai_confidence_score: float = Field(ge=0.0, le=1.0)
    processing_status: BookmarkImportStatus = BookmarkImportStatus.READY

class CollectionCreationResponse(BaseResponse):
    """Response model for collection creation"""
    session_id: str
    created_collections: List[Dict[str, Any]]  # collection_name -> collection_data
    total_collections_created: int
    total_bookmarks_organized: int
    processing_status: BookmarkImportStatus = BookmarkImportStatus.COMPLETED

class BookmarkSessionStatus(BaseModel):
    """Status model for bookmark import session"""
    session_id: str
    status: BookmarkImportStatus
    progress_percentage: int = Field(ge=0, le=100)
    current_step: str
    total_bookmarks: int
    processed_bookmarks: int
    estimated_time_remaining: Optional[int] = None  # seconds
    error_message: Optional[str] = None

class BookmarkPreviewResponse(BaseResponse):
    """Response model for bookmark categorization preview"""
    session_id: str
    categories: List[BookmarkCategory]
    statistics: Dict[str, Any]
    suggestions: List[str]  # AI suggestions for improvement
    processing_status: BookmarkImportStatus = BookmarkImportStatus.READY 