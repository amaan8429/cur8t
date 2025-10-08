"""
Centralized SlowAPI rate limiter configuration.
"""

from typing import Optional

from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from config.settings import settings


def _forwarded_or_remote_address(request: Request) -> str:
    """Return client identifier considering proxy headers if enabled.

    When `RATE_LIMIT_TRUST_FORWARDED` is true, prefer the first IP in
    `X-Forwarded-For`, then `X-Real-IP`. Fall back to FastAPI's client host.
    """
    if settings.rate_limit_trust_forwarded:
        xff = request.headers.get("x-forwarded-for")
        if xff:
            # The left-most IP is the original client
            return xff.split(",")[0].strip()
        xri = request.headers.get("x-real-ip")
        if xri:
            return xri.strip()
    return get_remote_address(request)


# Create the Limiter instance. Keep it importable for decorators.
limiter: Limiter = Limiter(
    key_func=_forwarded_or_remote_address,
    default_limits=[settings.rate_limit_default] if settings.rate_limit_enabled else [],
)
