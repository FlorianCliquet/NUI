#--------------------------------->[IMPORT]<------------------------------------------#
import nmap
from flask import Flask, request, jsonify
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

tests()
#-----------------------------------------------------------------------------------#


#--------------------------------->[FLASK]<------------------------------------------#
app = Flask(__name__)

@app.route("/ping_scan", methods=["GET"])
def get_ping_scan():
    """
    This function is used to get the list of active hosts.
    """
    ping_scan()
    hosts = nm.all_hosts()
    return jsonify(hosts)


def get_host_info(ip):
    """
    This function is used to get the full info about an active host.
    """
    return jsonify(host_info(ip))
