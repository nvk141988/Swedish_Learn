import http.server
import socketserver
import threading
from playwright.sync_api import sync_playwright
import time

PORT = 8000
DIRECTORY = "."

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()

# Give server time to start
time.sleep(2)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(f"http://localhost:{PORT}")

    # Wait for the vocab to load
    page.wait_for_selector(".vocab-card")
    page.screenshot(path="vocab_tab.png", full_page=True)

    # Click on Sentences tab
    page.click("text=Sentences")
    page.wait_for_selector(".sentence-block")
    page.screenshot(path="sentences_tab.png", full_page=True)

    # Open first grammar accordion
    page.click(".grammar-toggle >> nth=0")
    page.wait_for_timeout(500) # give it time to open
    page.screenshot(path="grammar_accordion_open.png", full_page=True)

    print("Screenshots captured successfully.")
    browser.close()
