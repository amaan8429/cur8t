"""
Shared utilities used across all agents
"""

import re
from typing import Optional
from urllib.parse import urlparse

import requests

from config.settings import settings


def is_valid_url(url: str) -> bool:
    """
    Validate if a string is a valid URL

    Args:
        url: URL string to validate

    Returns:
        bool: True if valid URL, False otherwise
    """
    url_pattern = re.compile(
        r"^https?://"  # http:// or https://
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"  # domain...
        r"localhost|"  # localhost...
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # ...or ip
        r"(?::\d+)?"  # optional port
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )
    return url_pattern.match(url) is not None


def get_domain_from_url(url: str) -> Optional[str]:
    """
    Extract domain from URL

    Args:
        url: URL to extract domain from

    Returns:
        str: Domain name or None if invalid
    """
    try:
        parsed = urlparse(url)
        return parsed.netloc
    except Exception:
        return None


def create_http_session() -> requests.Session:
    """
    Create a configured HTTP session for web scraping

    Returns:
        requests.Session: Configured session
    """
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": settings.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
        }
    )
    return session


def clean_text(text: str, max_length: Optional[int] = None) -> str:
    """
    Clean and normalize text

    Args:
        text: Text to clean
        max_length: Maximum length to truncate to

    Returns:
        str: Cleaned text
    """
    if not text:
        return ""

    # Remove extra whitespace and normalize
    cleaned = re.sub(r"\s+", " ", text.strip())

    # Truncate if needed
    if max_length and len(cleaned) > max_length:
        cleaned = cleaned[:max_length].rstrip() + "..."

    return cleaned


def should_skip_url(url: str) -> bool:
    """
    Check if URL should be skipped based on common patterns

    Args:
        url: URL to check

    Returns:
        bool: True if should skip, False otherwise
    """
    skip_patterns = [
        # Social sharing
        "facebook.com/sharer",
        "twitter.com/intent",
        "linkedin.com/sharing",
        "pinterest.com/pin",
        "reddit.com/submit",
        # File extensions
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".svg",
        ".pdf",
        ".zip",
        ".rar",
        ".exe",
        ".dmg",
        ".mp3",
        ".mp4",
        ".avi",
        ".mov",
        # Other patterns
        "javascript:",
        "mailto:",
        "tel:",
        "#",
    ]

    url_lower = url.lower()
    return any(pattern in url_lower for pattern in skip_patterns)
