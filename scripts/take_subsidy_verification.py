import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Mobile view matching user's phone screenshot
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:3000/farmer/insurance", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await page.screenshot(path=r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682\verified_mobile_policy_subsidy.png", full_page=True)
        
        # Desktop view
        page_desktop = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page_desktop.goto("http://localhost:3000/farmer/insurance", wait_until="networkidle")
        await page_desktop.wait_for_timeout(2000)
        await page_desktop.screenshot(path=r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682\verified_desktop_policy_subsidy.png", full_page=False)
        
        await browser.close()
        print("Screenshots taken successfully!")

asyncio.run(main())
