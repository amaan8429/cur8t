"""
Bookmark Importer API routes
"""

import json
from typing import Any, Dict, Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from core.limiter import limiter
from core.models import AgentStatus, ErrorResponse, HealthResponse

from .models import (
    BookmarkAnalysisRequest,
    BookmarkAnalysisResponse,
    BookmarkImportStatus,
    BookmarkPreviewResponse,
    BookmarkSessionStatus,
    BookmarkUploadRequest,
    BookmarkUploadResponse,
    CollectionCreationRequest,
    CollectionCreationResponse,
)
from .service import bookmark_importer_service

# Create router for this agent
router = APIRouter(prefix="/bookmark-importer", tags=["Bookmark Importer"])


@router.post("/upload", response_model=BookmarkUploadResponse)
@limiter.limit("6/minute")
async def upload_bookmarks(
    request: Request,
    file: UploadFile = File(..., description="Bookmark HTML file"),
    browser_type: Optional[str] = Form(
        None, description="Browser type (chrome, firefox, safari, edge)"
    ),
    user_preferences: Optional[str] = Form(
        None, description="User preferences as JSON string"
    ),
):
    """
    Upload and parse bookmark file from various browsers.

    This endpoint:
    - Accepts HTML bookmark files from Chrome, Firefox, Safari, Edge
    - Parses the bookmark structure and extracts metadata
    - Detects browser type automatically if not specified
    - Returns session ID for subsequent operations
    """

    try:
        # Read file content
        file_content = await file.read()
        content_str = file_content.decode("utf-8")

        # Parse user preferences if provided
        preferences = None
        if user_preferences:
            try:
                preferences = json.loads(user_preferences)
            except json.JSONDecodeError:
                raise HTTPException(
                    status_code=400, detail="Invalid JSON in user_preferences"
                )

        # Process the upload
        result, error = await bookmark_importer_service.upload_bookmarks(
            file_content=content_str,
            filename=file.filename or "bookmarks.html",
            browser_type=browser_type,
            user_preferences=preferences,
        )

        if error:
            raise HTTPException(status_code=400, detail=error.dict())

        return result

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid file encoding. Please ensure the file is UTF-8 encoded.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.post("/analyze", response_model=BookmarkAnalysisResponse)
@limiter.limit("3/minute")
async def analyze_bookmarks(request: Request, body: BookmarkAnalysisRequest):
    """
    Analyze uploaded bookmarks using OpenAI for intelligent categorization.

    This endpoint:
    - Takes bookmarks from an upload session
    - Uses OpenAI to analyze and categorize bookmarks
    - Groups bookmarks by technology, topic, or purpose
    - Returns suggested collections with confidence scores
    """

    result, error = await bookmark_importer_service.analyze_bookmarks(
        session_id=body.session_id,
        max_categories=body.max_categories or 5,
        min_bookmarks_per_category=body.min_bookmarks_per_category or 3,
        preferred_categories=body.preferred_categories,
        merge_similar_categories=body.merge_similar_categories,
    )

    if error:
        status_code = 404 if "not found" in error.error.lower() else 500
        raise HTTPException(status_code=status_code, detail=error.dict())

    return result


@router.get("/preview/{session_id}", response_model=BookmarkPreviewResponse)
@limiter.limit("10/minute")
async def get_bookmark_preview(request: Request, session_id: str):
    """
    Get preview of categorized bookmarks without creating collections.

    This endpoint:
    - Returns the analysis results for review
    - Shows suggested categories and their contents
    - Provides statistics about the categorization
    - Allows users to modify categories before collection creation
    """

    try:
        session = bookmark_importer_service.sessions.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or expired")

        analysis_result = session.get("analysis_result")
        if not analysis_result:
            raise HTTPException(
                status_code=400,
                detail="No analysis results available. Please run analysis first.",
            )

        # Calculate statistics
        total_bookmarks = len(session["bookmarks"])
        categorized_count = sum(
            len(cat.bookmarks) for cat in analysis_result["categories"]
        )
        uncategorized_count = len(analysis_result["uncategorized_bookmarks"])

        statistics = {
            "total_bookmarks": total_bookmarks,
            "categorized_bookmarks": categorized_count,
            "uncategorized_bookmarks": uncategorized_count,
            "categorization_rate": (
                categorized_count / total_bookmarks if total_bookmarks > 0 else 0
            ),
            "number_of_categories": len(analysis_result["categories"]),
            "average_bookmarks_per_category": (
                categorized_count / len(analysis_result["categories"])
                if analysis_result["categories"]
                else 0
            ),
        }

        # Generate suggestions
        suggestions = []
        if uncategorized_count > 0:
            suggestions.append(
                f"Consider adjusting categorization parameters to include {uncategorized_count} uncategorized bookmarks"
            )

        if len(analysis_result["categories"]) < 3:
            suggestions.append(
                "You might want to increase max_categories to get more specific groupings"
            )

        if analysis_result["confidence_score"] < 0.7:
            suggestions.append(
                "Low confidence score detected. Consider providing preferred category names for better results"
            )

        return BookmarkPreviewResponse(
            success=True,
            message="Preview generated successfully",
            session_id=session_id,
            categories=analysis_result["categories"],
            statistics=statistics,
            suggestions=suggestions,
            processing_status=session["status"],
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Preview generation failed: {str(e)}"
        )


