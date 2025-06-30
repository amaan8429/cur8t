"""
Article Link Extractor API routes
"""

from fastapi import APIRouter, HTTPException

from .models import ArticleLinkRequest, ArticleLinkResponse
from .service import article_extractor_service
from core.models import HealthResponse, AgentStatus

# Create router for this agent
router = APIRouter(prefix="/article-extractor", tags=["Article Link Extractor"])

@router.post("/", response_model=ArticleLinkResponse)
async def extract_article_links(request: ArticleLinkRequest):
    """
    Extract all links from an article and prepare them for collection creation.
    
    This agent:
    - Fetches the article from the provided URL
    - Extracts all valid links from the article content  
    - Filters out social sharing links and duplicates
    - Returns structured data ready for collection creation
    """
    
    result, error = article_extractor_service.extract_links_from_article(
        article_url=str(request.article_url),
        collection_name=request.collection_name
    )
    
    if error:
        status_code = 400 if error.error_code == "INVALID_URL" else 500
        raise HTTPException(
            status_code=status_code,
            detail=error.dict()
        )
    
    return result

@router.get("/health", response_model=HealthResponse)
async def get_health():
    """Health check for the Article Link Extractor agent"""
    return HealthResponse(
        agent="Article Link Extractor",
        status=AgentStatus.HEALTHY,
        description="Ready to extract links from articles",
        version="1.0.0"
    ) 