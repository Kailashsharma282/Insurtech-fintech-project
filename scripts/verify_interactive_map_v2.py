import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682"
os.makedirs(OUT_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    print("1. Opening /intelligence/map...")
    page.goto("http://localhost:3000/intelligence/map", wait_until="networkidle")
    time.sleep(2)
    
    # 1. Click "Risk Tiers" layer pill inside the map container
    print("2. Clicking 'Risk Tiers' inside the map controls for Ghatal Block...")
    # Map controls layer pill: has icon 🛡️ or text "Risk Tiers"
    map_risk_btn = page.locator("div.z-\\[1000\\] button:has-text('Risk Tiers')").first
    if map_risk_btn.is_visible():
        map_risk_btn.click()
    else:
        page.locator("button:has-text('Risk Tiers')").first.click()
        
    time.sleep(2)
    page.screenshot(path=os.path.join(OUT_DIR, "final_ghatal_risk_tiers.png"))
    print("Captured final_ghatal_risk_tiers.png")
    
    # 2. Click "Kharar Municipal / Gram Panchayat Unit"
    print("3. Clicking Kharar Quick Boundary...")
    page.locator("button:has-text('Kharar')").first.click()
    time.sleep(2)
    
    # Click "CHF 2025" layer inside map controls
    print("4. Selecting CHF 2025 layer on Kharar...")
    map_chf_btn = page.locator("div.z-\\[1000\\] button:has-text('CHF 2025')").first
    if map_chf_btn.is_visible():
        map_chf_btn.click()
    time.sleep(2)
    page.screenshot(path=os.path.join(OUT_DIR, "final_kharar_chf_aligned.png"))
    print("Captured final_kharar_chf_aligned.png")
    
    # 3. Click "Risk Tiers" on Kharar
    print("5. Selecting Risk Tiers layer on Kharar...")
    if map_risk_btn.is_visible():
        map_risk_btn.click()
    time.sleep(2)
    page.screenshot(path=os.path.join(OUT_DIR, "final_kharar_risk_aligned.png"))
    print("Captured final_kharar_risk_aligned.png")

    # 4. Search for a pan-India village, e.g. "Singur"
    print("6. Searching for Singur...")
    search_input = page.locator("input[placeholder*='Search any village']").first
    search_input.fill("Singur")
    time.sleep(1.5)
    
    first_result = page.locator("div:has-text('Singur')").last
    if first_result.is_visible():
        first_result.click()
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "final_singur_chf_aligned.png"))
        print("Captured final_singur_chf_aligned.png")
    
    browser.close()

print("All screenshots captured successfully!")