@router.get("/status/{session_id}", response_model=BookmarkSessionStatus)
@limiter.limit("10/minute")
async def get_session_status(request: Request, session_id: str):
    """
    Get current status of bookmark import session.

    This endpoint:
    - Returns current processing status
    - Shows progress percentage
    - Provides estimated time remaining
    - Reports any errors that occurred
    """

    status = bookmark_importer_service.get_session_status(session_id)
    if not status:
        raise HTTPException(status_code=404, detail="Session not found or expired")

    return status


@router.post("/create-collections", response_model=CollectionCreationResponse)
@limiter.limit("2/minute")
async def create_collections(request: Request, body: CollectionCreationRequest):
    """
    Create collections from categorized bookmarks.

    This endpoint:
    - Creates collections based on selected categories
    - Allows custom naming for collections
    - Returns collection data ready for frontend integration
    - Marks the session as completed
    """

    try:
        session = bookmark_importer_service.sessions.get(body.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or expired")

        analysis_result = session.get("analysis_result")
        if not analysis_result:
            raise HTTPException(
                status_code=400,
                detail="No analysis results available. Please run analysis first.",
            )

        # Get selected categories
        available_categories = {cat.name: cat for cat in analysis_result["categories"]}
        selected_categories = []

        for category_name in request.selected_categories:
            if category_name in available_categories:
                selected_categories.append(available_categories[category_name])

        if not selected_categories:
            raise HTTPException(status_code=400, detail="No valid categories selected")

        # Create collection data
        created_collections = []
        total_bookmarks_organized = 0

        for category in selected_categories:
            # Use custom name if provided
            custom_names = body.custom_category_names or {}
            collection_name = custom_names.get(
                category.name, category.suggested_collection_name
            )

            # Convert bookmarks to collection format
            collection_links = []
            for bookmark in category.bookmarks:
                collection_links.append(
                    {
                        "url": bookmark.url,
                        "title": bookmark.title,
                        "description": bookmark.description,
                        "date_added": (
                            bookmark.date_added.isoformat()
                            if bookmark.date_added
                            else None
                        ),
                        "folder_path": bookmark.folder_path,
                    }
                )

            collection_data = {
                "name": collection_name,
                "description": category.description,
                "keywords": category.keywords,
                "links": collection_links,
                "category_info": {
                    "original_name": category.name,
                    "confidence_score": category.confidence_score,
                    "bookmark_count": len(category.bookmarks),
                },
            }

            created_collections.append(collection_data)
            total_bookmarks_organized += len(category.bookmarks)

        # Update session status
        session["status"] = BookmarkImportStatus.COMPLETED
        session["created_collections"] = created_collections

        return CollectionCreationResponse(
            success=True,
            message=f"Successfully created {len(created_collections)} collections with {total_bookmarks_organized} bookmarks",
            session_id=body.session_id,
            created_collections=created_collections,
            total_collections_created=len(created_collections),
            total_bookmarks_organized=total_bookmarks_organized,
            processing_status=BookmarkImportStatus.COMPLETED,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Collection creation failed: {str(e)}"
        )


@router.delete("/session/{session_id}")
@limiter.limit("10/minute")
async def delete_session(request: Request, session_id: str):
    """
    Delete a bookmark import session and its data.

    This endpoint:
    - Removes session data from memory
    - Cleans up temporary files if any
    - Returns confirmation of deletion
    """

    if session_id in bookmark_importer_service.sessions:
        del bookmark_importer_service.sessions[session_id]
        return {"message": "Session deleted successfully", "session_id": session_id}
    else:
        raise HTTPException(status_code=404, detail="Session not found")


@router.get("/health", response_model=HealthResponse)
@limiter.exempt
async def get_health(request: Request):
    """Health check for the Bookmark Importer agent"""

    # Check if OpenAI is configured
    try:
        bookmark_importer_service._initialize_openai()
        ai_status = "configured"
    except Exception as e:
        ai_status = f"configuration_error: {str(e)}"

    return HealthResponse(
        agent="Bookmark Importer",
        status=(
            AgentStatus.HEALTHY if "configured" in ai_status else AgentStatus.UNHEALTHY
        ),
        description=f"Ready to import and categorize bookmarks using OpenAI. AI Status: {ai_status}",
        version="1.0.0",
    )
