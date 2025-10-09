"""
Article Link Extractor API routes
"""

from fastapi import APIRouter, HTTPException, Request

from core.limiter import limiter
from core.models import AgentStatus, HealthResponse

from .models import ArticleLinkRequest, ArticleLinkResponse
from .service import article_extractor_service

# Create router for this agent
router = APIRouter(prefix="/article-extractor", tags=["Article Link Extractor"])


@router.post("/", response_model=ArticleLinkResponse)
@limiter.limit("30/minute")
async def extract_article_links(request: Request, payload: ArticleLinkRequest):
    """
    Extract all links from an article and prepare them for collection creation.

    This agent:
    - Fetches the article from the provided URL
    - Extracts all valid links from the article content
    - Filters out social sharing links and duplicates
    - Returns structured data ready for collection creation
    """

    result, error = article_extractor_service.extract_links_from_article(
        article_url=str(payload.article_url), collection_name=payload.collection_name
    )

    if error:
        status_code = 400 if error.error_code == "INVALID_URL" else 500
        raise HTTPException(status_code=status_code, detail=error.dict())

    return result


@router.get("/health", response_model=HealthResponse)
@limiter.exempt
async def get_health(request: Request):
    """Health check for the Article Link Extractor agent"""
    return HealthResponse(
        agent="Article Link Extractor",
        status=AgentStatus.HEALTHY,
        description="Ready to extract links from articles",
        version="1.0.0",
    )
