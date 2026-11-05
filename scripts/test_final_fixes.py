import urllib.request
import json
import subprocess
import os

# 1. Test village search API boundary
queries = ['Kharar', 'Singur', 'Arambagh']
for q in queries:
    url = f"http://localhost:3000/api/villages/search?q={q}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode())
        results = data.get('results', [])
        print(f"\nQuery '{q}': found {len(results)} results")
        if results:
            r = results[0]
            pts = r.get('boundary', [])
            print(f"  First match: {r['name']}")
            print(f"  Boundary point count: {len(pts)}")
            # Check if square (4-5 points) vs irregular (30+ points)
            if len(pts) >= 20:
                print("  STATUS: IRREGULAR NATURAL BOUNDARY CONFIRMED!")
            else:
                print("  STATUS: Warning - low point count!")

# 2. Capture live UI screenshots
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

out_dir = r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682"

shots = [
    ("verify_navbar_1280", "http://localhost:3000/farmer/dashboard", 1280, 800),
    ("verify_validation_page", "http://localhost:3000/farmer/insurance-validation", 1366, 950),
    ("verify_apply_page", "http://localhost:3000/farmer/insurance/apply", 1366, 950),
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
    print(f"Saved {out_file}")

print("\nVerification complete!")

