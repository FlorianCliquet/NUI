"""
Init the cache
"""
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import aioredis
import logging

logger = logging.getLogger(__name__)

async def init_cache():
    redis = await aioredis.from_url("redis://localhost:6379/0")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    logger.info("Cache initialized successfully")
