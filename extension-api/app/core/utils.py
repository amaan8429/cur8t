import httpx
import re
from urllib.parse import urlparse
from typing import Optional
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings

async def extract_title_from_url(url: str) -> str:
    """Extract title from URL by fetching the page and parsing the <title> tag"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10)
            response.raise_for_status()
            
            # Find title tag in HTML
            title_match = re.search(r'<title[^>]*>([^<]+)</title>', response.text, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).strip()
                # Clean up common title suffixes
                title = re.sub(r'\s*[\|\-]\s*.*$', '', title)
                return title[:100]  # Limit to 100 characters
    except Exception:
        pass
    
    return generate_fallback_title(url)

def generate_fallback_title(url: str) -> str:
    """Generate a fallback title from URL"""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.replace('www.', '')
        if parsed.path and parsed.path != '/':
            path_parts = [part for part in parsed.path.split('/') if part]
            if path_parts:
                return f"{path_parts[-1]} - {domain}"
        return domain
    except Exception:
        return url[:50]  # Fallback to truncated URL 


def rate_limit_key_from_api_key(request: Request) -> str:
    """Return a client identifier for rate limiting.

    Prefer API key from Authorization header; otherwise fall back to IP
    address (considering forwarded headers if configured).
    """
    auth_header: Optional[str] = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        api_key = auth_header[7:].strip()
        if api_key:
            return f"api:{api_key}"

    # Fallback to remote address
    if settings.rate_limit_trust_forwarded:
        xff = request.headers.get("x-forwarded-for")
        if xff:
            return f"ip:{xff.split(',')[0].strip()}"
        xri = request.headers.get("x-real-ip")
        if xri:
            return f"ip:{xri.strip()}"
    return f"ip:{get_remote_address(request)}"


# Shared limiter instance importable for decorators
limiter: Limiter = Limiter(
    key_func=rate_limit_key_from_api_key,
    default_limits=[settings.rate_limit_default] if settings.rate_limit_enabled else [],
)