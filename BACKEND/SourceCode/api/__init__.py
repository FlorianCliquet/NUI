"""
API Initialization - /api/__init__.py
------------------

This module initializes the FastAPI application and includes all routers.

Part List:
- Middleware Configuration
- Routers Initialization
- Environment-specific Logging Configuration

"""

#---------------------------------------------------------
# Middleware Configuration
#---------------------------------------------------------
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
from utils.cache_utils import get_cache_backend

#---------------------------------------------------------
# Routers Initialization
#---------------------------------------------------------
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

#---------------------------------------------------------
# Environment-specific Logging Configuration
#---------------------------------------------------------
async def init_cache():
    """
    Initializes the FastAPI cache with Redis backend.
    """
    try:
        redis = aioredis.from_url("redis://localhost:6379/")  # Update with your Redis URL
        backend = RedisBackend(redis)
        FastAPICache.init(backend, prefix="fastapi-cache")
    except Exception as e:
        # Proper logging should ideally be handled in main.py or a centralized logging module
        raise RuntimeError(f"Failed to initialize cache: {e}")
