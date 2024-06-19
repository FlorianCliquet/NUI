from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
import logging

logger = logging.getLogger(__name__)

class CacheClearError(Exception):
    """Custom exception for cache clear errors."""

async def get_cache_backend() -> RedisBackend:
    """
    Utility function to get the Redis cache backend.
    
    Returns:
        RedisBackend: The Redis cache backend.

    Raises:
        CacheClearError: If the cache backend is not initialized.
    """
    backend = FastAPICache.get_backend()
    if not backend:
        logger.error("Cache backend is not initialized.")
        raise CacheClearError("Cache backend is not initialized.")
    
    if not isinstance(backend, RedisBackend):
        logger.error("Cache backend is not a RedisBackend instance.")
        raise CacheClearError("Cache backend is not a RedisBackend instance.")
    
    return backend
