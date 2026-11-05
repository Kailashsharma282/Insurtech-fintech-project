import subprocess
import os
import time

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT_DIR = os.path.abspath("ui_screenshots_verification")
os.makedirs(OUT_DIR, exist_ok=True)

pages = [
    ("register_light.png", "http://localhost:3000/register", 1400, 1600, False),
    ("admin_exceptions_light.png", "http://localhost:3000/admin/exceptions", 1400, 1000, False),
    ("admin_exceptions_dark.png", "http://localhost:3000/admin/exceptions", 1400, 1000, True),
    ("farms_list_light.png", "http://localhost:3000/farmer/farms", 1400, 1100, False),
    ("intelligence_map_light.png", "http://localhost:3000/intelligence/map", 1400, 1100, False),
]

for filename, url, width, height, is_dark in pages:
    out_path = os.path.join(OUT_DIR, filename)
    args = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={width},{height}",
        f"--screenshot={out_path}",
    ]
    if is_dark:
        args.append("--blink-settings=forceDarkModeEnabled=true")
    
    args.append(url)
    print(f"Capturing {filename} from {url}...")
    try:
        subprocess.run(args, timeout=20, check=True)
        print(f"Captured: {out_path} (size: {os.path.getsize(out_path)} bytes)")
    except Exception as e:
        print(f"Error capturing {filename}: {e}")

print("Done taking screenshots!")

