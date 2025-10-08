"""
Article Link Extractor agent models
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl

from core.models import BaseResponse, ExtractedLink


class ArticleLinkRequest(BaseModel):
    """Request model for article link extraction"""

    article_url: HttpUrl = Field(
        ..., description="URL of the article to extract links from"
    )
    collection_name: Optional[str] = Field(
        None, description="Name for the new collection"
    )


class ArticleLinkResponse(BaseResponse):
    """Response model for article link extraction"""

    article_title: Optional[str] = None
    article_url: str
    total_links_found: int
    extracted_links: List[ExtractedLink]
    collection_name: str
