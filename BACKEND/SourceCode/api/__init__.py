# /api/__init__.py
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

# Initialize the cache
FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")

from .ping_scan import router as ping_scan_router
from .host_info import router as host_info_router
from .network_info import router as network_info_router
from .cache_control import router as cache_control_router
from .cache_status import router as cache_status_router

# List of all routers to be included in the main FastAPI application
routers = [
    ping_scan_router,
    host_info_router,
    network_info_router,
    cache_control_router,
    cache_status_router,
]
