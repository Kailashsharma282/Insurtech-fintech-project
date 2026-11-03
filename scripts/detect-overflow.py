import subprocess
import json
import urllib.request
import time
import sys

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
chrome_proc = subprocess.Popen([
    CHROME,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    'http://localhost:3000/'
])

try:
    time.sleep(2)
    tabs = json.loads(urllib.request.urlopen('http://localhost:9222/json').read().decode())
    ws_url = tabs[0]['webSocketDebuggerUrl']
    print("WebSocket URL:", ws_url)
finally:
    chrome_proc.terminate()

