import subprocess
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

out_dir = r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682"

shots = [
    ("final_farmer_insurance_light", "http://localhost:3000/farmer/insurance", 1440, 1050),
    ("final_insurer_claims_light", "http://localhost:3000/insurer/claims", 1680, 950),
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
        url
    ]
    subprocess.run(cmd, check=True)
    print(f"Captured {out_file}")

print("All final screenshots ready!")

