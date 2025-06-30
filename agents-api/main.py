from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from agents import get_active_routers, get_agent_list

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    debug=settings.debug
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

@app.get("/")
async def root():
    """API root endpoint with information about available agents"""
    return {
        "message": settings.app_name,
        "version": settings.app_version,
        "description": settings.app_description,
        "agents": get_agent_list(),
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "service": "cur8t-agents-api",
        "version": settings.app_version
    }