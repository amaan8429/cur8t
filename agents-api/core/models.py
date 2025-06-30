"""
Shared models used across all agents
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class AgentStatus(str, Enum):
    """Agent status enumeration"""
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"
    MAINTENANCE = "maintenance"

class BaseResponse(BaseModel):
    """Base response model for all agents"""
    success: bool
    message: str
    created_at: datetime = Field(default_factory=datetime.now)

class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: str
    details: Optional[str] = None
    error_code: Optional[str] = None

class HealthResponse(BaseModel):
    """Health check response"""
    agent: str
    status: AgentStatus
    description: str
    version: str = "1.0.0"

class ExtractedLink(BaseModel):
    """Standard link model used across agents"""
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    tags: Optional[list[str]] = None
    metadata: Optional[dict] = None 