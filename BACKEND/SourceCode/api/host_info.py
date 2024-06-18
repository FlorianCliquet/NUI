from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.network_scan import get_host_info
from fastapi_cache.decorator import cache

# Initialize the router
router = APIRouter()

@router.get("/host_info/{ip}")
@cache(expire=600)
async def host_info(ip: str):
    """
    Get detailed information about a specific host.
    
    Parameters:
        ip (str): IP address of the host.
    """
    try:
        info = await get_host_info(ip)  # Retrieve detailed information about the host

        if not info:
            raise HTTPException(status_code=404, detail="Host information not found")

        return JSONResponse(content=info)  # Return the host information as JSON
    
    except HTTPException as http_error:
        raise http_error  # Re-raise HTTP exceptions to return them directly

    except Exception as e:
        error_message = f"Failed to retrieve host information: {str(e)}"
        raise HTTPException(status_code=500, detail=error_message)
