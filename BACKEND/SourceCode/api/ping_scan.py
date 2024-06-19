"""
API endpoint for performing a ping scan on the network and returning a list of active hosts.

Endpoints:
- /api/ping_scan:
  GET:
    tags: Ping Scan
    summary: Perform a Ping Scan
    description: Initiates a network scan to identify active hosts within the specified network range.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi_cache.decorator import cache
from services.network_scan import scan_network, get_active_hosts
import logging
from concurrent.futures import ThreadPoolExecutor


# Initialize the router
router = APIRouter()

# Configure logging
logger = logging.getLogger(__name__)

# Create a ThreadPoolExecutor for blocking I/O operations
executor = ThreadPoolExecutor(max_workers=10)

@router.get("/ping_scan", tags=["Ping Scan"], summary="Perform a Ping Scan")
@cache(expire=600, namespace="ping_scan")
async def ping_scan():
    """
    Perform a ping scan on the network and return a list of active hosts.
    
    This endpoint initiates a network scan to identify active hosts within the specified network range.
    """
    logger.info("Initiating ping scan...")

    try:
        # Perform the network scan
        logger.info("Performing network scan...")
        await scan_network()
        logger.info("Network scan completed.")

        # Retrieve the list of active hosts
        logger.info("Retrieving active hosts...")
        hosts = get_active_hosts()

        # Check if hosts list is empty or None
        if not hosts:
            logger.warning("No active hosts found.")
            return JSONResponse(status_code=404, content={"message": "No active hosts found"})

        # Log cache operation
        logger.info("Results cached successfully.")

        # Return the list of hosts as JSON
        logger.info("Ping scan successful. Active hosts found.")
        return JSONResponse(status_code=200, content={"message": "Ping scan successful", "hosts": hosts})

    except ValueError as ve:
        error_message = f"Value error during ping scan: {str(ve)}"
        logger.error(error_message)
        raise HTTPException(status_code=400, detail=error_message)

    except ConnectionError as ce:
        error_message = f"Connection error during ping scan: {str(ce)}"
        logger.error(error_message)
        raise HTTPException(status_code=503, detail=error_message)

    except TimeoutError as te:
        error_message = f"Timeout error during ping scan: {str(te)}"
        logger.error(error_message)
        raise HTTPException(status_code=504, detail=error_message)

    except Exception as e:
        error_message = f"Unexpected error during ping scan: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)
