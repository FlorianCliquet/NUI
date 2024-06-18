# api/cache_control.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from utils.cache_utils import get_cache_backend
router = APIRouter()

@router.post("/clear_cache")
async def clear_cache(backend=Depends(get_cache_backend)):
    """
    Clear the cache.
    """
    try:
        # Clear the in-memory cache
        await backend.clear()  
        
        return JSONResponse(content={"message": "Cache cleared successfully"}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {str(e)}")
