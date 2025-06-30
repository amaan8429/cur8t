from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from .models import ArticleLinkRequest, ArticleLinkResponse, ErrorResponse
from .article_extractor import article_extractor

# Create router for agent endpoints
router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/article-extractor", response_model=ArticleLinkResponse)
async def extract_article_links(request: ArticleLinkRequest):
    """
    Extract all links from an article and prepare them for collection creation.
    
    This agent:
    - Fetches the article from the provided URL
    - Extracts all valid links from the article content
    - Filters out social sharing links and duplicates
    - Returns structured data ready for collection creation
    """
    
    result, error = article_extractor.extract_links_from_article(
        article_url=str(request.article_url),
        collection_name=request.collection_name
    )
    
    if error:
        raise HTTPException(
            status_code=400 if "Invalid URL" in error.error else 500,
            detail=error.dict()
        )
    
    return result

@router.get("/article-extractor/health")
async def article_extractor_health():
    """Health check for the Article Link Extractor agent"""
    return {
        "agent": "Article Link Extractor",
        "status": "healthy",
        "description": "Ready to extract links from articles"
    } 