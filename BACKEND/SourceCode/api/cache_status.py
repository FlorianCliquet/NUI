"""
API endpoint for checking the cache status.

Endpoints:
- /api/cache_status:
  GET:
    tags: Cache
    summary: Check Cache Status
    description: Returns the current status of the cache.
"""

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi_cache import FastAPICache
import logging

# Initialize the router
router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

@router.get("/cache_status", tags=["Cache"], summary="Check Cache Status")
async def cache_status():
    """
    Check the status of the cache.
    
    This endpoint returns the current status of the cache, including the number of items.
    """
    logger.info("Checking cache status...")

    try:
        # Check if cache is initialized
        if FastAPICache.get_backend():
            logger.info("Cache backend found.")
            redis = FastAPICache.get_backend().redis
            keys = await redis.keys("fastapi-cache:*")
            items = len(keys)
            status = "filled" if items > 0 else "empty"
            logger.info(f"Cache status: {status}, items: {items}")
            return JSONResponse(status_code=200, content={"status": status, "items": items})
        else:
            logger.warning("Cache backend not initialized.")
            return JSONResponse(status_code=200, content={"status": "not initialized", "items": 0})

    except Exception as e:
        error_message = f"Failed to check cache status: {str(e)}"
        logger.error(error_message)
        return JSONResponse(status_code=500, content={"error": error_message})
