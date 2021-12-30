import socket
import os

hostpresent = False
react_app_host_present = False


hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)
os.system("cd ../certificates && mkcert localhost {ip}".format(ip=ip_address))

print("Set Server environment variables")
with open('../.env','w') as file:
    server_ws_port = input("Digit server port: ")
    path="/"
    with open('../.env','r') as read_file:
        for line in read_file:
            if "HOST" in line:
                hostpresent = True
        if hostpresent == False:
            file.write("HOST={ip} \nPATH={path} \nPORT={port} \nCERTKEY=localhost+1-key.pem \nCERT=localhost+1.pem ".format(ip=ip_address, path=path, port=server_ws_port))

print("Set Client environment variables")
with open('../client/.env','w') as file:
    peer_port = input("Peer server port: ")
    peer_host = input("Peer host: ")
    with open('../client/.env','r') as read_var:
        for line in read_var:
            if "REACT_APP_HOST" in line:
                react_app_host_present = True
        if react_app_host_present == False:
            file.write("REACT_APP_HOST={host} \nREACT_APP_PORT={port}".format(host=peer_host, port=peer_port))
            
            
