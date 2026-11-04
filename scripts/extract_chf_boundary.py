import cv2
import numpy as np
import json

img_chf = cv2.imread(r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806531587_6c6bb90a.jpg')
map_crop = img_chf[24:972, 46:744]

# The block is colored with green, yellow, orange, red.
# Let's inspect HSV:
hsv = cv2.cvtColor(map_crop, cv2.COLOR_BGR2HSV)
sat = hsv[:, :, 1]
val = hsv[:, :, 2]

# The basemap has low saturation (< 30) or near white/grey.
# The block pixels have saturation >= 45 and value >= 50.
# The legend box is at x in [450..698], y in [700..948]. Let's mask that out.
block_mask = ((sat >= 40) & (val >= 40)).astype(np.uint8) * 255
block_mask[680:, 440:] = 0 # legend box
block_mask[:100, :150] = 0 # title / north arrow

# Close small holes
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
clean_mask = cv2.morphologyEx(block_mask, cv2.MORPH_CLOSE, kernel)

# Find external contours
contours, _ = cv2.findContours(clean_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
largest = max(contours, key=cv2.contourArea)

# Check approx with epsilon = 0.0015
epsilon = 0.0015 * cv2.arcLength(largest, True)
approx = cv2.approxPolyDP(largest, epsilon, True)
print(f"CHF Block Contour Area: {cv2.contourArea(largest)}, Vertices: {len(approx)}")

# Save preview on CHF image
preview = map_crop.copy()
cv2.drawContours(preview, [approx], -1, (0, 0, 255), 2)
cv2.imwrite('scripts/chf_boundary_preview.png', preview)

# Compute geo points
geo_polygon = []
for pt in approx:
    px = pt[0][0] + 46
    py = pt[0][1] + 24
    lat = 22.791667 - (py - 24) / (972 - 24) * (22.791667 - 22.541667)
    lng = 87.583333 + (px - 46) / (744 - 46) * (87.791667 - 87.583333)
    geo_polygon.append([round(float(lat), 6), round(float(lng), 6)])

with open('scripts/exact_ghatal_chf_boundary.json', 'w') as f:
    json.dump(geo_polygon, f, indent=2)

print(f"Saved {len(geo_polygon)} geo points to scripts/exact_ghatal_chf_boundary.json!")

