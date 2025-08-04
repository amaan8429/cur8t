#!/usr/bin/env python3

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info" if settings.debug else "warning",
        workers=1,  # Single worker for development
        loop="asyncio",
        http="httptools"  # Faster HTTP parser
    ) 