from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

# Try to load .env file, but don't fail if it doesn't exist
load_dotenv()

class Settings(BaseModel):
    # Database URL with helpful default message
    database_url: str = os.getenv("DATABASE_URL", "")
    
    # Clerk secret key (optional for now)
    clerk_secret_key: Optional[str] = os.getenv("CLERK_SECRET_KEY")
    
    # Debug mode
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Validate that required settings are present
        if not self.database_url:
            print("⚠️  WARNING: DATABASE_URL not set!")
            print("📝 Create a .env file with: DATABASE_URL=postgresql://...")
    
    class Config:
        env_file = ".env"

settings = Settings()
