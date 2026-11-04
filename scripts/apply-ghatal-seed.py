import math

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

# 39 Ghatal Companion plots
# (lat, lng, name, zone, chf, moist)
offsets = [
    # 16 Near River (< 500m, CHF 0.33 - 0.49 < 0.55 Triggered)
    (22.6705, 87.7225, "Ghatal Riverbend Basin", "SILABATI_FLOODPLAIN", 0.35, 92),
    (22.6718, 87.7252, "Silabati Bridge Lowland", "SILABATI_FLOODPLAIN", 0.33, 94),
    (22.6618, 87.7335, "Ranichak River Inflow", "SILABATI_FLOODPLAIN", 0.38, 88),
    (22.6595, 87.7368, "Ranichak Flood Plain #1", "SILABATI_FLOODPLAIN", 0.36, 91),
    (22.6520, 87.7455, "Radhanagar Char Lowland", "SILABATI_FLOODPLAIN", 0.41, 86),
    (22.6495, 87.7485, "Radhanagar River Bend", "SILABATI_FLOODPLAIN", 0.39, 89),
    (22.6815, 87.7125, "Ghatal North River Margin", "SILABATI_FLOODPLAIN", 0.42, 85),
    (22.6830, 87.7095, "Shilabati Embankment Low", "SILABATI_FLOODPLAIN", 0.37, 90),
    (22.6925, 87.6985, "Kharar River Bank Basin", "SILABATI_FLOODPLAIN", 0.44, 84),
    (22.6940, 87.6955, "Kharar West Flood Furrow", "SILABATI_FLOODPLAIN", 0.40, 87),
    (22.7040, 87.6835, "Upstream Ghatal Basin", "SILABATI_FLOODPLAIN", 0.38, 93),
    (22.6635, 87.7320, "Shilabati Silt Bed Plot", "SILABATI_FLOODPLAIN", 0.43, 85),
    (22.6540, 87.7430, "Radhanagar Flood Basin A", "SILABATI_FLOODPLAIN", 0.34, 93),
    (22.6405, 87.7590, "South-East River Confluence", "SILABATI_FLOODPLAIN", 0.45, 84),
    (22.6730, 87.7215, "Ghatal Municipality Low", "SILABATI_FLOODPLAIN", 0.46, 83),
    (22.6660, 87.7285, "Central Silabati Inundation", "SILABATI_FLOODPLAIN", 0.48, 82),

    # 10 Transition Zone (600m - 1100m, CHF 0.58 - 0.68)
    (22.6745, 87.7160, "Ghatal Central Sub-basin", "TRANSITION_ZONE", 0.61, 72),
    (22.6680, 87.7140, "Ghatal West Intermediate", "TRANSITION_ZONE", 0.64, 68),
    (22.6860, 87.7030, "Kharar Intermediate Buffer", "TRANSITION_ZONE", 0.59, 74),
    (22.6780, 87.7190, "North Central Transition", "TRANSITION_ZONE", 0.66, 67),
    (22.6560, 87.7420, "Ranichak East Buffer", "TRANSITION_ZONE", 0.62, 70),
    (22.6460, 87.7540, "Radhanagar High Buffer", "TRANSITION_ZONE", 0.65, 69),
    (22.6970, 87.6910, "Kharar North Slope", "TRANSITION_ZONE", 0.60, 73),
    (22.6640, 87.7420, "Ghatal East Transition", "TRANSITION_ZONE", 0.67, 66),
    (22.6580, 87.7280, "South Ghatal Mild Terrace", "TRANSITION_ZONE", 0.58, 75),
    (22.6710, 87.7330, "East Shilabati Mid-Zone", "TRANSITION_ZONE", 0.63, 71),

    # 13 Upland Plots (> 1200m, CHF 0.72 - 0.86 > 0.70 Healthy)
    (22.6840, 87.7360, "Kharar Elevated Ag-Belt", "ELEVATED_UPLAND", 0.78, 56),
    (22.6890, 87.7410, "Birsingha Highland Sector", "ELEVATED_UPLAND", 0.84, 54),
    (22.6920, 87.7480, "Birsingha Upland Plateau", "ELEVATED_UPLAND", 0.86, 52),
    (22.6750, 87.7480, "Dewanchak Elevated Ridge", "ELEVATED_UPLAND", 0.82, 55),
    (22.6720, 87.7520, "Dewanchak High Upland", "ELEVATED_UPLAND", 0.79, 58),
    (22.6610, 87.7550, "Radhanagar East Plateau", "ELEVATED_UPLAND", 0.76, 57),
    (22.6540, 87.7610, "South Upland Greenfield", "ELEVATED_UPLAND", 0.74, 60),
    (22.6650, 87.7050, "Ghatal West High Plain", "ELEVATED_UPLAND", 0.81, 56),
    (22.6720, 87.6980, "West Ghatal Loamy Ridge", "ELEVATED_UPLAND", 0.83, 53),
    (22.6810, 87.6920, "Kharar West Ridge", "ELEVATED_UPLAND", 0.75, 59),
    (22.6880, 87.6850, "North-West High Ag-Terrace", "ELEVATED_UPLAND", 0.77, 58),
    (22.6780, 87.7420, "Ghatal Greenfield Upland", "ELEVATED_UPLAND", 0.75, 57),
    (22.6680, 87.7490, "Central Upland Sector", "ELEVATED_UPLAND", 0.80, 55),
]

