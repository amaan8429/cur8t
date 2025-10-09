from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from agents import get_active_routers, get_agent_list
from config.settings import settings
from core.limiter import limiter

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    debug=settings.debug,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all active agent routes
for router in get_active_routers():
    app.include_router(router, prefix="/agents")

# Rate limiter setup
if settings.rate_limit_enabled:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)


@app.get("/")
async def root(request: Request):
    """API root endpoint with information about available agents"""
    return {
        "message": settings.app_name,
        "version": settings.app_version,
        "description": settings.app_description,
        "agents": get_agent_list(),
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
@limiter.exempt
async def health_check(request: Request):
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "cur8t-agents-api",
        "version": settings.app_version,
    }
