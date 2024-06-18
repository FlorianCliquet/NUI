from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

# Initialize the cache with an in-memory backend
cache = FastAPICache.init(InMemoryBackend())
