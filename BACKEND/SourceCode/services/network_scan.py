# /services/network_scan.py
import nmap
import asyncio
from loguru import logger

# Initialize the Nmap scanner
nm = nmap.PortScanner()

async def scan_network(network_range="192.168.1.0/24", arguments="-sn"):
    """
    Scan the network to get the list of active hosts.
    """
    try:
        nm.scan(network_range, arguments=arguments)
    except Exception as e:
        logger.error(f"Error during network scan: {e}")
        raise

async def get_host_info(ip, arguments="-O"):
    """
    Get detailed information about an active host.
    
    Parameters:
        ip (str): IP address of the host.
        arguments (str): Nmap scan arguments.
    
    Returns:
        dict: Information about the host.
    """
    try:
        nm.scan(ip, arguments=arguments)
        return nm[ip]
    except Exception as e:
        logger.error(f"Error retrieving host info for {ip}: {e}")
        raise

def get_active_hosts():
    """
    Retrieve the list of active hosts after a scan.
    
    Returns:
        list: List of active hosts.
    """
    try:
        return [nm[host] for host in nm.all_hosts()]  # Return the list of active hosts
    except Exception as e:
        logger.error(f"Error retrieving active hosts: {e}")  # Log any errors
        raise  # Raise the exception to propagate it up
