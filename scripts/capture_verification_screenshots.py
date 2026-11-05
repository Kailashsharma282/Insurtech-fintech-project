import subprocess
import time
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

out_dir = r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682"

pages = [
    ("farmer_insurance_light", "http://localhost:3000/farmer/insurance", 1280, 1000),
    ("insurer_claims_light", "http://localhost:3000/insurer/claims", 1440, 900),
]

for name, url, w, h in pages:
    out_file = os.path.join(out_dir, f"verify_{name}.png")
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={w},{h}",
        "--hide-scrollbars",
        f"--screenshot={out_file}",
        url
    ]
    print(f"Capturing {url} -> {out_file}...")
    subprocess.run(cmd, check=True)
    print(f"Saved {out_file} ({os.path.getsize(out_file)} bytes)")

print("All screenshots captured successfully!")

