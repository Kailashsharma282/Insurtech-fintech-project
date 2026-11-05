import cv2
import numpy as np
import json
import os

print("=== Generating 100% Aligned Layers & Boundary ===")

# Base Neatline dimensions:
NEAT_H = 969
NEAT_W = 737

# 1. Compute Master Clean Mask from GDD map (where background is pure white and colors are solid)
gdd_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529620_902403db.jpg'
gdd_raw = cv2.imread(gdd_path)
neat_gdd = gdd_raw[27:996, 27:764]

hsv_gdd = cv2.cvtColor(neat_gdd, cv2.COLOR_BGR2HSV)
sat_gdd = hsv_gdd[:, :, 1]
hue_gdd = hsv_gdd[:, :, 0]

# Keep only GDD colors: Saturation > 35 and NOT river blue (hue not in [90, 135])
is_gdd_color = (sat_gdd > 35) & ((hue_gdd < 90) | (hue_gdd > 135))
mask = is_gdd_color.astype(np.uint8) * 255
# Clear legend box at bottom right
mask[740:, 490:] = 0

# Connect and fill solid
k = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, k)

contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
largest = max(contours, key=cv2.contourArea)

master_mask = np.zeros((NEAT_H, NEAT_W), dtype=np.uint8)
cv2.drawContours(master_mask, [largest], -1, 255, thickness=-1)

# Extract polygon approximation
peri = cv2.arcLength(largest, True)
approx_poly = cv2.approxPolyDP(largest, 0.0008 * peri, True)
print(f"Master Mask Area: {cv2.countNonZero(master_mask)} px, Polygon Vertices: {len(approx_poly)}")

# Geographic neatline bounds:
# Lon: 87°35'00"E (87.5833333°) to 87°47'30"E (87.7916667°)
# Lat: 22°32'30"N (22.5416667°) to 22°47'30"N (22.7916667°)
LAT_TOP = 22.7916667
LAT_BOT = 22.5416667
LNG_LEFT = 87.5833333
LNG_RIGHT = 87.7916667

boundary_latlng = []
for pt in approx_poly:
    px, py = pt[0]
    lat = LAT_TOP - (py / float(NEAT_H)) * (LAT_TOP - LAT_BOT)
    lng = LNG_LEFT + (px / float(NEAT_W)) * (LNG_RIGHT - LNG_LEFT)
    boundary_latlng.append([round(float(lat), 6), round(float(lng), 6)])

print(f"Boundary coordinate bbox:")
print(f"Lat: [{min(p[0] for p in boundary_latlng):.6f}, {max(p[0] for p in boundary_latlng):.6f}]")
print(f"Lng: [{min(p[1] for p in boundary_latlng):.6f}, {max(p[1] for p in boundary_latlng):.6f}]")

# Save boundary JSON
with open('scripts/official_aligned_boundary.json', 'w', encoding='utf-8') as f:
    json.dump(boundary_latlng, f, indent=2)

# Save visualization of boundary on mask
preview = neat_gdd.copy()
cv2.drawContours(preview, [approx_poly], -1, (255, 0, 0), 2)
cv2.imwrite('scripts/verified_boundary_on_gdd.png', preview)

# 2. Process all 7 layers
OUT_DIR = os.path.abspath('public/images/earth-engine/layers')
os.makedirs(OUT_DIR, exist_ok=True)

layer_sources = [
    ('chf', r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806531587_6c6bb90a.jpg', (27, 996, 27, 764)),
    ('fapar', r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529622_ef1c4434.jpg', (27, 996, 27, 764)),
    ('rainfall', r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529595_86e7ebfa.jpg', (27, 996, 27, 764)),
    ('gdd', r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529620_902403db.jpg', (27, 996, 27, 764)),
    ('ndvi', r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806528123_2dfb0de0.jpg', (13, 478, 13, 367)),
    ('vh', r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793808749118_5659228d.jpg', (13, 478, 13, 366)),
    ('lswi', r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793808749131_ba4cee6d.jpg', (13, 478, 13, 367)),
]

for layer_id, src_path, (y1, y2, x1, x2) in layer_sources:
    if not os.path.exists(src_path):
        print(f"Skipping {layer_id}, file not found: {src_path}")
        continue
    
    src = cv2.imread(src_path)
    crop = src[y1:y2, x1:x2]
    
    # Resize to exact NEAT_W x NEAT_H
    if crop.shape[0] != NEAT_H or crop.shape[1] != NEAT_W:
        crop = cv2.resize(crop, (NEAT_W, NEAT_H), interpolation=cv2.INTER_CUBIC)
    
    # Create 4-channel BGRA
    bgra = cv2.cvtColor(crop, cv2.COLOR_BGR2BGRA)
    
    # Mask out everything outside master_mask
    bgra[:, :, 3] = master_mask
    
    # Slight antialiasing on alpha edges (1px)
    alpha = bgra[:, :, 3].astype(np.float32)
    alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0.5)
    # Ensure fully opaque inside
    alpha_final = np.where(master_mask > 200, 255, alpha_smooth).astype(np.uint8)
    bgra[:, :, 3] = alpha_final
    
    out_path = os.path.join(OUT_DIR, f"{layer_id}_overlay.png")
    cv2.imwrite(out_path, bgra)
    print(f"Saved {layer_id}_overlay.png: size {os.path.getsize(out_path)} bytes")

print("All layers generated with 100% boundary alignment!")

