import cv2
import numpy as np

img_path = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806531587_6c6bb90a.jpg'
img = cv2.imread(img_path)
h, w, _ = img.shape
print(f"Image dimensions: {w}x{h}")

# The map frame is a black outer border rectangle. Let's find it!
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# Find vertical and horizontal lines of the map frame
edges = cv2.Canny(gray, 50, 150)
contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

rects = []
for c in contours:
    approx = cv2.approxPolyDP(c, 0.01 * cv2.arcLength(c, True), True)
    if len(approx) == 4:
        x, y, rw, rh = cv2.boundingRect(approx)
        if rw > w * 0.7 and rh > h * 0.7:
            rects.append((x, y, rw, rh, cv2.contourArea(c)))

rects.sort(key=lambda r: r[4], reverse=True)
print("Detected map frame candidates:")
for r in rects[:3]:
    print(f"  Frame at x={r[0]}, y={r[1]}, w={r[2]}, h={r[3]}")
