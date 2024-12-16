from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import json
import urllib.request
import urllib.error

class FloodDataHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def do_GET(self):
        if self.path.startswith('/api/flood-data'):
            try:
                # Fetch data from JKM API
                url = "https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-pie.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id="
                with urllib.request.urlopen(url) as response:
                    data = response.read()
                    
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
                return
            except urllib.error.URLError as e:
                self.send_error(500, f"Error fetching data: {str(e)}")
                return
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, FloodDataHandler)
    print('Server running on http://localhost:8000')
    httpd.serve_forever()
