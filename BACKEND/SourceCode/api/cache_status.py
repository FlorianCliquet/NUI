from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi_cache import FastAPICache

# Initialize the router
router = APIRouter()

@router.get("/cache_status")
async def cache_status():
    """
    Check the status of the cache.

    This endpoint returns whether the cache is empty or contains data,
    along with a summary of the cache content.
    """
    try:
        # Access the cache backend instance
        cache_instance = FastAPICache.get("default")

        if not cache_instance:
            raise HTTPException(status_code=500, detail="Cache instance not found")

        # Example: Retrieve all keys from the cache (specific to the backend used)
        cache_keys = await cache_instance.keys()
        cache_summary = {
            "cache_empty": len(cache_keys) == 0,
            "cache_summary": {key: str(type(await cache_instance.get(key))) for key in cache_keys}
        }
        
        return JSONResponse(content=cache_summary, status_code=200)
    except AttributeError:
        # Handle case where the backend does not support 'keys()' method
        cache_summary = {
            "cache_empty": True,
            "cache_summary": {}
        }
        return JSONResponse(content=cache_summary, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve cache status: {str(e)}")
