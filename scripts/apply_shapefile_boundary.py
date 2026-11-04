import json
import os

with open('scripts/official_ghatal_shapefile_boundary.json', 'r') as f:
    coords = json.load(f)

formatted_coords = ',\n'.join(f'      [{lat:.6f}, {lon:.6f}]' for lat, lon in coords)

# 1. Update src/lib/db/boundaries.ts
boundaries_path = os.path.join('src', 'lib', 'db', 'boundaries.ts')
with open(boundaries_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace boundary array for area-ghatal-block
idx1 = text.find("id: 'area-ghatal-block'")
assert idx1 != -1, "area-ghatal-block not found in boundaries.ts"
boundary_start = text.find("boundary: [", idx1)
assert boundary_start != -1, "boundary: [ not found after area-ghatal-block"
boundary_end = text.find("],", boundary_start)
assert boundary_end != -1, "], not found after boundary: ["

new_boundaries_text = (
    text[:boundary_start]
    + "boundary: [\n"
    + formatted_coords
    + "\n    ]"
    + text[boundary_end+1:]
)
with open(boundaries_path, 'w', encoding='utf-8', newline='') as f:
    f.write(new_boundaries_text)
print("Updated src/lib/db/boundaries.ts with 252 shapefile vertices!")

# 2. Update src/lib/db/seed-data.ts
seed_path = os.path.join('src', 'lib', 'db', 'seed-data.ts')
with open(seed_path, 'r', encoding='utf-8') as f:
    text2 = f.read()

decl = "export const GHATAL_VILLAGE_BOUNDARY: [number, number][] = ["
idx2 = text2.find(decl)
assert idx2 != -1, "GHATAL_VILLAGE_BOUNDARY not found in seed-data.ts"
end2 = text2.find("];", idx2)
assert end2 != -1, "]; not found after GHATAL_VILLAGE_BOUNDARY"

new_seed_text = (
    text2[:idx2 + len(decl)]
    + "\n"
    + formatted_coords
    + "\n"
    + text2[end2:]
)
with open(seed_path, 'w', encoding='utf-8', newline='') as f:
    f.write(new_seed_text)
print("Updated src/lib/db/seed-data.ts with 252 shapefile vertices!")
