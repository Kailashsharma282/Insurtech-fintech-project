import json

with open('scripts/exact_ghatal_chf_boundary.json', 'r') as f:
    boundary_pts = json.load(f)

# Format as code
pts_str = "[\n" + ",\n".join([f"  [{lat:.6f}, {lng:.6f}]" for lat, lng in boundary_pts]) + "\n]"

# 1. Update src/lib/db/seed-data.ts
with open('src/lib/db/seed-data.ts', 'r', encoding='utf-8') as f:
    seed_content = f.read()

# Replace GHATAL_VILLAGE_BOUNDARY
import re
pattern_seed = r'export const GHATAL_VILLAGE_BOUNDARY: \[number, number\]\[\] = \[[\s\S]*?\n\];'
replacement_seed = f'export const GHATAL_VILLAGE_BOUNDARY: [number, number][] = {pts_str};'

new_seed = re.sub(pattern_seed, replacement_seed, seed_content)
assert new_seed != seed_content, "Failed to replace in seed-data.ts"

with open('src/lib/db/seed-data.ts', 'w', encoding='utf-8') as f:
    f.write(new_seed)
print("Updated src/lib/db/seed-data.ts!")

# 2. Update src/lib/db/boundaries.ts
with open('src/lib/db/boundaries.ts', 'r', encoding='utf-8') as f:
    b_content = f.read()

pattern_b = r"id: 'area-ghatal-block',[\s\S]*?boundary: \[[\s\S]*?\n    \],"
# Find where boundary starts in area-ghatal-block
ghatal_start = b_content.find("id: 'area-ghatal-block'")
boundary_start = b_content.find("boundary: [", ghatal_start)
boundary_end = b_content.find("totalAcreageHa:", boundary_start)
if boundary_end == -1:
    # Look for monitoredPlots or next property
    boundary_end = b_content.find("monitoredPlots:", boundary_start)

# Let's replace boundary in area-ghatal-block cleanly
pattern_area = r"(id: 'area-ghatal-block'[\s\S]*?boundary: )\[[\s\S]*?\n    \]"
replacement_area = r"\g<1>" + pts_str

new_b = re.sub(pattern_area, replacement_area, b_content)
assert new_b != b_content, "Failed to replace in boundaries.ts"

with open('src/lib/db/boundaries.ts', 'w', encoding='utf-8') as f:
    f.write(new_b)
print("Updated src/lib/db/boundaries.ts!")

