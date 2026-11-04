import os
import re

files_to_update = [
    'src/lib/types.ts',
    'src/lib/db/seed-data.ts',
    'src/lib/db/user-store.ts',
    'src/context/RoleContext.tsx',
    'src/app/api/earth-engine/ghatal/route.ts',
    'src/app/api/disease/predict/route.ts',
    'src/app/api/farms/[id]/chf/route.ts',
    'src/app/api/insurance/validate-chf/route.ts',
    'src/app/api/auth/register/route.ts',
    'src/app/api/simulate/event/route.ts',
    'src/app/farmer/dashboard/page.tsx',
    'src/app/farmer/farms/page.tsx',
    'src/app/farmer/insurance-validation/page.tsx',
    'src/app/farmer/insurance/apply/page.tsx',
    'src/app/intelligence/map/page.tsx',
    'src/app/intelligence/weather/page.tsx',
    'src/app/page.tsx',
    'src/app/team/page.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/maps/AgriMap.tsx',
    'src/lib/algorithms/ghatal-chf.ts'
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'Paschim Medinipur' in content:
            new_content = content.replace('Paschim Medinipur', 'Purba Medinipur')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Replaced in {filepath}")

# Add GHATAL_VILLAGE_BOUNDARY to src/lib/db/seed-data.ts
with open('src/lib/db/seed-data.ts', 'r', encoding='utf-8') as f:
    seed_content = f.read()

village_boundary_ts = """// Ghatal Village & Cadastral Pilot Boundary (Purba Medinipur)
export const GHATAL_VILLAGE_BOUNDARY: [number, number][] = [
  [22.7120, 87.6760], // NW Vertex (Upper river entry)
  [22.7135, 87.7050], // North Margin (Kharar-Ghatal road)
  [22.6980, 87.7420], // North-East Highland (Birsingha Upland)
  [22.6840, 87.7660], // East Ridge (Dewanchak Sector)
  [22.6590, 87.7740], // South-East Confluence (River exit)
  [22.6330, 87.7660], // South boundary
  [22.6300, 87.7340], // South-West Char lowland
  [22.6460, 87.7010], // West Terrace
  [22.6780, 87.6790], // West Inflow
  [22.7120, 87.6760]  // Close NW
];

// Silabati River polyline across Ghatal Block (NW upstream to SE confluence)"""

if 'GHATAL_VILLAGE_BOUNDARY' not in seed_content:
    seed_content = seed_content.replace(
        '// Silabati River polyline across Ghatal Block (NW upstream to SE confluence)',
        village_boundary_ts
    )
    with open('src/lib/db/seed-data.ts', 'w', encoding='utf-8') as f:
        f.write(seed_content)
    print("Added GHATAL_VILLAGE_BOUNDARY to seed-data.ts")

print("Done Purba Medinipur replacement and boundary injection!")
