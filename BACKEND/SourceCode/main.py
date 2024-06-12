#--------------------------------->[IMPORT]<------------------------------------------#
import nmap
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_caching import Cache

#-------------------------------------------------------------------------------------#


#--------------------------------->[NMAP]<------------------------------------------#
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

#-----------------------------------------------------------------------------------#


#--------------------------------->[FLASK]<------------------------------------------#
app = Flask(__name__)
CORS(app)
api = Api(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple', 'CACHE_DEFAULT_TIMEOUT': 3600})  # Cache timeout set to 1 hour

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

class ClearCacheAPI(Resource):
    def post(self):
        # Delete the cache
        cache.delete('cachedNodes')
        return {'message': 'Cache cleared successfully'}, 200


api.add_resource(PingScanAPI, "/api/ping_scan")
api.add_resource(HostInfoAPI, "/api/host_info/<string:ip>")
api.add_resource(ClearCacheAPI, "/api/clear_cache")


if __name__ == '__main__':
    app.run(debug=True)