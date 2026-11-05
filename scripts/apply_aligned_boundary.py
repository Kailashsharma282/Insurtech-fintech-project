import json

with open('scripts/official_aligned_boundary.json', 'r', encoding='utf-8') as f:
    boundary = json.load(f)

print(f"Loaded {len(boundary)} vertices.")

formatted_coords = "[\n" + ",\n".join(f"      [{lat:.6f}, {lng:.6f}]" for lat, lng in boundary) + "\n    ]"

# 1. Update src/lib/db/seed-data.ts
with open('src/lib/db/seed-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace GHATAL_VILLAGE_BOUNDARY
start_str = "export const GHATAL_VILLAGE_BOUNDARY: [number, number][] = ["
start_idx = text.find(start_str)
if start_idx != -1:
    end_idx = text.find("];", start_idx) + 2
    text = text[:start_idx] + f"export const GHATAL_VILLAGE_BOUNDARY: [number, number][] = {formatted_coords};" + text[end_idx:]
    with open('src/lib/db/seed-data.ts', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated src/lib/db/seed-data.ts successfully!")
else:
    print("GHATAL_VILLAGE_BOUNDARY not found in seed-data.ts!")

# 2. Update src/lib/db/boundaries.ts
with open('src/lib/db/boundaries.ts', 'r', encoding='utf-8') as f:
    btext = f.read()

# Replace area-ghatal-block boundary
b_start = btext.find("id: 'area-ghatal-block',")
if b_start != -1:
    boundary_key = "boundary: ["
    poly_start = btext.find(boundary_key, b_start)
    if poly_start != -1:
        poly_end = btext.find("    ],", poly_start) + len("    ],")
        btext = btext[:poly_start] + f"boundary: {formatted_coords}," + btext[poly_end:]
        with open('src/lib/db/boundaries.ts', 'w', encoding='utf-8') as f:
            f.write(btext)
        print("Updated src/lib/db/boundaries.ts successfully!")
    else:
        print("boundary: [ not found for area-ghatal-block")
else:
    print("area-ghatal-block not found in boundaries.ts")

