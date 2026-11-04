with open('src/app/technology/chf/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = "{/* Live Calculation Banner - Simple Solid Design */}"
replacement = """{/* Real-Time Google Earth Engine Multi-Spectral Telemetry */}
        <EarthEngineTelemetry />

        {/* Live Calculation Banner - Simple Solid Design */}"""

if target in text:
    text = text.replace(target, replacement)
    with open('src/app/technology/chf/page.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully added EarthEngineTelemetry to technology/chf/page.tsx")
else:
    print("Target not found!")

