import subprocess
import os
import time

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUT_DIR = os.path.abspath('screenshots')
os.makedirs(OUT_DIR, exist_ok=True)

PAGES = [
    ('01_home', 'http://localhost:3000/'),
    ('02_farmer_dashboard', 'http://localhost:3000/farmer/dashboard'),
    ('03_farmer_validation', 'http://localhost:3000/farmer/insurance-validation'),
    ('04_farmer_disease', 'http://localhost:3000/farmer/disease'),
    ('05_farmer_farms', 'http://localhost:3000/farmer/farms'),
    ('06_farmer_farm_detail', 'http://localhost:3000/farmer/farms/farm-plot-204'),
    ('07_farmer_insurance', 'http://localhost:3000/farmer/insurance'),
    ('08_farmer_optimization', 'http://localhost:3000/farmer/optimization'),
    ('09_technology_chf', 'http://localhost:3000/technology/chf'),
    ('10_insurer_dashboard', 'http://localhost:3000/insurer/dashboard'),
    ('11_insurer_claims', 'http://localhost:3000/insurer/claims'),
    ('12_insurer_claim_detail', 'http://localhost:3000/insurer/claims/claim-clm-084'),
    ('13_insurer_payouts', 'http://localhost:3000/insurer/payouts'),
    ('14_intelligence_weather', 'http://localhost:3000/intelligence/weather'),
    ('15_operations_iot', 'http://localhost:3000/operations/iot'),
    ('16_admin_overview', 'http://localhost:3000/admin/overview'),
    ('17_team', 'http://localhost:3000/team'),
]

MODES = [
    ('laptop', '1280,800'),
    ('mobile', '390,844')
]

for name, url in PAGES:
    for mode, size in MODES:
        out_file = os.path.join(OUT_DIR, f'{name}_{mode}.png')
        cmd = [
            CHROME,
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            f'--window-size={size}',
            '--hide-scrollbars',
            '--virtual-time-budget=1000',
            f'--screenshot={out_file}',
            url
        ]
        subprocess.run(cmd, capture_output=True, timeout=10)
        print(f'Done {name}_{mode}')

print("ALL_DONE")

