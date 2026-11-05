import cv2
import numpy as np
import os
import math

print("=== Generating Ghatal Risk Tiers Raster Overlay ===")

NEAT_H = 969
NEAT_W = 737

LAT_TOP = 22.7916667
LAT_BOT = 22.5416667
LNG_LEFT = 87.5833333
LNG_RIGHT = 87.7916667

# Load master mask from CHF overlay alpha channel
chf_path = 'public/images/earth-engine/layers/chf_overlay.png'
chf = cv2.imread(chf_path, cv2.IMREAD_UNCHANGED)
if chf is None:
    raise FileNotFoundError("Could not load CHF overlay")

master_mask = chf[:, :, 3]

# Silabati River polyline
RIVER = [
    [22.7050, 87.6820],
    [22.6930, 87.6970],
    [22.6820, 87.7110],
    [22.6710, 87.7240],
    [22.6610, 87.7350],
    [22.6510, 87.7470],
    [22.6380, 87.7610],
]

# Convert River to metric coordinates approx (lat * 111000, lng * 102400)
river_xy = [(pt[1] * 102400.0, pt[0] * 111000.0) for pt in RIVER]

def point_to_segment_dist(px, py, x1, y1, x2, y2):
    dx = x2 - x1
    dy = y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(px - x1, py - y1)
    t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
    proj_x = x1 + t * dx
    proj_y = y1 + t * dy
    return math.hypot(px - proj_x, py - proj_y)

# Create BGRA image
risk_bgra = np.zeros((NEAT_H, NEAT_W, 4), dtype=np.uint8)

# Color definitions in BGR
COLOR_RED = np.array([38, 38, 220], dtype=np.float32)       # #DC2626 Claim Triggered
COLOR_AMBER = np.array([11, 158, 245], dtype=np.float32)    # #F59E0B Elevated Alert
COLOR_GREEN = np.array([105, 150, 5], dtype=np.float32)     # #059669 Normal Vigilance

for py in range(NEAT_H):
    lat = LAT_TOP - (py / float(NEAT_H)) * (LAT_TOP - LAT_BOT)
    my = lat * 111000.0
    for px in range(NEAT_W):
        if master_mask[py, px] == 0:
            continue
        
        lng = LNG_LEFT + (px / float(NEAT_W)) * (LNG_RIGHT - LNG_LEFT)
        mx = lng * 102400.0
        
        # Calculate distance to river
        min_d = 1e9
        for i in range(len(river_xy) - 1):
            d = point_to_segment_dist(mx, my, river_xy[i][0], river_xy[i][1], river_xy[i+1][0], river_xy[i+1][1])
            if d < min_d:
                min_d = d
                
        # Risk interpolation:
        # < 600m: Red
        # 600m - 800m: Red to Amber transition
        # 800m - 1200m: Amber
        # 1200m - 1500m: Amber to Green transition
        # > 1500m: Green
        if min_d < 600.0:
            color = COLOR_RED
        elif min_d < 800.0:
            factor = (min_d - 600.0) / 200.0
            color = (1.0 - factor) * COLOR_RED + factor * COLOR_AMBER
        elif min_d < 1200.0:
            color = COLOR_AMBER
        elif min_d < 1500.0:
            factor = (min_d - 1200.0) / 300.0
            color = (1.0 - factor) * COLOR_AMBER + factor * COLOR_GREEN
        else:
            color = COLOR_GREEN
            
        risk_bgra[py, px, 0] = int(round(color[0]))
        risk_bgra[py, px, 1] = int(round(color[1]))
        risk_bgra[py, px, 2] = int(round(color[2]))
        risk_bgra[py, px, 3] = master_mask[py, px]

out_path = 'public/images/earth-engine/layers/risk_overlay.png'
cv2.imwrite(out_path, risk_bgra)
print(f"Successfully generated {out_path} ({os.path.getsize(out_path)} bytes)")
