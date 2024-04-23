from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys
from prometheus_client import Counter, generate_latest

# counter metric
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP Requests', ['method', 'endpoint', 'status'])

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        REQUEST_COUNT.labels(method='GET', endpoint=self.path, status='200').inc()
        if (self.path == "/metrics"):
            return self.do_metrics()
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        REQUEST_COUNT.labels(method='POST', endpoint=self.path, status='200').inc()
        return SimpleHTTPRequestHandler.do_POST(self)

    def do_metrics(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
        self.end_headers()
        self.wfile.write(generate_latest())

if __name__ == '__main__':
    test(CORSRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
