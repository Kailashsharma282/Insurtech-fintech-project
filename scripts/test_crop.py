import cv2
import numpy as np

img = cv2.imread(r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793806531587_6c6bb90a.jpg')
crop = img[24:972, 46:744]
print(f"Map frame cropped size: {crop.shape[1]} x {crop.shape[0]}")
