from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional
from datetime import datetime

class ExtractedLink(BaseModel):
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None

class ArticleLinkRequest(BaseModel):
    article_url: HttpUrl = Field(..., description="URL of the article to extract links from")
    collection_name: Optional[str] = Field(None, description="Name for the new collection")

class ArticleLinkResponse(BaseModel):
    success: bool
    message: str
    article_title: Optional[str] = None
    article_url: str
    total_links_found: int
    extracted_links: List[ExtractedLink]
    collection_name: str
    created_at: datetime

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    details: Optional[str] = None 