ts_code = """// Silabati River polyline across Ghatal Block (NW upstream to SE confluence)
export const SILABATI_RIVER_POINTS: [number, number][] = [
  [22.7050, 87.6820], // NW Upstream (Ghatal entry)
  [22.6930, 87.6970], // Kharar Edge
  [22.6820, 87.7110], // Ghatal North
  [22.6710, 87.7240], // Ghatal Central Riverbend
  [22.6610, 87.7350], // Ranichak Corridor
  [22.6510, 87.7470], // Radhanagar Basin
  [22.6380, 87.7610], // SE Confluence (Ghatal exit)
];

// Primary Demo Farm - Subhash Mondal (Plot #204 - Ghatal Elevated Ridge, Upland, CHF 0.78)
export const PRIMARY_DEMO_FARM: Farm = {
  id: 'farm-plot-204',
  farmerId: 'farmer-1',
  farmerName: 'Subhash Mondal',
  insuranceUnitId: 'iu-nadia-01',
  insuranceUnitCode: 'WB-GHT-001',
  plotNumber: 'Plot #204',
  name: 'Plot #204 - Ghatal Elevated Ridge',
  district: 'Paschim Medinipur',
  village: 'Ghatal',
  gramPanchayat: 'Ghatal Central',
  acreage: 2.8,
  currentCrop: 'Aman Paddy',
  season: 'Kharif 2026',
  sowingDate: '2026-06-12',
  expectedHarvest: '2026-11-20',
  currentChf: 0.78,
  chfBaseline: 0.76,
  soilMoisturePct: 56.0,
  riskLevel: 'LOW',
  centroid: { lat: 22.6840, lng: 87.7360 },
  boundaryCoordinates: [
    [87.7345, 22.6825], [87.7375, 22.6828], [87.7370, 22.6855], [87.7340, 22.6852], [87.7345, 22.6825]
  ],
  activePolicyId: 'pol-nadia-204',
  sumInsured: 145000,
  lastSatelliteDate: '2026-09-14',
  ndvi: 0.74,
  lswi: 0.42,
  vhBackscatterDb: -15.8,
  distanceToRiverMeters: 1650,
  hydrologicalZone: 'ELEVATED_UPLAND'
};

// 40 Farms across Ghatal Block (Silabati Floodplain, Transition Zone & Elevated Upland)
// Near river (< 500m): Low CHF (< 0.55), Claim Triggered
// Transition (600m - 1100m): Moderate CHF (0.58 - 0.68)
// Away from river (> 1200m): High CHF (> 0.70), Optimal Crop Vigor
export const SEED_FARMS: Farm[] = [
  PRIMARY_DEMO_FARM,
"""

for i, (lat, lng, name, zone, chf, moist) in enumerate(offsets):
    plot_num = 205 + i
    dist = get_dist_to_river_m(lat, lng)
    risk = "CLAIM_TRIGGERED" if chf < 0.55 else ("HIGH" if chf < 0.62 else ("MODERATE" if chf < 0.70 else "LOW"))
    ndvi = round(chf * 0.94, 2)
    lswi = round(chf * 0.52, 2)
    vh = round(-21 + chf * 7, 1)
    crop = "Aman Paddy" if i % 3 == 0 else ("Potato" if i % 3 == 1 else "Jute")
    farmer_idx = (i + 1) % 25
    acreage = round(1.2 + (i * 0.31) % 3.6, 1)
    sum_insured = round(95000 + i * 4200)

    # Small 4-vertex polygon ~150m across
    dlat = 0.0012
    dlng = 0.0014
    b_coords = f"[[{round(lng-dlng, 4)}, {round(lat-dlat, 4)}], [{round(lng+dlng, 4)}, {round(lat-dlat, 4)}], [{round(lng+dlng, 4)}, {round(lat+dlat, 4)}], [{round(lng-dlng, 4)}, {round(lat+dlat, 4)}], [{round(lng-dlng, 4)}, {round(lat-dlat, 4)}]]"

    ts_code += f"""  {{
    id: 'farm-plot-{plot_num}',
    farmerId: 'farmer-{farmer_idx + 1}',
    farmerName: SEED_FARMERS[{farmer_idx}].name,
    insuranceUnitId: 'iu-nadia-01',
    insuranceUnitCode: 'WB-GHT-001',
    plotNumber: 'Plot #{plot_num}',
    name: 'Plot #{plot_num} - {name}',
    district: 'Paschim Medinipur',
    village: 'Ghatal Block',
    gramPanchayat: 'Ghatal Central',
    acreage: {acreage},
    currentCrop: '{crop}',
    season: 'Kharif 2026',
    sowingDate: '2026-06-18',
    expectedHarvest: '2026-11-25',
    currentChf: {chf},
    chfBaseline: 0.76,
    soilMoisturePct: {moist},
    riskLevel: '{risk}',
    centroid: {{ lat: {lat}, lng: {lng} }},
    boundaryCoordinates: {b_coords},
    activePolicyId: 'pol-{plot_num}',
    sumInsured: {sum_insured},
    lastSatelliteDate: '2026-09-14',
    ndvi: {ndvi},
    lswi: {lswi},
    vhBackscatterDb: {vh},
    distanceToRiverMeters: {dist},
    hydrologicalZone: '{zone}'
  }},\n"""

ts_code += "];\n"

# Now read src/lib/db/seed-data.ts, replace PRIMARY_DEMO_FARM and SEED_FARMS
with open('src/lib/db/seed-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r'export const PRIMARY_DEMO_FARM: Farm = \{[\s\S]*?export const SEED_FARMS: Farm\[\] = \[[\s\S]*?\];'
if re.search(pattern, content):
    new_content = re.sub(pattern, ts_code.strip(), content)
    with open('src/lib/db/seed-data.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced PRIMARY_DEMO_FARM and SEED_FARMS in src/lib/db/seed-data.ts!")
else:
    print("Pattern match failed! Let's check regex.")

