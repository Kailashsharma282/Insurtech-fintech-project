import os
import cv2
import numpy as np
import json
import glob

# Paths
SAMPLE_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'samples', 'leaves')
TRAIN_DIR = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'leaf_training')

CLASSES = [
    'good_healthy',
    'bad_dry_wilted',
    'bad_brown_spot',
    'bad_bacterial_blight',
    'bad_waterlogged',
    'bad_nutrient_deficient'
]

os.makedirs(TRAIN_DIR, exist_ok=True)
for c in CLASSES:
    os.makedirs(os.path.join(TRAIN_DIR, c), exist_ok=True)

# Map sample files to classes
class_file_patterns = {
    'good_healthy': 'healthy_leaf_*.jpg',
    'bad_dry_wilted': 'dry_wilted_leaf_*.jpg',
    'bad_brown_spot': 'brown_spot_leaf_*.jpg',
    'bad_bacterial_blight': 'bacterial_blight_leaf_*.jpg',
    'bad_waterlogged': 'waterlogged_leaf_*.jpg',
    'bad_nutrient_deficient': 'nutrient_deficient_leaf_*.jpg'
}

print("=== EXPANDING LEAF DATASET WITH AUGMENTATION ===")
total_samples = 0

for cls, pattern in class_file_patterns.items():
    files = glob.glob(os.path.join(SAMPLE_DIR, pattern))
    print(f"Class '{cls}': found {len(files)} source images.")
    cls_count = 0
    for fpath in files:
        img = cv2.imread(fpath)
        if img is None:
            continue
        base_name = os.path.splitext(os.path.basename(fpath))[0]
        
        # Original
        out_orig = os.path.join(TRAIN_DIR, cls, f"{base_name}_orig.jpg")
        cv2.imwrite(out_orig, img)
        cls_count += 1
        
        # Augmentations:
        # 1. Flip horizontal
        cv2.imwrite(os.path.join(TRAIN_DIR, cls, f"{base_name}_fliph.jpg"), cv2.flip(img, 1))
        cls_count += 1
        
        # 2. Flip vertical
        cv2.imwrite(os.path.join(TRAIN_DIR, cls, f"{base_name}_flipv.jpg"), cv2.flip(img, 0))
        cls_count += 1
        
        # 3. Rotate 90, 180, 270
        for rot_code, rot_name in [(cv2.ROTATE_90_CLOCKWISE, 'rot90'), 
                                   (cv2.ROTATE_180, 'rot180'), 
                                   (cv2.ROTATE_90_COUNTERCLOCKWISE, 'rot270')]:
            cv2.imwrite(os.path.join(TRAIN_DIR, cls, f"{base_name}_{rot_name}.jpg"), cv2.rotate(img, rot_code))
            cls_count += 1
            
        # 4. Brightness adjustment (+25, -25)
        for b_val, b_name in [(25, 'bright'), (-25, 'dark')]:
            b_img = np.clip(img.astype(np.int16) + b_val, 0, 255).astype(np.uint8)
            cv2.imwrite(os.path.join(TRAIN_DIR, cls, f"{base_name}_{b_name}.jpg"), b_img)
            cls_count += 1
            
        # 5. Mild Gaussian Blur
        blur_img = cv2.GaussianBlur(img, (3, 3), 0)
        cv2.imwrite(os.path.join(TRAIN_DIR, cls, f"{base_name}_blur.jpg"), blur_img)
        cls_count += 1
        
        # 6. Contrast adjustment
        contrast_img = np.clip(1.2 * img.astype(np.float32) - 15, 0, 255).astype(np.uint8)
        cv2.imwrite(os.path.join(TRAIN_DIR, cls, f"{base_name}_contrast.jpg"), contrast_img)
        cls_count += 1

    print(f"  Class '{cls}' augmented to {cls_count} authentic samples.")
    total_samples += cls_count

print(f"Total dataset size: {total_samples} training images across {len(CLASSES)} classes.")
