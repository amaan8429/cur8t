from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.api import routes
from app.core.config import settings
import logging
import time
from collections import defaultdict
import asyncio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiting storage
request_counts = defaultdict(list)
RATE_LIMIT = 100  # requests per minute
RATE_LIMIT_WINDOW = 60  # seconds

app = FastAPI(
    title="Extension API",
    description="FastAPI backend for browser extension",
    version="1.0.0",
    debug=settings.debug
)

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Get client IP
    client_ip = request.client.host if request.client else "unknown"
    
    # Clean old requests
    current_time = time.time()
    request_counts[client_ip] = [req_time for req_time in request_counts[client_ip] 
                                if current_time - req_time < RATE_LIMIT_WINDOW]
    
    # Check rate limit
    if len(request_counts[client_ip]) >= RATE_LIMIT:
        logger.warning(f"🚫 Rate limit exceeded for {client_ip}")
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    
    # Add current request
    request_counts[client_ip].append(current_time)
    
    response = await call_next(request)
    return response

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"📥 Incoming request: {request.method} {request.url}")
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(f"📤 Response status: {response.status_code} | Time: {process_time:.3f}s")
    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api/v1")
