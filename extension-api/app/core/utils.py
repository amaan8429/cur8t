import httpx
import re
from urllib.parse import urlparse

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