# /api/ping_scan.py - API endpoint for performing a ping scan on the network and returning a list of active hosts.
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi_cache.decorator import cache
from services.network_scan import scan_network, get_active_hosts

# Initialize the router
router = APIRouter()

@router.get("/ping_scan")
@cache(expire=600)
async def ping_scan():
    """
    Perform a ping scan on the network and return a list of active hosts.
    
    This endpoint initiates a network scan to identify active hosts within the specified network range.
    """
    try:
        # Perform the network scan
        await scan_network()

        # Retrieve the list of active hosts
        hosts = get_active_hosts()

        # Check if hosts list is empty or None
        if not hosts:
            return JSONResponse(status_code=404, content={"message": "No active hosts found"})

        # Return the list of hosts as JSON
        return JSONResponse(status_code=200, content={"message": "Ping scan successful", "hosts": hosts})

    except Exception as e:
        error_message = f"Failed to perform ping scan: {str(e)}"
        raise HTTPException(status_code=500, detail=error_message)
