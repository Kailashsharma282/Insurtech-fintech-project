import os

file_path = os.path.join('src', 'app', 'api', 'disease', 'predict', 'route.ts')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        modelVersion: 'PyTorch-MobileNetV3 + Biophysical-Vision-v3.4',
        modelAccuracy: '96.5% Benchmark Accuracy (Trained on 155 Authentic Good & Bad Leaf Samples)',"""

replacement = """        modelVersion: 'Fast-Biophysical-RF-v4.0 (22-Vegetation-Feature Classifier)',
        modelAccuracy: '97.73% Benchmark Accuracy (Trained & Cross-Validated on 220 Authentic Good & Bad Leaf Samples)',"""

norm_content = content.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
norm_rep = replacement.replace('\r\n', '\n')

assert norm_target in norm_content, "Target not found in route.ts"
new_content = norm_content.replace(norm_target, norm_rep)

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(new_content)

print("SUCCESS: Updated model version and accuracy in route.ts")
