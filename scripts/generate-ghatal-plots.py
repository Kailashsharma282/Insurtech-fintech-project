import math
import json

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

# Test generating plots across Ghatal:
# 16 near river (within 100-500m of river vertices)
# 10 transition (650m-1100m)
# 14 upland (1300m-3200m)
plots = []
# Near river plots
near_river_offsets = [
    (0, 0.0012, -0.0010), (1, -0.0015, 0.0010), (2, 0.0010, 0.0015), (3, -0.0012, -0.0014),
    (3, 0.0018, 0.0010), (4, -0.0015, 0.0012), (4, 0.0014, -0.0015), (5, -0.0018, 0.0010),
    (5, 0.0012, -0.0012), (2, -0.0018, -0.0015), (1, 0.0016, -0.0012), (3, 0.0022, -0.0016),
    (4, 0.0025, 0.0015), (5, 0.0020, 0.0018), (0, -0.0020, 0.0015), (6, -0.0015, -0.0012)
]

for idx, (seg_i, d_lat, d_lng) in enumerate(near_river_offsets):
    lat = round(SILABATI_RIVER[seg_i][0] + d_lat, 4)
    lng = round(SILABATI_RIVER[seg_i][1] + d_lng, 4)
    dist = get_dist_to_river_m(lat, lng)
    # Near river: CHF strictly < 0.55 (0.33 to 0.49)
    chf = round(0.33 + (dist / 600.0) * 0.16, 2)
    chf = min(0.49, max(0.32, chf))
    plots.append({
        'plot': 205 + idx,
        'lat': lat,
        'lng': lng,
        'dist': dist,
        'chf': chf,
        'zone': 'SILABATI_FLOODPLAIN'
    })

print(f'Generated {len(plots)} near river plots. Min dist: {min(p["dist"] for p in plots)}m, Max dist: {max(p["dist"] for p in plots)}m')
print(f'CHF range: {min(p["chf"] for p in plots)} to {max(p["chf"] for p in plots)} (All < 0.55!)')
