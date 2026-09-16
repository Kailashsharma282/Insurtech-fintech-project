import os
import time
from playwright.sync_api import sync_playwright

OUTPUT_DIR = r"C:\Users\kaila\.gemini\antigravity-ide\brain\c7a1e0e5-0091-4279-8692-f0509653e994\pdf_screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

PAGES_TO_CAPTURE = [
    {
        "name": "01_landing_page",
        "url": "http://localhost:3000/",
        "role": "FARMER",
        "title": "Public Landing Page & Closed-Loop Cockpit",
        "delay": 2.5
    },
    {
        "name": "02_farmer_dashboard",
        "url": "http://localhost:3000/farmer/dashboard",
        "role": "FARMER",
        "title": "Farmer Agronomic Resilience Hub",
        "delay": 2.5
    },
    {
        "name": "03_farmer_farms",
        "url": "http://localhost:3000/farmer/farms",
        "role": "FARMER",
        "title": "My Farms Portfolio & Satellite Index Map",
        "delay": 2.5
    },
    {
        "name": "04_farmer_disease_ai",
        "url": "http://localhost:3000/farmer/disease",
        "role": "FARMER",
        "title": "Computer Vision Leaf Disease AI",
        "delay": 2.5
    },
    {
        "name": "05_farmer_ga_pso",
        "url": "http://localhost:3000/farmer/optimization",
        "role": "FARMER",
        "title": "GA-PSO Bio-Inspired Nutrient Optimizer",
        "delay": 2.5
    },
    {
        "name": "06_farmer_iot_alerts",
        "url": "http://localhost:3000/farmer/alerts",
        "role": "FARMER",
        "title": "In-Situ IoT Sensor Streams & Telemetry Alerts",
        "delay": 2.5
    },
    {
        "name": "07_farmer_insurance_hub",
        "url": "http://localhost:3000/farmer/insurance",
        "role": "FARMER",
        "title": "Parametric Crop Insurance Active Policies",
        "delay": 2.5
    },
    {
        "name": "08_farmer_insurance_apply",
        "url": "http://localhost:3000/farmer/insurance/apply",
        "role": "FARMER",
        "title": "Guided Parametric Insurance Application Form",
        "delay": 2.5
    },
    {
        "name": "09_farmer_payments",
        "url": "http://localhost:3000/farmer/payments",
        "role": "FARMER",
        "title": "Direct Benefit Bank Payouts Ledger",
        "delay": 2.5
    },
    {
        "name": "10_insurer_dashboard",
        "url": "http://localhost:3000/insurer/dashboard",
        "role": "INSURER",
        "title": "Institutional Underwriter Exposure Desk",
        "delay": 2.5
    },
    {
        "name": "11_insurer_policies_review",
        "url": "http://localhost:3000/insurer/policies",
        "role": "INSURER",
        "title": "Policy Applications & Decisioning Review Desk",
        "delay": 2.5
    },
    {
        "name": "12_insurer_risk_map",
        "url": "http://localhost:3000/insurer/risk-map",
        "role": "INSURER",
        "title": "Insurance Unit Spatial Risk Choropleth Map",
        "delay": 2.5
    },
    {
        "name": "13_insurer_claims_evidence",
        "url": "http://localhost:3000/insurer/claims",
        "role": "INSURER",
        "title": "Parametric Claims Verification Console",
        "delay": 2.5
    },
    {
        "name": "14_insurer_payouts_settlement",
        "url": "http://localhost:3000/insurer/payouts",
        "role": "INSURER",
        "title": "7-Stage Automated RBI NEFT/IMPS Settlement",
        "delay": 2.5
    },
    {
        "name": "15_insurer_cryptographic_audit",
        "url": "http://localhost:3000/insurer/audit",
        "role": "INSURER",
        "title": "Immutable Cryptographic SHA-256 Audit Trail",
        "delay": 2.5
    },
    {
        "name": "16_operations_iot",
        "url": "http://localhost:3000/operations/iot",
        "role": "ADMIN",
        "title": "Hardware IoT Ingestion & Pump Relay Control",
        "delay": 2.5
    },
    {
        "name": "17_intelligence_gis_map",
        "url": "http://localhost:3000/intelligence/map",
        "role": "ADMIN",
        "title": "Sentinel Multispectral GIS Analytics Console",
        "delay": 2.5
    },
    {
        "name": "18_auth_login",
        "url": "http://localhost:3000/login",
        "role": "FARMER",
        "title": "Multi-Role Authentication & OTP Portal",
        "delay": 2.0
    },
    {
        "name": "19_how_it_works",
        "url": "http://localhost:3000/how-it-works",
        "role": "INSURER",
        "title": "6-Stage Technical Architecture & Agronomic Math",
        "delay": 2.5
    }
]

def main():
    print(f"Starting Playwright screenshot capture for {len(PAGES_TO_CAPTURE)} pages...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=1.5
        )

        # Pre-seed localStorage in the browser context so the language selection modal is NEVER shown
        context.add_init_script("""
            localStorage.setItem('agrisure_language_selected', 'true');
            localStorage.setItem('agrisure_language', 'en');
        """)

        for item in PAGES_TO_CAPTURE:
            name = item["name"]
            url = item["url"]
            role = item["role"]
            delay = item["delay"]
            out_file = os.path.join(OUTPUT_DIR, f"{name}.png")

            print(f"Capturing [{role}] {name}: {url}")
            
            # Set cookies for role and language
            context.add_cookies([
                {
                    "name": "agrisure_user_role",
                    "value": role,
                    "domain": "localhost",
                    "path": "/"
                }
            ])

            page = context.new_page()
            try:
                # Add init script per page as well to ensure role and flag are set
                page.add_init_script(f"""
                    localStorage.setItem('agrisure_user_role', '{role}');
                    localStorage.setItem('agrisure_language_selected', 'true');
                    localStorage.setItem('agrisure_language', 'en');
                """)
                
                page.goto(url, wait_until="networkidle", timeout=30000)
                
                # Explicitly dismiss any open language modal or backdrop if still lingering
                page.evaluate("""() => {
                    localStorage.setItem('agrisure_language_selected', 'true');
                    // Find and click any 'Continue in English' or close buttons
                    const buttons = Array.from(document.querySelectorAll('button'));
                    for (const btn of buttons) {
                        const txt = (btn.innerText || '').toLowerCase();
                        if (txt.includes('continue in english') || txt === '✕') {
                            btn.click();
                        }
                    }
                    // If any fixed modal backdrop exists for language selection, hide it
                    const modals = document.querySelectorAll('.fixed.inset-0');
                    modals.forEach(m => {
                        if (m.innerText && (m.innerText.includes('Welcome to AgriSure') || m.innerText.includes('Select your language'))) {
                            m.style.display = 'none';
                        }
                    });
                }""")
                
                time.sleep(delay)
                page.screenshot(path=out_file, full_page=False)
                print(f"  -> Successfully captured CLEAN page: {out_file}")
            except Exception as e:
                print(f"  -> Error capturing {name}: {e}")
                try:
                    time.sleep(1)
                    page.screenshot(path=out_file, full_page=False)
                    print(f"  -> Saved on retry: {out_file}")
                except Exception as e2:
                    print(f"  -> Failed retry: {e2}")
            finally:
                page.close()

        browser.close()
    print("Clean screenshot capture complete!")

if __name__ == "__main__":
    main()
