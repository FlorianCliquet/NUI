"""
to init the API "sudo uvicorn main:app --host 0.0.0.0 --port 5000 --reload
"
"""
import logging
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from redis import asyncio as aioredis
from logging.handlers import RotatingFileHandler
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import start_http_server
from api import routers
import uvicorn
import os

# Configure logging
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
logger = logging.getLogger(__name__)

# Custom exceptions
class InitializationError(Exception):
    def __init__(self, message):
        self.message = message

# Initialize FastAPI application
app = FastAPI(
    title="NUI API",
    description="This API provides a user interface for performing network scans using Nmap.",
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Support",
        "url": "http://example.com/contact/",
        "email": "support@example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

#---------------------------------------------------------
# Middleware Configuration
#---------------------------------------------------------

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure Headers Middleware
@app.middleware("http")
async def secure_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

#---------------------------------------------------------
# Redis Connection Test
#---------------------------------------------------------

async def test_redis_connection():
    try:
        redis_url = "redis://localhost:6379/0"
        redis = await aioredis.from_url(redis_url)
        await redis.ping()
        logger.info("Redis connection successful!")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        raise InitializationError("Failed to connect to Redis")

#---------------------------------------------------------
# Startup Event and Cache Initialization
#---------------------------------------------------------

@app.on_event("startup")
async def startup_event():
    try:
        await test_redis_connection()  # Test Redis connection
        redis = aioredis.from_url("redis://localhost:6379/")
        backend = RedisBackend(redis)
        FastAPICache.init(backend, prefix="fastapi-cache")
        logger.info("Cache initialized successfully")
    except Exception as e:
        logger.error(f"Initialization error: {e}")
        raise InitializationError("Failed to initialize cache")

#---------------------------------------------------------
# Error Handling
#---------------------------------------------------------

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP error occurred: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

#---------------------------------------------------------
# Root Endpoint
#---------------------------------------------------------

@app.get("/")
async def root(request: Request):
    user_agent = request.headers.get("user-agent", "")
    logger.info(f"Root endpoint accessed by user-agent: {user_agent}")
    
    return {
        "message": "Hello, welcome to the FastAPI application related to the NUI project!",
        "description": "This application provides a user interface for performing network scans using Nmap.",
        "endpoints": {
            "/api/ping_scan": {
                "description": "Perform a ping scan on the specified network or IP range.",
                "usage": "Send a GET request with the target network/IP as a query parameter."
            },
            "/api/host_info/{ip}": {
                "description": "Retrieve detailed information about the specified host.",
                "usage": "Send a GET request with the target IP address as a path parameter."
            },
            "/api/network_info": {
                "description": "Retrieve information about the network.",
                "usage": "Send a GET request to get information about the network."
            },
            "/api/clear_cache": {
                "description": "Clear the cached network scan results.",
                "usage": "Send a POST request to clear the cache."
            },
            "/api/cache_status": {
                "description": "Check the status of the network scan cache.",
                "usage": "Send a GET request to retrieve the cache status."
            }
        },
        "user_agent": user_agent
    }

#---------------------------------------------------------
# Include Routers for Different API Endpoints
#---------------------------------------------------------

for router in routers:
    app.include_router(router, prefix="/api")
#---------------------------------------------------------
# Environment-specific Logging Configuration
#---------------------------------------------------------

if __name__ == '__main__':
    # Set logging level based on environment
    if os.getenv("ENV") == "production":
        logging.basicConfig(level=logging.WARNING, format=LOG_FORMAT)
    else:
        logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)

    # Configure rotating file handler for logs
    log_file = "app.log"
    log_path = os.path.join(os.path.dirname(__file__), "logs", log_file)
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    handler = RotatingFileHandler(log_path, maxBytes=10000000, backupCount=5)  # Rotate every 10MB, keep 5 backups
    handler.setFormatter(logging.Formatter(LOG_FORMAT))
    logger.addHandler(handler)

    #---------------------------------------------------------
    # Integration with Prometheus for Monitoring
    #---------------------------------------------------------

    Instrumentator().instrument(app).expose(app)
    start_http_server(8000)  # Expose Prometheus metrics on port 8000

    #---------------------------------------------------------
    # Run FastAPI Application with Uvicorn
    #---------------------------------------------------------

    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True)
