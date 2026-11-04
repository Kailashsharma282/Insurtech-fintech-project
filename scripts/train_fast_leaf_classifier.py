import os
import glob
import json
import pickle
import cv2
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, accuracy_score

TRAIN_DIR = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'leaf_training')
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

CLASSES = [
    'good_healthy',
    'bad_dry_wilted',
    'bad_brown_spot',
    'bad_bacterial_blight',
    'bad_waterlogged',
    'bad_nutrient_deficient'
]

def extract_features(img):
    """
    Extracts 22 biophysical and colorimetric leaf features from BGR image:
    1. Mean R (normalized)
    2. Mean G (normalized)
    3. Mean B (normalized)
    4. Std R
    5. Std G
    6. Std B
    7. Excess Green Index (ExG = 2G - R - B)
    8. Excess Red Index (ExR = 1.4R - G)
    9. Normalized Green-Red Difference Index (NGRDI = (G - R) / (G + R + 1e-5))
    10. Green Leaf Index (GLI = (2G - R - B) / (2G + R + B + 1e-5))
    11. Visible Atmospherically Resistant Index (VARI = (G - R) / (G + R - B + 1e-5))
    12. Chlorophyll Dominance Ratio (G / (R + B + 1e-5))
    13. Brown Scorch / Necrosis Pixel Ratio
    14. Yellow Chlorosis Pixel Ratio
    15. Healthy Green Pixel Ratio
    16. HSV Mean Hue
    17. HSV Mean Saturation
    18. HSV Mean Value
    19. HSV Std Hue
    20. HSV Std Saturation
    21. Edge Laplacian Gradient Energy (texture/curling)
    22. Red-to-Green Ratio (R / (G + 1e-5))
    """
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r = img_rgb[:, :, 0]
    g = img_rgb[:, :, 1]
    b = img_rgb[:, :, 2]
    
    total = r + g + b + 1e-6
    rn = r / total
    gn = g / total
    bn = b / total
    
    # 1-6
    mean_r = float(np.mean(rn))
    mean_g = float(np.mean(gn))
    mean_b = float(np.mean(bn))
    std_r = float(np.std(rn))
    std_g = float(np.std(gn))
    std_b = float(np.std(bn))
    
    # 7-12 Biophysical Vegetation Indices
    exg = float(np.mean(2 * gn - rn - bn))
    exr = float(np.mean(1.4 * rn - gn))
    ngrdi = float(np.mean((gn - rn) / (gn + rn + 1e-6)))
    gli = float(np.mean((2 * gn - rn - bn) / (2 * gn + rn + bn + 1e-6)))
    vari = float(np.mean((gn - rn) / (gn + rn - bn + 1e-6)))
    chlo_ratio = float(np.mean(gn / (rn + bn + 1e-6)))
    
    # 13-15 Colorimetric Leaf Area Ratios
    # Brown scorch: high red, low green, low blue
    brown_mask = (r > 0.30) & (r > g * 1.1) & (b < 0.35)
    brown_ratio = float(np.mean(brown_mask))
    
    # Yellow chlorosis: high red, high green, low blue
    yellow_mask = (r > 0.35) & (g > 0.35) & (b < 0.28) & (np.abs(r - g) < 0.18)
    yellow_ratio = float(np.mean(yellow_mask))
    
    # Healthy green: high green, lower red and blue
    green_mask = (g > r * 1.15) & (g > b * 1.15) & (g > 0.25)
    green_ratio = float(np.mean(green_mask))
    
    # 16-20 HSV Features
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    h_channel = hsv[:, :, 0] / 180.0
    s_channel = hsv[:, :, 1] / 255.0
    v_channel = hsv[:, :, 2] / 255.0
    
    mean_h = float(np.mean(h_channel))
    mean_s = float(np.mean(s_channel))
    mean_v = float(np.mean(v_channel))
    std_h = float(np.std(h_channel))
    std_s = float(np.std(s_channel))
    
    # 21 Texture / Edge Gradient
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    edge_energy = float(np.var(laplacian) / 1000.0)
    
    # 22 Red to Green
    rg_ratio = float(np.mean(rn / (gn + 1e-6)))
    
    return [
        mean_r, mean_g, mean_b,
        std_r, std_g, std_b,
        exg, exr, ngrdi, gli, vari, chlo_ratio,
        brown_ratio, yellow_ratio, green_ratio,
        mean_h, mean_s, mean_v, std_h, std_s,
        edge_energy, rg_ratio
    ]

print("=== EXTRACTING BIOPHYSICAL FEATURES FROM TRAINING DATASET ===")
X = []
y = []
filenames = []

for idx, cls in enumerate(CLASSES):
    cls_folder = os.path.join(TRAIN_DIR, cls)
    files = glob.glob(os.path.join(cls_folder, '*.jpg'))
    print(f"Extracting features for class '{cls}': {len(files)} images...")
    for f in files:
        img = cv2.imread(f)
        if img is None:
            continue
        feats = extract_features(img)
        X.append(feats)
        y.append(idx)
        filenames.append(f)

X = np.array(X, dtype=np.float32)
y = np.array(y, dtype=np.int32)

print(f"Extracted feature matrix shape: {X.shape}")

# Train Random Forest Classifier with 100 estimators
rf = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, class_weight='balanced')

# 5-fold cross validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(rf, X, y, cv=skf, scoring='accuracy')
print(f"5-Fold Cross Validation Accuracy: {scores.mean() * 100:.2f}% (+/- {scores.std() * 100:.2f}%)")

# Fit on all training data
rf.fit(X, y)
train_acc = accuracy_score(y, rf.predict(X))
print(f"Training Accuracy on Augmented Dataset: {train_acc * 100:.2f}%")

# Save model pickle
model_pkl_path = os.path.join(MODELS_DIR, 'leaf_rf_model.pkl')
with open(model_pkl_path, 'wb') as f:
    pickle.dump({
        'model': rf,
        'classes': CLASSES,
        'feature_names': [
            'mean_r', 'mean_g', 'mean_b', 'std_r', 'std_g', 'std_b',
            'exg', 'exr', 'ngrdi', 'gli', 'vari', 'chlo_ratio',
            'brown_ratio', 'yellow_ratio', 'green_ratio',
            'mean_h', 'mean_s', 'mean_v', 'std_h', 'std_s',
            'edge_energy', 'rg_ratio'
        ]
    }, f)

print(f"Model saved to {model_pkl_path}!")
