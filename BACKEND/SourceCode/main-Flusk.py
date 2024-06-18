import nmap
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_caching import Cache
from netifaces import gateways, AF_INET
from socket import gethostbyname, gethostname
from werkzeug.exceptions import HTTPException

# Initialize Flask application
app = Flask(__name__)
CORS(app)
api = Api(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple', 'CACHE_DEFAULT_TIMEOUT': 600})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Nmap scanner
nm = nmap.PortScanner()

def scan_network(network_range="192.168.1.0/24", arguments="-sn"):
    """
    Scan the network to get the list of active hosts.
    """
    try:
        nm.scan(network_range, arguments=arguments)
    except Exception as e:
        logger.error(f"Error during network scan: {e}")
        raise

def get_host_info(ip, arguments="-O"):
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

def get_default_gateway():
    """
    Get the default gateway of the network.
    
    Returns:
        str: IP address of the default gateway.
    """
    try:
        return gateways()['default'][AF_INET][0]
    except Exception as e:
        logger.error(f"Error retrieving default gateway: {e}")
        raise

def get_local_ip():
    """
    Get the IP address of the local device.
    
    Returns:
        str: IP address of the local device.
    """
    try:
        return gethostbyname(gethostname())
    except Exception as e:
        logger.error(f"Error retrieving local IP address: {e}")
        raise

class PingScanAPI(Resource):
    @cache.cached()
    def get(self):
        """
        Perform a ping scan on the network and return a list of active hosts.
        
        Returns:
            json: List of active hosts.
        """
        try:
            logger.info("Performing ping scan...")
            scan_network()
            hosts = [nm[host] for host in nm.all_hosts()]
            return jsonify(hosts)
        except Exception as e:
            logger.error(f"Error in PingScanAPI: {e}")
            return {'error': str(e)}, 500

class HostInfoAPI(Resource):
    @cache.cached()
    def get(self, ip):
        """
        Get detailed information about a specific host.
        
        Parameters:
            ip (str): IP address of the host.
        
        Returns:
            json: Detailed information about the host.
        """
        try:
            logger.info(f"Getting host info for IP: {ip}")
            return jsonify(get_host_info(ip))
        except Exception as e:
            logger.error(f"Error in HostInfoAPI: {e}")
            return {'error': str(e)}, 500

class GetGatewayAPI(Resource):
    def get(self):
        """
        Get the default gateway of the network.
        
        Returns:
            json: Default gateway IP address.
        """
        try:
            logger.info("Getting default gateway...")
            return jsonify({'gateway': get_default_gateway()})
        except Exception as e:
            logger.error(f"Error in GetGatewayAPI: {e}")
            return {'error': str(e)}, 500

class GetIPAPI(Resource):
    def get(self):
        """
        Get the IP address of the local device.
        
        Returns:
            json: Local device IP address.
        """
        try:
            logger.info("Getting local IP address...")
            return jsonify({'ip': get_local_ip()})
        except Exception as e:
            logger.error(f"Error in GetIPAPI: {e}")
            return {'error': str(e)}, 500

class ClearCacheAPI(Resource):
    def post(self):
        """
        Clear the cache.
        
        Returns:
            json: Message indicating cache clearance status.
        """
        try:
            logger.info("Clearing cache...")
            cache.clear()
            logger.info("Cache cleared successfully.")
            return {'message': 'Cache cleared successfully'}, 200
        except Exception as e:
            logger.error(f"Error in ClearCacheAPI: {e}")
            return {'error': str(e)}, 500

class CacheStatusAPI(Resource):
    def get(self):
        """
        Check the status of the cache.
        
        Returns:
            json: Message indicating whether the cache is empty or contains data.
        """
        try:
            cache_stats = cache.cache._cache
            is_empty = len(cache_stats) == 0
            logger.info(f"Cache status: {'empty' if is_empty else 'contains data'}")
            # Create a summary of the cache content
            cache_summary = {k: str(type(v)) for k, v in cache_stats.items()}
            return {'cache_empty': is_empty, 'cache_summary': cache_summary}, 200
        except Exception as e:
            logger.error(f"Error in CacheStatusAPI: {e}")
            return {'error': str(e)}, 500

# Add resource endpoints to the API
api.add_resource(PingScanAPI, "/api/ping_scan")
api.add_resource(HostInfoAPI, "/api/host_info/<string:ip>")
api.add_resource(GetGatewayAPI, "/api/get_gateway")
api.add_resource(GetIPAPI, "/api/get_ip")
api.add_resource(ClearCacheAPI, "/api/clear_cache")
api.add_resource(CacheStatusAPI, "/api/cache_status")

@app.errorhandler(HTTPException)
def handle_exception(e):
    """Handle HTTP exceptions."""
    response = e.get_response()
    response.data = jsonify(code=e.code, name=e.name, description=e.description)
    response.content_type = "application/json"
    return response

if __name__ == '__main__':
    app.run(debug=True)