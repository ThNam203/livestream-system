import sys
import socket
import select
import random
from itertools import cycle
from prometheus_client import start_http_server, Counter, Gauge

SERVER_POOL = [('0.0.0.0', 1936), ('0.0.0.0', 1937), ('0.0.0.0', 1938), ('0.0.0.0', 1939)]
SERVER_ITER = cycle(SERVER_POOL)

# Create gauge instances for each server
pool_connections_gauges = {
    server_port: Gauge(f'server_{server_port}_connections', f'Current number of RTMP streams in server {server_port}')
    for _, server_port in SERVER_POOL
}
total_connections_counter = Counter('total_connections', 'Total number of RTMP streams')

def round_robin(iter):
    return next(iter)

class LoadBalancer:
    flow_table = dict()
    sockets = []

    def __init__(self, ip, port):
        self.ip = ip
        self.port = port

        self.cs_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.cs_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.cs_socket.bind((self.ip, self.port))
        self.cs_socket.listen(10)
        self.sockets.append(self.cs_socket)
        print("Running load balancer on port", self.port)

    def start(self):
        while True:
            read_list, _, _ = select.select(self.sockets, [], [])
            for sock in read_list:
                if sock == self.cs_socket:
                    print('='*40 + 'flow start' + '='*39)
                    self.on_accept()
                    break
                else:
                    try:
                        data = sock.recv(4096)
                        if data:
                            self.on_recv(sock, data)
                        else:
                            self.on_close(sock)
                            break
                    except Exception:
                        self.on_close(sock)
                        break

    def on_accept(self):
        client_socket, client_addr = self.cs_socket.accept()
        print(f'Client connected: {client_addr} <==> {self.cs_socket.getsockname()}')

        # Increase Prometheus counters
        total_connections_counter.inc()
        server_ip, server_port = self.select_server()
        pool_connections_gauges[server_port].inc()

        ss_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            ss_socket.connect((server_ip, server_port))
            print(f'Server connected: {ss_socket.getsockname()} <==> {(socket.gethostbyname(server_ip), server_port)}')
        except Exception as e:
            print(f"Can't establish connection with remote server, error: {e}")
            client_socket.close()
            return

        self.sockets.append(client_socket)
        self.sockets.append(ss_socket)
        self.flow_table[client_socket] = ss_socket
        self.flow_table[ss_socket] = client_socket

    def on_recv(self, sock, data):
        remote_socket = self.flow_table[sock]
        remote_socket.send(data)

    def on_close(self, sock):
        print(f'Client {sock.getpeername()} has disconnected')

        # Decrease Prometheus counters
        total_connections_counter.dec()
        server_ip, server_port = self.select_server()
        pool_connections_gauges[server_port].dec()

        ss_socket = self.flow_table[sock]
        self.sockets.remove(sock)
        self.sockets.remove(ss_socket)
        sock.close()
        ss_socket.close()
        del self.flow_table[sock]
        del self.flow_table[ss_socket]

    def select_server(self):
        return round_robin(SERVER_ITER)

if __name__ == '__main__':
    try:
        # Start Prometheus HTTP server
        start_http_server(9111)
        print("Load balancer metrics server running at http://localhost:9111/metrics")

        # Start load balancer
        LoadBalancer('0.0.0.0', 1935).start()

    except KeyboardInterrupt:
        print("Ctrl C - Stopping load_balancer")
        sys.exit(1)

