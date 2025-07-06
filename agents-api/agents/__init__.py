"""
Agents package - AI agents for bookmark and collection management
"""

from .article_extractor.routes import router as article_extractor_router
from .bookmark_importer.routes import router as bookmark_importer_router

# Export available agent routers
available_agents = {
    "article_extractor": {
        "name": "Article Link Extractor",
        "description": "Extract links from articles and create collections",
        "status": "active",
        "router": article_extractor_router
    },
    "smart_export": {
        "name": "Smart Export Guide",
        "description": "Export collections as detailed guides",
        "status": "coming_soon",
        "router": None
    },
    "collection_generator": {
        "name": "Smart Collection Generator", 
        "description": "AI-powered collection creation",
        "status": "coming_soon",
        "router": None
    },
    "youtube_extractor": {
        "name": "YouTube Link Extractor",
        "description": "Extract links from YouTube video descriptions",
        "status": "coming_soon", 
        "router": None
    },
    "watch_later_organizer": {
        "name": "Watch Later Organizer",
        "description": "Organize Watch Later playlists into collections",
        "status": "coming_soon",
        "router": None
    },
    "bookmark_importer": {
        "name": "Bookmark File Importer",
        "description": "Import and organize bookmark files using Gemini AI",
        "status": "active",
        "router": bookmark_importer_router
    }
}

# Get active agent routers
def get_active_routers():
    """Get all active agent routers"""
    return [
        agent_info["router"] 
        for agent_info in available_agents.values() 
        if agent_info["status"] == "active" and agent_info["router"] is not None
    ]

# Get agent list for API response
def get_agent_list():
    """Get list of all agents with their status"""
    return [
        {
            "name": agent_info["name"],
            "description": agent_info["description"],
            "status": agent_info["status"]
        }
        for agent_info in available_agents.values()
    ] 