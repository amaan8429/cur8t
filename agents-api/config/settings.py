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
        "https://localhost:3000"
    ]
    
    # Agent Settings
    request_timeout: int = 30
    max_links_per_extraction: int = 50
    user_agent: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    
    # Gemini AI Settings
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    max_bookmarks_per_batch: int = int(os.getenv("MAX_BOOKMARKS_PER_BATCH", "100"))
    max_categories_per_analysis: int = int(os.getenv("MAX_CATEGORIES_PER_ANALYSIS", "10"))
    min_bookmarks_per_category: int = int(os.getenv("MIN_BOOKMARKS_PER_CATEGORY", "3"))

# Global settings instance
settings = Settings() 