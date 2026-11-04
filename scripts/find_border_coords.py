import cv2
import numpy as np

img = cv2.imread(r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806531587_6c6bb90a.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
h, w = gray.shape

# The map frame is a 2-4px solid black border rectangle
# Let's find rows with long dark segments and cols with long dark segments
# Top border is around y in [15..60]
# Bottom border is around y in [h-60..h-15]
# Left border is around x in [15..60]
# Right border is around x in [w-60..w-15]

for y in range(10, 100):
    row = gray[y, :]
    black_count = np.sum(row < 50)
    if black_count > w * 0.7:
        print(f"Top border found at y={y}, black_count={black_count}")
        break

for y in range(h-10, h-100, -1):
    row = gray[y, :]
    black_count = np.sum(row < 50)
    if black_count > w * 0.7:
        print(f"Bottom border found at y={y}, black_count={black_count}")
        break

for x in range(10, 100):
    col = gray[:, x]
    black_count = np.sum(col < 50)
    if black_count > h * 0.7:
        print(f"Left border found at x={x}, black_count={black_count}")
        break

for x in range(w-10, w-100, -1):
    col = gray[:, x]
    black_count = np.sum(col < 50)
    if black_count > h * 0.7:
        print(f"Right border found at x={x}, black_count={black_count}")
        break
