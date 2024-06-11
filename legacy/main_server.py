import errno
import os
import signal
import socket

SERVER_ADDRESS = (HOST, PORT) = '0.0.0.0', 8888
REQUEST_QUEUE_SIZE = 16

def grim_reaper(signum, frame):
    while True:
        try:
            pid, status = os.waitpid(
                -1,          # Wait for any child process
                 os.WNOHANG  # Do not block and return EWOULDBLOCK error
            )
        except OSError:
            return

        if pid == 0:  # no more zombies
            return

def handle_request(client_connection: socket):
    request = client_connection.recv(1024)
    request_lines = request.decode().split('\r\n')  # Split request into lines
    method = request_lines[0].split(' ')[0]

    if (method != 'GET'):
        http_response = "HTTP/1.1 405 Method Not Allowed\r\n\r\nOnly GET method is allowed."
        client_connection.sendall(http_response.encode())
        return
    
    try:
        file_path = request_lines[0].split(' ')[1][1:]  # get file path
        working_dir = os.path.dirname(os.path.abspath(__file__))
        actual_file_path = os.path.join(working_dir, file_path)
        with open(actual_file_path, "rb") as file:
            file_content = file.read()
        
        # application/vnd.apple.mpegurl is .m3u8 file
        # video/MP2T is .ts file (fragment)
        content_type = "application/vnd.apple.mpegurl" if file_path.endswith(".m3u8") else "video/MP2T"
        cache_time = 2 if file_path.endswith(".m3u8") else 60
        
        http_response = (
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: {}\r\n"
            "Content-Length: {}\r\n"
            "Cache-Control: public, max-age:{}\r\n"
            "Access-Control-Allow-Origin: *\r\n"  # Add CORS header for allowing all origins
            "Access-Control-Allow-Methods: GET\r\n"  # Specify allowed methods
            "Access-Control-Allow-Headers: Content-Type\r\n\r\n"  # Specify allowed headers
        ).format(content_type, len(file_content), cache_time).encode() + file_content
        
        print("sent " + actual_file_path)
        client_connection.sendall(http_response)
    except FileNotFoundError:
        http_response = "HTTP/1.1 404 Not Found\r\n\r\nFile not found."
        client_connection.sendall(http_response.encode())


def serve_forever():
    listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listen_socket.bind(SERVER_ADDRESS)
    listen_socket.listen(REQUEST_QUEUE_SIZE)
    print('Serving HTTP on port {port} ...'.format(port=PORT))

    signal.signal(signal.SIGCHLD, grim_reaper)

    clients = []
    while True:
        try:
            client_connection, client_address = listen_socket.accept()
        except IOError as e:
            code, msg = e.args
            # restart 'accept' if it was interrupted
            if code == errno.EINTR:
                continue
            else:
                raise

        # store the reference otherwise it's garbage collected
        # on the next loop run
        clients.append(client_connection)
        pid = os.fork()
        if pid == 0:  # child process
            listen_socket.close()  # close the child copy socket
            handle_request(client_connection)
            client_connection.close()
            os._exit(0)  # remove child process
        else:  # parent process
            client_connection.close()

# reference: https://ruslanspivak.com/lsbaws-part3/
if __name__ == '__main__':
    serve_forever()
