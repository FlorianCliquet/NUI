"""
Cache Control API - /api/cache_control.py

This module defines API endpoints related to cache control.
"""

import logging
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from utils.cache_utils import get_cache_backend, CacheClearError

logger = logging.getLogger(__name__)
router = APIRouter()

class BackendOperationError(Exception):
    """Custom exception for backend operation errors."""

@router.post("/clear_cache", summary="Clear the cache")
async def clear_cache(
    request: Request,
    backend=Depends(get_cache_backend)
):
    """
    Endpoint to clear the cache.

    Raises:
        HTTPException: If cache clearing fails.

    Returns:
        JSONResponse: Success message if cache is cleared successfully.
    """
    logger.info('Init /clear_cache post method')
    request_id = request.headers.get('X-Request-ID', 'N/A')
    try:
        redis = backend.redis
        logger.info(f"Clearing cache for request_id={request_id}")
        keys = await redis.keys("fastapi-cache:*")
        if not keys:
            logger.info(f"Cache is already empty for request_id={request_id}")
            return JSONResponse(content={"message": "Cache is already empty"}, status_code=200)
        await redis.delete(*keys)
        logger.info(f"Cache cleared successfully for request_id={request_id}")
        return JSONResponse(content={"message": "Cache cleared successfully"}, status_code=200)
    except CacheClearError as e:
        logger.error(f"Cache clear error: {str(e)}", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail="Failed to clear cache")
    except BackendOperationError as e:
        logger.error(f"Backend operation error: {str(e)}", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail="Backend operation failed")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", extra={"request_id": request_id})
        raise HTTPException(status_code=500, detail="Internal server error")
