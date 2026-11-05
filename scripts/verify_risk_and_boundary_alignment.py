import subprocess
import os
import time

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

out_dir = r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682"

shots = [
    ("verify_insurer_risk_map", "http://localhost:3000/insurer/risk-map", 1440, 950),
    ("verify_intelligence_map", "http://localhost:3000/intelligence/map", 1440, 950),
    ("verify_farmer_farms_map", "http://localhost:3000/farmer/farms", 1440, 950)
]

for name, url, w, h in shots:
    out_file = os.path.join(out_dir, f"{name}.png")
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={w},{h}",
        "--hide-scrollbars",
        f"--screenshot={out_file}",
        "--virtual-time-budget=5000",
        url
    ]
    subprocess.run(cmd, check=True)
    print(f"Captured {out_file}")

print("All screenshots captured successfully!")
