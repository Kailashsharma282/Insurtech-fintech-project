import os
import sys
import json
import pickle
import cv2
import numpy as np

# Load trained Random Forest model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'leaf_rf_model.pkl')

with open(MODEL_PATH, 'rb') as f:
    bundle = pickle.load(f)
    model = bundle['model']
    CLASSES = bundle['classes']

def extract_features(img):
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r = img_rgb[:, :, 0]
    g = img_rgb[:, :, 1]
    b = img_rgb[:, :, 2]
    
    total = r + g + b + 1e-6
    rn = r / total
    gn = g / total
    bn = b / total
    
    mean_r = float(np.mean(rn))
    mean_g = float(np.mean(gn))
    mean_b = float(np.mean(bn))
    std_r = float(np.std(rn))
    std_g = float(np.std(gn))
    std_b = float(np.std(bn))
    
    exg = float(np.mean(2 * gn - rn - bn))
    exr = float(np.mean(1.4 * rn - gn))
    ngrdi = float(np.mean((gn - rn) / (gn + rn + 1e-6)))
    gli = float(np.mean((2 * gn - rn - bn) / (2 * gn + rn + bn + 1e-6)))
    vari = float(np.mean((gn - rn) / (gn + rn - bn + 1e-6)))
    chlo_ratio = float(np.mean(gn / (rn + bn + 1e-6)))
    
    brown_mask = (r > 0.30) & (r > g * 1.1) & (b < 0.35)
    brown_ratio = float(np.mean(brown_mask))
    
    yellow_mask = (r > 0.35) & (g > 0.35) & (b < 0.28) & (np.abs(r - g) < 0.18)
    yellow_ratio = float(np.mean(yellow_mask))
    
    green_mask = (g > r * 1.15) & (g > b * 1.15) & (g > 0.25)
    green_ratio = float(np.mean(green_mask))
    
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    h_channel = hsv[:, :, 0] / 180.0
    s_channel = hsv[:, :, 1] / 255.0
    v_channel = hsv[:, :, 2] / 255.0
    
    mean_h = float(np.mean(h_channel))
    mean_s = float(np.mean(s_channel))
    mean_v = float(np.mean(v_channel))
    std_h = float(np.std(h_channel))
    std_s = float(np.std(s_channel))
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    edge_energy = float(np.var(laplacian) / 1000.0)
    
    rg_ratio = float(np.mean(rn / (gn + 1e-6)))
    
    return [
        mean_r, mean_g, mean_b,
        std_r, std_g, std_b,
        exg, exr, ngrdi, gli, vari, chlo_ratio,
        brown_ratio, yellow_ratio, green_ratio,
        mean_h, mean_s, mean_v, std_h, std_s,
        edge_energy, rg_ratio
    ]

def predict_leaf(image_path: str):
    if not os.path.exists(image_path):
        return {"error": f"File not found: {image_path}"}
        
    img = cv2.imread(image_path)
    if img is None:
        return {"error": f"Failed to decode image: {image_path}"}
        
    feats = extract_features(img)
    X = np.array([feats], dtype=np.float32)
    
    probs = model.predict_proba(X)[0]
    pred_idx = int(np.argmax(probs))
    pred_class = CLASSES[pred_idx]
    confidence = float(probs[pred_idx])
    
    # Specific biophysical indicators
    exg = feats[6]
    exr = feats[7]
    brown_ratio = feats[12]
    yellow_ratio = feats[13]
    green_ratio = feats[14]
    
    result = {
        "predictedClass": pred_class,
        "confidence": round(confidence, 4),
        "isGoodLeaf": (pred_class == 'good_healthy'),
        "biophysicalMetrics": {
            "excessGreenIndex": round(exg, 3),
            "excessRedScorch": round(exr, 3),
            "chlorophyllDominancePct": round(green_ratio * 100, 1),
            "necrosisPct": round(brown_ratio * 100, 1)
        },
        "allClassProbabilities": {
            CLASSES[i]: round(float(probs[i]), 4) for i in range(len(CLASSES))
        }
    }
    return result

if __name__ == '__main__':
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
    else:
        img_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'samples', 'leaves', 'dry_wilted_leaf_1.jpg')
    res = predict_leaf(img_path)
    print(json.dumps(res, indent=2))
