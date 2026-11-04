import json
import numpy as np

with open('scripts/exact_ghatal_chf_boundary.json', 'r') as f:
    pts = json.load(f)

print(f"Number of points: {len(pts)}")
lats = [p[0] for p in pts]
lngs = [p[1] for p in pts]

print(f"Lat min: {min(lats):.6f}, max: {max(lats):.6f}")
print(f"Lng min: {min(lngs):.6f}, max: {max(lngs):.6f}")

# Check centroid
centroid = [np.mean(lats), np.mean(lngs)]
print(f"Centroid: {centroid[0]:.6f}, {centroid[1]:.6f}")
