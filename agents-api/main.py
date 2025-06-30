from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.routes import router as agents_router

# Create FastAPI app
app = FastAPI(
    title="Cur8t Agents API",
    description="AI agents for bookmark and collection management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include agent routes
app.include_router(agents_router)

@app.get("/")
async def root():
    return {
        "message": "Cur8t Agents API", 
        "version": "1.0.0",
        "agents": [
            "Article Link Extractor"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "cur8t-agents-api"}