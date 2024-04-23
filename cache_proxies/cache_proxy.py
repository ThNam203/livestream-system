import socket
from urllib.request import Request, urlopen, HTTPError

SERVER_HOST = '0.0.0.0'
SERVER_PORT = '8080'
MAIN_SERVER_URL = '0.0.0.0:8000'

def main():
    server_socket = socket.socket(socket.AF_INEF, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((SERVER_HOST, SERVER_PORT))
    server_socket.listen(1)
    print(f'cache proxy listening on {SERVER_HOST} : {SERVER_PORT}')

    while True:
        client_connection, client_address = server_socket.accept()
        request = client_connection.recv(1024).decode()
        print(f"client {client_address} sent {request}")

        try:
            # get the file name
            headers = request.split('\n')
            top_header = headers[0].split()
            method = top_header[0]
            filename = top_header[1]

            if (method != "GET"):
                response = "HTTP/1.0 405 Method Not Allowed\r\nContent-Type: text/html\r\n\r\n<h1>405 Method Not Allowed</h1>"
                client_connection.sendall(response.encode())
            else:
                content = fetch_file(filename)

                if content:
                    response = 'HTTP/1.0 200 OK\n\n' + content
                else:
                    response = 'HTTP/1.0 404 NOT FOUND\n\n File Not Found'

                # Send the response and close the connection
                client_connection.sendall(response.encode())
        finally:
            client_connection.close()


def fetch_file(filename):
    file_from_cache = fetch_from_cache(filename)

    if file_from_cache:
        return file_from_cache
    else:
        file_from_server = fetch_from_server(filename)

        if file_from_server:
            save_in_cache(filename, file_from_server)
            return file_from_server
        else:
            return None

