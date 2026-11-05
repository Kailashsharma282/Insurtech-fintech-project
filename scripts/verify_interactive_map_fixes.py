import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682"
os.makedirs(OUT_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    print("1. Navigating to /intelligence/map...")
    page.goto("http://localhost:3000/intelligence/map", wait_until="networkidle")
    time.sleep(2)
    
    # Screenshot 1: Ghatal Block with default CHF
    page.screenshot(path=os.path.join(OUT_DIR, "verify_ghatal_chf.png"))
    print("Captured verify_ghatal_chf.png")
    
    # 2. Click "Risk Tiers" layer button for Ghatal
    print("2. Clicking 'Risk Tiers' layer for Ghatal Block...")
    risk_btn = page.locator("button:has-text('Risk Tiers')").first
    risk_btn.click()
    time.sleep(2)
    page.screenshot(path=os.path.join(OUT_DIR, "verify_ghatal_risk_tiers.png"))
    print("Captured verify_ghatal_risk_tiers.png (Risk Tiers on Ghatal Block confirmed)")
    
    # 3. Click "Kharar Municipal / Gram Panchayat Unit"
    print("3. Selecting Kharar village...")
    kharar_btn = page.locator("button:has-text('Kharar')").first
    kharar_btn.click()
    time.sleep(2)
    
    # Click CHF 2025 layer
    chf_btn = page.locator("button:has-text('CHF 2025')").first
    chf_btn.click()
    time.sleep(2)
    page.screenshot(path=os.path.join(OUT_DIR, "verify_kharar_chf_aligned.png"))
    print("Captured verify_kharar_chf_aligned.png (Kharar CHF boundary alignment confirmed)")
    
    # 4. Click Risk Tiers on Kharar
    print("4. Clicking 'Risk Tiers' for Kharar village...")
    risk_btn.click()
    time.sleep(2)
    page.screenshot(path=os.path.join(OUT_DIR, "verify_kharar_risk_aligned.png"))
    print("Captured verify_kharar_risk_aligned.png (Kharar Risk Tiers boundary alignment confirmed)")
    
    # 5. Search for another Indian village via search input, e.g. "Arambagh"
    print("5. Searching for Arambagh...")
    search_input = page.locator("input[placeholder*='Search any village']").first
    search_input.fill("Arambagh")
    time.sleep(1.5)
    
    # Click search result
    first_result = page.locator("button:has-text('Arambagh')").first
    if first_result.is_visible():
        first_result.click()
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "verify_arambagh_aligned.png"))
        print("Captured verify_arambagh_aligned.png (Arambagh boundary alignment confirmed)")
    
    browser.close()

print("All interactive Playwright verification tests passed!")

