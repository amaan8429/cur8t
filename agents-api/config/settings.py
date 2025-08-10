"""
Application settings and configuration
"""

import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings"""
    
    # API Settings
    app_name: str = "Cur8t Agents API"
    app_version: str = "1.0.0"
    app_description: str = "AI agents for bookmark and collection management"
    
    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # CORS Settings
    allowed_origins: List[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://cur8t.com",
    "https://www.cur8t.com",
    "https://agents.cur8t.com"
    ]
    
    # Agent Settings
    request_timeout: int = 30
    max_links_per_extraction: int = 50
    user_agent: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    
    # OpenAI Settings
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
    max_bookmarks_per_batch: int = int(os.getenv("MAX_BOOKMARKS_PER_BATCH", "100"))
    max_categories_per_analysis: int = int(os.getenv("MAX_CATEGORIES_PER_ANALYSIS", "10"))
    min_bookmarks_per_category: int = int(os.getenv("MIN_BOOKMARKS_PER_CATEGORY", "3"))

    # Rate Limiting (SlowAPI)
    rate_limit_default: str = os.getenv("RATE_LIMIT_DEFAULT", "60/minute")
    rate_limit_enabled: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() in {"1", "true", "yes"}
    rate_limit_trust_forwarded: bool = os.getenv("RATE_LIMIT_TRUST_FORWARDED", "true").lower() in {"1", "true", "yes"}

# Global settings instance
settings = Settings() 