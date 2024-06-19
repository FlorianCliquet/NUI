"""
API endpoints related to network information.

Includes endpoints to retrieve information such as total and active hosts in the network,
as well as endpoints to get the default gateway and local IP address.

Endpoints:
- /api/network_info:
  GET:
    summary: Retrieve network information.
    description: Returns the total number of hosts in the network and the number of active hosts.

- /api/get_gateway:
  GET:
    tags: Network
    summary: Get Default Gateway
    description: Returns the IP address of the network's default gateway.

- /api/get_ip:
  GET:
    tags: Network
    summary: Get Local IP Address
    description: Returns the IP address of the local device running the API.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from services.utilities import get_default_gateway, get_local_ip

# Initialize the router
router = APIRouter()

@router.get("/network_info", tags=["Network"], summary="Retrieve network information")
async def get_network_info():
    """
    Retrieve information about the network.

    Returns:
        NetworkInfoResponse: Object containing total and active hosts in the network.
    """
    try:
        total_hosts = 100  # Placeholder for demonstration, replace with actual logic
        active_hosts = 50  # Placeholder for demonstration, replace with actual logic
        return JSONResponse(content={"total_hosts": total_hosts, "active_hosts": active_hosts})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve network information: {str(e)}")

@router.get("/get_gateway", tags=["Network"], summary="Get Default Gateway")
async def get_gateway():
    """
    Get the default gateway of the network.
    
    This endpoint returns the IP address of the network's default gateway.
    """
    try:
        gateway = get_default_gateway()  # Retrieve the default gateway IP address
        return JSONResponse(content={"gateway": gateway})  # Return the gateway IP address as JSON
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve gateway: {str(e)}")

@router.get("/get_ip", tags=["Network"], summary="Get Local IP Address")
async def get_ip():
    """
    Get the IP address of the local device.
    
    This endpoint returns the IP address of the local device running the API.
    """
    try:
        ip = get_local_ip()  # Retrieve the local device IP address
        return JSONResponse(content={"ip": ip})  # Return the local IP address as JSON
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve local IP: {str(e)}")
