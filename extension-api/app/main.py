import asyncio
import logging
import time
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api import routes
from app.core.config import settings
from app.core.utils import limiter

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Legacy in-memory rate limiting removed; SlowAPI is used instead

app = FastAPI(
    title="Extension API",
    description="FastAPI backend for browser extension",
    version="1.0.0",
    debug=settings.debug,
)

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Security middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


if settings.rate_limit_enabled:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"📥 Incoming request: {request.method} {request.url}")

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(
        f"📤 Response status: {response.status_code} | Time: {process_time:.3f}s"
    )
    return response


# Configure CORS - more restrictive
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://cur8t.com",  # Production
        "https://www.cur8t.com",  # Production with www
        "https://agents.cur8t.com",  # Your agents API
        "https://extension.cur8t.com",  # Your extension API
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api/v1")


# Add root route for status monitoring
@app.get("/")
async def root():
    """Root endpoint for status monitoring"""
    return {
        "status": "healthy",
        "service": "Extension API",
        "version": "1.0.0",
        "timestamp": time.time(),
    }


# Add health check at root level for status monitors
@app.get("/health")
async def root_health_check():
    """Health check endpoint for status monitoring"""
    return await health_check()
