import cv2
import numpy as np
import json
import os

print("--- Step 1: Loading User Reference Images ---")
fapar_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529622_ef1c4434.jpg'
chf_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806531587_6c6bb90a.jpg'
ndvi_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806528123_2dfb0de0.jpg'
rain_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529595_86e7ebfa.jpg'
gdd_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529620_902403db.jpg'
vh_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793808749118_5659228d.jpg'
lswi_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793808749131_ba4cee6d.jpg'

fapar_img = cv2.imread(fapar_path)
print("FAPAR image shape:", fapar_img.shape)

# Neatline crop for 1024x791 images
# Top=27, Bottom=996, Left=27, Right=764 -> shape is (969, 737)
NEAT_Y1, NEAT_Y2 = 27, 996
NEAT_X1, NEAT_X2 = 27, 764
NEAT_H = NEAT_Y2 - NEAT_Y1 # 969
NEAT_W = NEAT_X2 - NEAT_X1 # 737

neat_fapar = fapar_img[NEAT_Y1:NEAT_Y2, NEAT_X1:NEAT_X2]

# Step 2: Extract the solid mask of the Ghatal Block using FAPAR and CHF
# In FAPAR, the boundary has a distinct red outline (or colored interior)
hsv = cv2.cvtColor(neat_fapar, cv2.COLOR_BGR2HSV)
m1 = cv2.inRange(hsv, np.array([0, 110, 110]), np.array([10, 255, 255]))
m2 = cv2.inRange(hsv, np.array([170, 110, 110]), np.array([180, 255, 255]))
red_line = m1 | m2
# Clear bottom-right legend box and top title
red_line[640:, 440:] = 0
red_line[:80, :150] = 0

# Connect any tiny gaps in the red line
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
red_connected = cv2.dilate(red_line, kernel, iterations=1)

# Color mask of the multi-spectral raster data inside the block:
# High saturation pixels (green, yellow, orange, red)
color_mask = (hsv[:, :, 1] > 38).astype(np.uint8) * 255
color_mask[640:, 440:] = 0
color_mask[:80, :150] = 0

# Combine the red outline with the interior colored pixels
combined_mask = cv2.bitwise_or(red_connected, color_mask)
# Morphological close to produce a perfectly solid single polygon with no holes
close_k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
solid_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, close_k)

# Fill holes inside the largest contour
contours, _ = cv2.findContours(solid_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
largest_contour = max(contours, key=cv2.contourArea)

final_block_mask = np.zeros((NEAT_H, NEAT_W), dtype=np.uint8)
cv2.drawContours(final_block_mask, [largest_contour], -1, 255, thickness=-1)

# Step 3: Extract boundary vertices with high fidelity (0.0012 perimeter epsilon)
peri = cv2.arcLength(largest_contour, True)
approx_poly = cv2.approxPolyDP(largest_contour, 0.0012 * peri, True)
print(f"Final Block Mask Area: {cv2.countNonZero(final_block_mask)} px, Polygon Vertices: {len(approx_poly)}")

# Convert polygon vertices to georeferenced coordinates [lat, lng]
# Geographic extents of the neatline:
# Lat: 22°47'30"N (22.7916667) to 22°32'30"N (22.5416667)
# Lng: 87°35'00"E (87.5833333) to 87°47'30"E (87.7916667)
LAT_TOP = 22.7916667
LAT_BOT = 22.5416667
LNG_LEFT = 87.5833333
LNG_RIGHT = 87.7916667

exact_latlng_boundary = []
for pt in approx_poly:
    px, py = pt[0]
    lat = LAT_TOP - (py / float(NEAT_H)) * (LAT_TOP - LAT_BOT)
    lng = LNG_LEFT + (px / float(NEAT_W)) * (LNG_RIGHT - LNG_LEFT)
    exact_latlng_boundary.append([round(float(lat), 6), round(float(lng), 6)])

print(f"Generated exact boundary with {len(exact_latlng_boundary)} points.")
print(f"Lat min/max: {min(p[0] for p in exact_latlng_boundary)} - {max(p[0] for p in exact_latlng_boundary)}")
print(f"Lng min/max: {min(p[1] for p in exact_latlng_boundary)} - {max(p[1] for p in exact_latlng_boundary)}")

# Step 4: Verify alignment by drawing the polygon directly on the masked layer
preview = neat_fapar.copy()
# Dim outside
preview[final_block_mask == 0] = preview[final_block_mask == 0] // 3
cv2.drawContours(preview, [largest_contour], -1, (0, 0, 255), 2)
cv2.imwrite('scripts/aligned_preview.png', preview)
print("Saved scripts/aligned_preview.png for visual verification.")

# Step 5: Save boundary JSON
with open('scripts/aligned_ghatal_boundary.json', 'w', encoding='utf-8') as f:
    json.dump(exact_latlng_boundary, f, indent=2)

print("Saved scripts/aligned_ghatal_boundary.json successfully.")
