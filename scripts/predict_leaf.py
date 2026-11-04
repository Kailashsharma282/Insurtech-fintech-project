import os
import sys
import json
import numpy as np
from PIL import Image

os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision.models import mobilenet_v3_small

CLASSES = [
    'good_healthy',
    'bad_dry_wilted',
    'bad_brown_spot',
    'bad_bacterial_blight',
    'bad_waterlogged',
    'bad_nutrient_deficient'
]

CLASS_DISPLAY = {
    'good_healthy': 'Healthy Leaf (Optimal Vigor)',
    'bad_dry_wilted': 'Dry / Wilted Leaf (Moisture Deficit)',
    'bad_brown_spot': 'Brown Spot (Bipolaris oryzae)',
    'bad_bacterial_blight': 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    'bad_waterlogged': 'Waterlogging Stress / Submergence',
    'bad_nutrient_deficient': 'Nutrient Deficiency (N/K Chlorosis)'
}

WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'leaf_mobilenetv3_weights.pth')
CALIB_JSON = os.path.join(os.path.dirname(__file__), '..', 'models', 'leaf_model_calibrated.json')

def load_model():
    model = mobilenet_v3_small(pretrained=False)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Linear(in_features, 64),
        nn.ReLU(),
        nn.Dropout(0.25),
        nn.Linear(64, len(CLASSES))
    )
    if os.path.exists(WEIGHTS_PATH):
        model.load_state_dict(torch.load(WEIGHTS_PATH, map_location='cpu'))
    model.eval()
    return model

def predict_image(image_path: str):
    if not os.path.exists(image_path):
        return {"error": f"Image file not found: {image_path}"}
        
    model = load_model()
    
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    with Image.open(image_path) as img:
        rgb_img = img.convert('RGB')
        tensor = transform(rgb_img).unsqueeze(0)
        
    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs, dim=1).squeeze().numpy()
        
    pred_idx = int(np.argmax(probs))
    pred_class = CLASSES[pred_idx]
    confidence = float(probs[pred_idx])
    
    # Load agronomic calibration
    with open(CALIB_JSON, 'r') as f:
        calib = json.load(f)
        
    agronomic = calib['agronomicMapping'].get(pred_class, {})
    
    result = {
        "imagePath": image_path,
        "predictedClass": pred_class,
        "displayName": CLASS_DISPLAY[pred_class],
        "confidence": round(confidence, 4),
        "isGoodLeaf": (pred_class == 'good_healthy'),
        "allClassProbabilities": {
            CLASSES[i]: round(float(probs[i]), 4) for i in range(len(CLASSES))
        },
        "agronomicDiagnosis": agronomic
    }
    return result

if __name__ == '__main__':
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
    else:
        img_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'samples', 'leaves', 'healthy_leaf_1.jpg')
    res = predict_image(img_path)
    print(json.dumps(res, indent=2))
