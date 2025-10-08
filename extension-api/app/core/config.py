import os
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel

# Try to load .env file, but don't fail if it doesn't exist
load_dotenv()


class Settings(BaseModel):
    # Database URL - MUST be set via environment variable
    database_url: str = os.getenv("DATABASE_URL", "")

    # Clerk secret key (optional for now)
    clerk_secret_key: Optional[str] = os.getenv("CLERK_SECRET_KEY")

    # Debug mode
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"

    # Rate limiting
    rate_limit_enabled: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() in {
        "1",
        "true",
        "yes",
    }
    rate_limit_default: str = os.getenv("RATE_LIMIT_DEFAULT", "120/minute")
    # Use API key header as the rate limit key by default; fall back to IP
    rate_limit_trust_forwarded: bool = os.getenv(
        "RATE_LIMIT_TRUST_FORWARDED", "true"
    ).lower() in {"1", "true", "yes"}

    # API Key Security: HMAC-SHA256 pepper
    api_key_pepper: Optional[str] = os.getenv("API_KEY_PEPPER")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Validate that required settings are present
        if not self.database_url:
            print("🚨 CRITICAL ERROR: DATABASE_URL not set!")
            print(
                "📝 Set DATABASE_URL environment variable with your database connection string"
            )
            print(
                "💡 Example: DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require"
            )
            raise ValueError("DATABASE_URL environment variable is required")

        # Validate API key pepper is set
        if not self.api_key_pepper:
            print("⚠️  WARNING: API_KEY_PEPPER not set!")
            print("📝 Create a .env file with: API_KEY_PEPPER=your-secret-pepper")
            print("🔐 Generate with: openssl rand -hex 32")
            raise ValueError("API_KEY_PEPPER environment variable is required")

    class Config:
        env_file = ".env"


settings = Settings()
