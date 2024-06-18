# cache_utils.py
from fastapi_cache.backends.inmemory import InMemoryBackend

def get_cache_backend():
    return InMemoryBackend()
