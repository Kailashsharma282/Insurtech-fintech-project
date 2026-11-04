import cv2
import numpy as np
import json

img_fapar = cv2.imread(r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529622_ef1c4434.jpg')
img_chf = cv2.imread(r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806531587_6c6bb90a.jpg')

# Frame boundaries in pixel space:
# Left = 46, Right = 744, Top = 24, Bottom = 972
# Lat: 22.791667 to 22.541667
# Lon: 87.583333 to 87.791667

# In FAPAR, the red outline around Ghatal Block is red (high R, lower G, lower B)
# Let's find pixels where R > 150 and G < 60 and B < 60 inside the map frame
map_crop = img_fapar[24:972, 46:744]
hsv = cv2.cvtColor(map_crop, cv2.COLOR_BGR2HSV)

# Red in HSV has hue near 0/180
mask1 = cv2.inRange(hsv, np.array([0, 100, 100]), np.array([10, 255, 255]))
mask2 = cv2.inRange(hsv, np.array([170, 100, 100]), np.array([180, 255, 255]))
red_mask = mask1 | mask2

# The legend in the bottom right also has red, so let's zero out the legend area (bottom right x > 450, y > 700)
red_mask[700:, 450:] = 0

print("Red outline pixels count:", np.sum(red_mask > 0))

# Alternatively, inside the block, the saturation is much higher than outside the block
# Outside the block, saturation is < 30 (light grey/beige basemap)
# Inside the block, saturation is > 40
sat_mask = (hsv[:, :, 1] > 35).astype(np.uint8) * 255
sat_mask[700:, 450:] = 0 # zero out legend
sat_mask[:100, :150] = 0 # zero out top text / north arrow

# Morphological close to fill interior holes
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
closed_mask = cv2.morphologyEx(sat_mask, cv2.MORPH_CLOSE, kernel)

# Find largest contour in closed_mask
contours, _ = cv2.findContours(closed_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if contours:
    largest = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest)
    print(f"Largest contour area: {area}")
    
    # Simplify contour with approxPolyDP for a clean, smooth, accurate boundary
    epsilon = 0.002 * cv2.arcLength(largest, True)
    approx = cv2.approxPolyDP(largest, epsilon, True)
    print(f"Approximated polygon vertices: {len(approx)}")
    
    # Convert from crop coordinates to map frame coordinates then to geo coordinates
    # map_crop: x_offset = 46, y_offset = 24
    # width = 744 - 46 = 698
    # height = 972 - 24 = 948
    # Lat: 22.791667 (top) to 22.541667 (bottom)
    # Lng: 87.583333 (left) to 87.791667 (right)
    
    geo_polygon = []
    for pt in approx:
        px = pt[0][0] + 46
        py = pt[0][1] + 24
        
        # Geo conversion
        lat = 22.791667 - (py - 24) / (972 - 24) * (22.791667 - 22.541667)
        lng = 87.583333 + (px - 46) / (744 - 46) * (87.791667 - 87.583333)
        geo_polygon.append([round(lat, 6), round(lng, 6)])
        
    print("Sample geo points:")
    for pt in geo_polygon[:5]:
        print(f"  {pt}")
    print(f"Total points: {len(geo_polygon)}")
    
    # Save preview image showing extracted boundary overlaid on the original image
    preview = map_crop.copy()
    cv2.drawContours(preview, [approx], -1, (0, 0, 255), 2)
    cv2.imwrite('scripts/extracted_boundary_preview.png', preview)
    
    # Also save json of polygon
    with open('scripts/exact_ghatal_boundary.json', 'w') as f:
        json.dump(geo_polygon, f, indent=2)
    print("Saved exact_ghatal_boundary.json and preview!")
