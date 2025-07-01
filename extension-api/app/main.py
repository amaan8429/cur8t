from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.core.config import settings
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Extension API",
    description="FastAPI backend for browser extension",
    version="1.0.0",
    debug=settings.debug
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"📥 Incoming request: {request.method} {request.url}")
    logger.info(f"📥 Headers: {dict(request.headers)}")
    logger.info(f"📥 Authorization header specifically: {request.headers.get('authorization')}")
    
    response = await call_next(request)
    
    logger.info(f"📤 Response status: {response.status_code}")
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
