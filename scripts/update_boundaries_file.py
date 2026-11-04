import json

with open('scripts/exact_ghatal_chf_boundary.json', 'r') as f:
    boundary_pts = json.load(f)

pts_str = "    boundary: [\n" + ",\n".join([f"      [{lat:.6f}, {lng:.6f}]" for lat, lng in boundary_pts]) + "\n    ],"

with open('src/lib/db/boundaries.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "id: 'area-ghatal-block'" in line:
        start_idx = i
    if start_idx != -1 and "totalAcreageHa: 1450" in line:
        end_idx = i
        break

assert start_idx != -1 and end_idx != -1

# Find where boundary: [ starts
b_start = -1
for i in range(start_idx, end_idx):
    if "boundary: [" in lines[i]:
        b_start = i
        break

assert b_start != -1

new_lines = lines[:b_start] + [pts_str + "\n"] + lines[end_idx:]

with open('src/lib/db/boundaries.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Updated src/lib/db/boundaries.ts successfully!")

