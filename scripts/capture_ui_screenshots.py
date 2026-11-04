import os
import subprocess
import time

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
output_dir = os.path.abspath('live_screenshots')
os.makedirs(output_dir, exist_ok=True)

pages = [
    ('farmer_insurance_dark', 'http://localhost:3000/farmer/insurance?theme=dark'),
    ('farmer_insurance_light', 'http://localhost:3000/farmer/insurance?theme=light'),
    ('insurer_claims_dark', 'http://localhost:3000/insurer/claims?theme=dark'),
    ('insurer_claims_light', 'http://localhost:3000/insurer/claims?theme=light'),
    ('intelligence_map_dark', 'http://localhost:3000/intelligence/map?theme=dark'),
    ('farmer_farms_dark', 'http://localhost:3000/farmer/farms?theme=dark'),
    ('farmer_disease_dark', 'http://localhost:3000/farmer/disease?theme=dark')
]

for name, url in pages:
    out_file = os.path.join(output_dir, f'{name}.png')
    cmd = [
        chrome_path,
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--window-size=1280,1100',
        '--virtual-time-budget=4500',
        f'--screenshot={out_file}',
        url
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file):
        print(f'Captured {name}: {os.path.getsize(out_file)} bytes')
    else:
        print(f'FAILED to capture {name}')

print('ALL SCREENSHOTS COMPLETED')

