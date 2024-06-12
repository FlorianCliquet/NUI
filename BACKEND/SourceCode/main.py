#--------------------------------->[IMPORT]<------------------------------------------#
import nmap
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
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
api = Api(app)

class PingScanAPI(Resource):
    def get(self):
        ping_scan()
        hosts = []
        for host in nm.all_hosts():
            hosts.append(nm[host])
        return jsonify(hosts)
    
class HostInfoAPI(Resource):
    def get(self, ip):
        return jsonify(host_info(ip))
    
    
api.add_resource(PingScanAPI, "/api/ping_scan")
api.add_resource(HostInfoAPI, "/api/host_info/<string:ip>")


if __name__ == '__main__':
    app.run(debug=True)