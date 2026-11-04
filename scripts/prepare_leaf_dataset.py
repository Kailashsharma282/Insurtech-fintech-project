import os
import urllib.request
import re
from PIL import Image

DATASET_DIR = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'leaves')
SAMPLES_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'samples', 'leaves')

os.makedirs(os.path.join(DATASET_DIR, 'good_healthy'), exist_ok=True)
os.makedirs(os.path.join(DATASET_DIR, 'bad_dry_wilted'), exist_ok=True)
os.makedirs(os.path.join(DATASET_DIR, 'bad_brown_spot'), exist_ok=True)
os.makedirs(os.path.join(DATASET_DIR, 'bad_bacterial_blight'), exist_ok=True)
os.makedirs(os.path.join(DATASET_DIR, 'bad_waterlogged'), exist_ok=True)
os.makedirs(os.path.join(DATASET_DIR, 'bad_nutrient_deficient'), exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

HEADERS = {'User-Agent': 'Mozilla/5.0'}

def get_files_from_github_tree(tree_url):
    try:
        req = urllib.request.Request(tree_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=12) as r:
            html = r.read().decode('utf-8', errors='ignore')
            files = re.findall(r'href="[^"]+/blob/master/([^"]+\.(?:jpg|JPG|jpeg|png))"', html)
            # Deduplicate preserving order
            seen = set()
            dedup = []
            for f in files:
                if f not in seen:
                    seen.add(f)
                    dedup.append(f)
            return dedup
    except Exception as e:
        print(f"Error fetching tree {tree_url}: {e}")
        return []

def download_image(raw_url, out_path, target_size=(256, 256)):
    try:
        req = urllib.request.Request(raw_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=12) as r:
            data = r.read()
            with open(out_path, 'wb') as f:
                f.write(data)
        # Validate and standardize image
        with Image.open(out_path) as im:
            rgb_im = im.convert('RGB')
            if target_size:
                rgb_im = rgb_im.resize(target_size, Image.Resampling.LANCZOS)
            rgb_im.save(out_path, 'JPEG', quality=90)
        return True
    except Exception as e:
        if os.path.exists(out_path):
            try: os.remove(out_path)
            except: pass
        print(f"Failed download {raw_url}: {e}")
        return False

print("=== 1. PREPARING AUTHENTIC LEAF DATASET ===")

# 1. GOOD / HEALTHY LEAVES (PlantVillage Potato, Corn, Tomato Healthy)
print("Downloading Good / Healthy leaves...")
healthy_sources = [
    'https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color/Potato___healthy',
    'https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color/Corn_(maize)___healthy',
    'https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color/Tomato___healthy'
]

h_count = 0
for src in healthy_sources:
    flist = get_files_from_github_tree(src)
    for frel in flist[:12]:
        raw_url = f"https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/{frel}"
        fname = f"healthy_{h_count+1:03d}.jpg"
        out = os.path.join(DATASET_DIR, 'good_healthy', fname)
        if download_image(raw_url, out):
            h_count += 1
            if h_count <= 4:
                # Also save to public showcase samples
                showcase_out = os.path.join(SAMPLES_DIR, f"healthy_leaf_{h_count}.jpg")
                download_image(raw_url, showcase_out)
print(f"  -> Total Healthy leaves collected: {h_count}")

# 2. BAD: DRY / WILTED / LEAF SCORCH (Strawberry Leaf Scorch & Moisture Deficit)
print("Downloading Bad: Dry / Wilted leaves...")
scorch_src = 'https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color/Strawberry___Leaf_scorch'
dry_files = get_files_from_github_tree(scorch_src)
dry_count = 0
for frel in dry_files[:25]:
    raw_url = f"https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/{frel}"
    fname = f"dry_wilted_{dry_count+1:03d}.jpg"
    out = os.path.join(DATASET_DIR, 'bad_dry_wilted', fname)
    if download_image(raw_url, out):
        dry_count += 1
        if dry_count <= 4:
            showcase_out = os.path.join(SAMPLES_DIR, f"dry_wilted_leaf_{dry_count}.jpg")
            download_image(raw_url, showcase_out)
print(f"  -> Total Dry/Wilted leaves collected: {dry_count}")

# 3. BAD: BROWN SPOT (Rice Disease Dataset)
print("Downloading Bad: Brown Spot leaves...")
bs_names = [f"DSC_{n:04d}.jpg" for n in range(100, 140)] + [f"DSC_{n:04d}.JPG" for n in range(100, 140)]
bs_count = 0
for name in bs_names:
    raw_url = f"https://raw.githubusercontent.com/MHassaanButt/Rice-Disease-Classfication/master/Dataset/Brown%20spot/{name}"
    fname = f"brown_spot_{bs_count+1:03d}.jpg"
    out = os.path.join(DATASET_DIR, 'bad_brown_spot', fname)
    if download_image(raw_url, out):
        bs_count += 1
        if bs_count <= 4:
            showcase_out = os.path.join(SAMPLES_DIR, f"brown_spot_leaf_{bs_count}.jpg")
            download_image(raw_url, showcase_out)
        if bs_count >= 25:
            break
print(f"  -> Total Brown Spot leaves collected: {bs_count}")

# 4. BAD: BACTERIAL LEAF BLIGHT (Rice Disease Dataset)
print("Downloading Bad: Bacterial Leaf Blight leaves...")
bb_names = [f"DSC_{n:04d}.JPG" for n in range(365, 410)] + [f"DSC_{n:04d}.jpg" for n in range(365, 410)]
bb_count = 0
for name in bb_names:
    raw_url = f"https://raw.githubusercontent.com/MHassaanButt/Rice-Disease-Classfication/master/Dataset/Bacterial%20leaf%20blight/{name}"
    fname = f"bacterial_blight_{bb_count+1:03d}.jpg"
    out = os.path.join(DATASET_DIR, 'bad_bacterial_blight', fname)
    if download_image(raw_url, out):
        bb_count += 1
        if bb_count <= 4:
            showcase_out = os.path.join(SAMPLES_DIR, f"bacterial_blight_leaf_{bb_count}.jpg")
            download_image(raw_url, showcase_out)
        if bb_count >= 25:
            break
print(f"  -> Total Bacterial Blight leaves collected: {bb_count}")

# 5. BAD: WATERLOGGED / EARLY BLIGHT ROT (Potato Early/Late Blight)
print("Downloading Bad: Waterlogged & Blight Rot leaves...")
wl_src = 'https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color/Potato___Early_blight'
wl_files = get_files_from_github_tree(wl_src)
wl_count = 0
for frel in wl_files[:25]:
    raw_url = f"https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/{frel}"
    fname = f"waterlogged_{wl_count+1:03d}.jpg"
    out = os.path.join(DATASET_DIR, 'bad_waterlogged', fname)
    if download_image(raw_url, out):
        wl_count += 1
        if wl_count <= 3:
            showcase_out = os.path.join(SAMPLES_DIR, f"waterlogged_leaf_{wl_count}.jpg")
            download_image(raw_url, showcase_out)
print(f"  -> Total Waterlogged leaves collected: {wl_count}")

# 6. BAD: NUTRIENT DEFICIENT / CHLOROSIS (Tomato Target Spot & Leaf Mold)
print("Downloading Bad: Nutrient Deficient leaves...")
nd_src = 'https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color/Tomato___Target_Spot'
nd_files = get_files_from_github_tree(nd_src)
nd_count = 0
for frel in nd_files[:25]:
    raw_url = f"https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/{frel}"
    fname = f"nutrient_deficient_{nd_count+1:03d}.jpg"
    out = os.path.join(DATASET_DIR, 'bad_nutrient_deficient', fname)
    if download_image(raw_url, out):
        nd_count += 1
        if nd_count <= 3:
            showcase_out = os.path.join(SAMPLES_DIR, f"nutrient_deficient_leaf_{nd_count}.jpg")
            download_image(raw_url, showcase_out)
print(f"  -> Total Nutrient Deficient leaves collected: {nd_count}")

total_dataset = h_count + dry_count + bs_count + bb_count + wl_count + nd_count
print(f"\n[DONE] Dataset preparation complete! Total authentic images: {total_dataset}")
print(f"Saved into: {DATASET_DIR}")
print(f"Sample showcase images into: {SAMPLES_DIR}")
