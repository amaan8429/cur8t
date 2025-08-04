from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class Collection(BaseModel):
    id: str
    title: str
    description: str
    visibility: str
    totalLinks: int
    createdAt: datetime

class CreateLinkRequest(BaseModel):
    title: Optional[str] = None
    url: HttpUrl

class Link(BaseModel):
    id: str
    title: str
    url: str
    linkCollectionId: str
    userId: str
    createdAt: datetime
    updatedAt: datetime

class CreateCollectionRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    visibility: str = "private"

class CreateCollectionResponse(BaseModel):
    success: bool
    data: Optional[Collection] = None

class CreateCollectionWithLinksRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    visibility: str = "private"
    links: List[CreateLinkRequest]

class CreateCollectionWithLinksResponse(BaseModel):
    success: bool
    collection: Collection
    links: List[Link]
    total_added: int
    total_requested: int

class TopCollectionsResponse(BaseModel):
    data: List[Collection]

class BulkLinkRequest(BaseModel):
    links: List[CreateLinkRequest]

class CreateLinkResponse(BaseModel):
    success: bool
    data: Optional[Link] = None

class BulkCreateLinkResponse(BaseModel):
    success: bool
    data: List[Link]
    total_added: int
    total_requested: int

class ErrorResponse(BaseModel):
    error: str

class Favorite(BaseModel):
    id: str
    title: str
    url: str
    userId: str
    createdAt: datetime
    updatedAt: datetime

class FavoritesResponse(BaseModel):
    data: List[Favorite]

class CreateFavoriteRequest(BaseModel):
    title: str
    url: HttpUrl

class CreateFavoriteResponse(BaseModel):
    success: bool
    data: Optional[Favorite] = None

class UpdateFavoriteRequest(BaseModel):
    title: str

class UpdateFavoriteResponse(BaseModel):
    success: bool
    data: Optional[Favorite] = None

class DeleteFavoriteResponse(BaseModel):
    success: bool
    message: str 