import math
import re

SILABATI_RIVER = [
  (22.7050, 87.6820), # NW Upstream
  (22.6930, 87.6970), # Kharar Edge
  (22.6820, 87.7110), # Ghatal North
  (22.6710, 87.7240), # Ghatal Central Riverbend
  (22.6610, 87.7350), # Ranichak Corridor
  (22.6510, 87.7470), # Radhanagar Basin
  (22.6380, 87.7610), # SE Confluence
]

def pt_to_seg(px, py, x1, y1, x2, y2):
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(px - x1, py - y1)
    t = ((px - x1) * dx + (py - y1) * dy) / (dx*dx + dy*dy)
    t = max(0, min(1, t))
    return math.hypot(px - (x1 + t*dx), py - (y1 + t*dy))

def get_dist_to_river_m(lat, lng):
    min_dist = 1e9
    for i in range(len(SILABATI_RIVER)-1):
        x1, y1 = SILABATI_RIVER[i][1] * 102400, SILABATI_RIVER[i][0] * 111000
        x2, y2 = SILABATI_RIVER[i+1][1] * 102400, SILABATI_RIVER[i+1][0] * 111000
        px, py = lng * 102400, lat * 111000
        d = pt_to_seg(px, py, x1, y1, x2, y2)
        if d < min_dist:
            min_dist = d
    return round(min_dist)

# Now read src/lib/db/seed-data.ts, parse each farm block in SEED_FARMS
with open('src/lib/db/seed-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern for farm definitions
farm_pattern = re.compile(r'\{[^{}]*?id:\s*\'(farm-plot-\d+)\'[\s\S]*?centroid:\s*\{\s*lat:\s*([\d.]+),\s*lng:\s*([\d.]+)\s*\}[\s\S]*?\}', re.MULTILINE)

matches = list(farm_pattern.finditer(text))
print(f"Found {len(matches)} farm objects to recalibrate")

replacements = 0
for m in matches:
    farm_block = m.group(0)
    farm_id = m.group(1)
    lat = float(m.group(2))
    lng = float(m.group(3))
    dist = get_dist_to_river_m(lat, lng)

    # Calculate exact CHF inversely proportional to flood risk (distance to river)
    if dist < 600:
        # Near river: strictly 0.32 - 0.48 (< 0.55)
        chf = round(0.32 + (dist / 600.0) * 0.16, 2)
        moist = round(84 + (1 - dist / 600.0) * 10)
        risk = "CLAIM_TRIGGERED"
        zone = "SILABATI_FLOODPLAIN"
    elif dist <= 1200:
        # Transition zone: strictly 0.58 - 0.68
        t = (dist - 600.0) / 600.0
        chf = round(0.58 + t * 0.10, 2)
        moist = round(66 + (1 - t) * 8)
        risk = "MODERATE" if chf >= 0.63 else "HIGH"
        zone = "TRANSITION_ZONE"
    else:
        # Away from river (upland): strictly 0.74 - 0.86 (> 0.70)
        t = min(1.0, (dist - 1200.0) / 1200.0)
        chf = round(0.74 + t * 0.12, 2)
        moist = round(52 + (1 - t) * 8)
        risk = "LOW"
        zone = "ELEVATED_UPLAND"

    ndvi = round(chf * 0.94, 2)
    lswi = round(chf * 0.52, 2)
    vh = round(-21 + chf * 7, 1)

    new_block = farm_block
    new_block = re.sub(r'currentChf:\s*[\d.]+', f'currentChf: {chf}', new_block)
    new_block = re.sub(r'soilMoisturePct:\s*[\d.]+', f'soilMoisturePct: {moist}', new_block)
    new_block = re.sub(r'riskLevel:\s*\'[^\']+\'', f"riskLevel: '{risk}'", new_block)
    new_block = re.sub(r'ndvi:\s*[\d.]+', f'ndvi: {ndvi}', new_block)
    new_block = re.sub(r'lswi:\s*[\d.]+', f'lswi: {lswi}', new_block)
    new_block = re.sub(r'vhBackscatterDb:\s*[-0-9.]+', f'vhBackscatterDb: {vh}', new_block)
    new_block = re.sub(r'distanceToRiverMeters:\s*\d+', f'distanceToRiverMeters: {dist}', new_block)
    new_block = re.sub(r'hydrologicalZone:\s*\'[^\']+\'', f"hydrologicalZone: '{zone}'", new_block)

    text = text.replace(farm_block, new_block, 1)
    replacements += 1

with open('src/lib/db/seed-data.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Recalibrated {replacements} farms in seed-data.ts!")

