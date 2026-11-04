import cv2
import numpy as np

img = cv2.imread(r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806529622_ef1c4434.jpg')
map_crop = img[24:972, 46:744]
hsv = cv2.cvtColor(map_crop, cv2.COLOR_BGR2HSV)

# Red mask
m1 = cv2.inRange(hsv, np.array([0, 120, 120]), np.array([10, 255, 255]))
m2 = cv2.inRange(hsv, np.array([170, 120, 120]), np.array([180, 255, 255]))
red_pixels = m1 | m2

# Clear legend area (bottom right) and title area (top)
red_pixels[680:, 440:] = 0
red_pixels[:120, :200] = 0
red_pixels[:60, 500:] = 0  # clear top right river artifact

# The red boundary forms a closed loop around the colored block.
# Let's fill the closed loop to get the solid mask of Ghatal Block!
# Flood fill from outside (0, 0)
h_crop, w_crop = red_pixels.shape
flood_filled = red_pixels.copy()
# Create mask for floodFill (must be 2 pixels wider and higher)
ff_mask = np.zeros((h_crop + 2, w_crop + 2), np.uint8)

# Connect any tiny 1-2px gaps in the red line with morphological dilation
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
red_connected = cv2.dilate(red_pixels, kernel, iterations=1)

# Now find the outer boundary of the colored area within the red loop
colored = (hsv[:, :, 1] > 35).astype(np.uint8) * 255
colored[680:, 440:] = 0
colored[:100, :200] = 0

# Intersect or combine with red boundary
combined = cv2.bitwise_or(colored, red_connected)
# Morphological close to ensure a single solid polygon
closed = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))

contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
largest = max(contours, key=cv2.contourArea)

# Approximate with 0.0015 of perimeter for fine detail without noise
approx = cv2.approxPolyDP(largest, 0.0015 * cv2.arcLength(largest, True), True)

print(f"FAPAR Ghatal Block Area: {cv2.contourArea(largest)}, Vertices: {len(approx)}")

preview = map_crop.copy()
cv2.drawContours(preview, [approx], -1, (255, 0, 0), 2) # Blue contour on preview
cv2.imwrite('scripts/fapar_boundary_preview.png', preview)
