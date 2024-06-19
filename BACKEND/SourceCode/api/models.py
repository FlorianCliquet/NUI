"""
Models for FastAPI documentation and response validation.
"""
from pydantic import BaseModel
from typing import Optional, Dict

class PingScanResponse(BaseModel):
    """
    Response model for ping scan operation.

    Attributes:
        host (str): IP address or hostname of the scanned host.
        status (str): Status of the host (e.g., "up" or "down").
        latency (float, optional): Latency in milliseconds if available.
    """
    host: str
    status: str
    latency: Optional[float] = None

class HostInfoResponse(BaseModel):
    """
    Response model for host information retrieval.

    Attributes:
        ip (str): IP address of the host.
        hostname (str, optional): Hostname associated with the IP address.
        os (str, optional): Operating system running on the host.
        ports (Dict[int, str], optional): Dictionary of port numbers and their corresponding services.
    """
    ip: str
    hostname: Optional[str] = None
    os: Optional[str] = None
    ports: Optional[Dict[int, str]] = None

class NetworkInfoResponse(BaseModel):
    """
    Response model for network information.

    Attributes:
        total_hosts (int): Total number of hosts in the network.
        active_hosts (int): Number of active hosts in the network.
    """
    total_hosts: int
    active_hosts: int

class CacheStatusResponse(BaseModel):
    """
    Response model for cache status.

    Attributes:
        status (str): Current status of the cache (e.g., "empty" or "filled").
        items (int): Number of items currently in the cache.
    """
    status: str
    items: int
