"""
Host Information API - /api/host_info.py

This module defines API endpoints related to retrieving host information.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.network_scan import get_host_info
from fastapi_cache.decorator import cache

import logging

logger = logging.getLogger(__name__)

# Initialize the router
router = APIRouter()

class HostInfoError(Exception):
    """Custom exception raised when retrieving host information fails."""
    def __init__(self, message="Failed to retrieve host information"):
        self.message = message
        super().__init__(self.message)

@router.get("/host_info/{ip}", summary="Get host information")
@cache(expire=600)
async def host_info(ip: str):
    """
    Get detailed information about a specific host.

    Parameters:
        ip (str): IP address of the host.

    Returns:
        JSONResponse: Detailed host information.

    Raises:
        HTTPException: If there's an error retrieving host information.
    """
    logger.info(f"Retrieving host information for IP: {ip}")
    try:
        info = await get_host_info(ip)  # Retrieve detailed information about the host
        logger.info(f"Host information retrieved successfully for IP: {ip}")
        if not info:
            raise HTTPException(status_code=404, detail="Host information not found")

        logger.info(f"Host information retrieved successfully for IP: {ip}")
        return JSONResponse(content=info, status_code=200)

    except HTTPException as http_error:
        logger.error(f"HTTP error occurred: {http_error.detail}")
        raise http_error  # Re-raise HTTP exceptions to return them directly

    except HostInfoError as hi_error:
        logger.error(f"Host information error: {str(hi_error)}")
        raise HTTPException(status_code=500, detail=str(hi_error))

    except Exception as e:
        logger.error(f"Failed to retrieve host information: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
