from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.utilities import get_default_gateway, get_local_ip

# Initialize the router
router = APIRouter()

@router.get("/get_gateway")
async def get_gateway():
    """
    Get the default gateway of the network.
    
    This endpoint returns the IP address of the network's default gateway.
    """
    try:
        gateway = get_default_gateway()  # Retrieve the default gateway IP address
        return JSONResponse(content={"gateway": gateway})  # Return the gateway IP address as JSON
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})  # Handle and return any errors

@router.get("/get_ip")
async def get_ip():
    """
    Get the IP address of the local device.
    
    This endpoint returns the IP address of the local device running the API.
    """
    try:
        ip = get_local_ip()  # Retrieve the local device IP address
        return JSONResponse(content={"ip": ip})  # Return the local IP address as JSON
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})  # Handle and return any errors
