# /services/utilities.py
from netifaces import gateways, AF_INET
from socket import gethostbyname, gethostname
from loguru import logger

def get_default_gateway():
    """
    Get the default gateway of the network.
    
    Returns:
        str: IP address of the default gateway.
    """
    try:
        return gateways()['default'][AF_INET][0]  # Retrieve and return the default gateway IP address
    except Exception as e:
        logger.error(f"Error retrieving default gateway: {e}")  # Log any errors
        raise  # Raise the exception to propagate it up

def get_local_ip():
    """
    Get the IP address of the local device.
    
    Returns:
        str: IP address of the local device.
    """
    try:
        return gethostbyname(gethostname())  # Retrieve and return the local device IP address
    except Exception as e:
        logger.error(f"Error retrieving local IP address: {e}")  # Log any errors
        raise  # Raise the exception to propagate it up
