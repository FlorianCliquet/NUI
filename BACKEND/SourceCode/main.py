#--------------------------------->[IMPORT]<------------------------------------------#
import nmap
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_caching import Cache
from netifaces import gateways, ifaddresses, AF_INET
from socket import gethostbyname, gethostname

#-------------------------------------------------------------------------------------#


#--------------------------------->[NETWORK]<------------------------------------------#
nm = nmap.PortScanner()

def ping_scan():
    """
    This function is used to scan the network and get the list of active hosts.
    """
    nm.scan("192.168.1.0/24", arguments="-sn")


def host_info(ip):
    """
    This function is used to get the full info about an active host.
    """
    nm.scan(ip, arguments="-O")
    return nm[ip]


def get_gateway():
    """
    This function is used to get the default gateway.
    """
    return gateways()['default'][AF_INET][0]

def get_ip():
    """
    This function is used to get the ip address of the device.
    """
    return gethostbyname(gethostname())

def tests():
    """
    This function is used to test the function.
    """
    ping_scan()
    hosts = nm.all_hosts()
    for host in hosts:
        print(host)
        print(nm[host])
    print(host_info("192.168.1.27"))

#--------------------------------------------------------------------------------------#


#--------------------------------->[FLASK]<------------------------------------------#
app = Flask(__name__)
CORS(app)
api = Api(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple', 'CACHE_DEFAULT_TIMEOUT': 600})  # Cache timeout set to 10 min

class PingScanAPI(Resource):
    @cache.cached()
    def get(self):
        ping_scan()
        hosts = []
        for host in nm.all_hosts():
            hosts.append(nm[host])
        return jsonify(hosts)

class HostInfoAPI(Resource):
    @cache.cached()
    def get(self, ip):
        return jsonify(host_info(ip))

class GetGatewayAPI(Resource):
    def get(self):
        return get_gateway()

class GetIPAPI(Resource):
    def get(self):
        return get_ip() 

class ClearCacheAPI(Resource):
    def post(self):
        # Clear the cache
        cache.clear()
        return {'message': 'Cache cleared successfully'}, 200


api.add_resource(PingScanAPI, "/api/ping_scan")
api.add_resource(HostInfoAPI, "/api/host_info/<string:ip>")
api.add_resource(GetGatewayAPI, "/api/get_gateway")
api.add_resource(GetIPAPI, "/api/get_ip")
api.add_resource(ClearCacheAPI, "/api/clear_cache")


if __name__ == '__main__':
    app.run(debug=True)