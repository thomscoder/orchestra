import socket

hostpresent = False
react_app_host_present = False
hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)
peer_port = input("Digit peer port: ")
server_ws_port = input("Digit server port: ")
path=input("Peer server path: ")

with open('../.env','w') as file:
    with open('../.env','r') as read_file:
        for line in read_file:
            if "HOST" in line:
                hostpresent = True
        if hostpresent == False:
            file.write("\nHOST={ip} \nPATH={path} \nPORT={port} \nP_PORT={p_port}".format(ip=ip_address, path=path, p_port=peer_port, port=server_ws_port))

with open('../client/.env','w') as file:
    with open('../client/.env','r') as read_var:
        for line in read_var:
            if "REACT_APP_HOST" in line:
                react_app_host_present = True
        if react_app_host_present == False:
            file.write("\nREACT_APP_ENDPOINT=http://{ip}: \nREACT_APP_HOST={ip} \n REACT_APP_P_PORT={p_port} \n REACT_APP_PORT={port} \n REACT_APP_PATH={path}".format(ip=ip_address, path=path, p_port=peer_port, port=server_ws_port))
            
            
