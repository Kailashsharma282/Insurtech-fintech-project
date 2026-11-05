import math
import json

def gen_poly(lat, lon, d_lat, d_lon, name):
    h = 0
    for c in name:
        h = ((h << 5) - h) + ord(c)
        h &= 0xFFFFFFFF
    phi1 = ((h % 100) / 100.0) * math.pi * 2
    phi2 = (((h // 100) % 100) / 100.0) * math.pi * 2
    phi3 = (((h // 10000) % 100) / 100.0) * math.pi * 2
    
    a1 = 0.16 + ((h % 10) / 100.0)
    a2 = 0.11 + (((h // 10) % 10) / 100.0)
    a3 = 0.07
    
    n = 32
    pts = []
    for k in range(n):
        th = (2.0 * math.pi * k) / n
        r = 1.0 + a1 * math.cos(2*th + phi1) + a2 * math.sin(3*th + phi2) + a3 * math.cos(5*th + phi3)
        pts.append([round(lat + d_lat * r * math.sin(th), 6), round(lon + d_lon * r * math.cos(th), 6)])
    pts.append(pts[0])
    return pts

kharar_pts = gen_poly(22.745, 87.720, 0.022, 0.024, "Kharar Municipal Unit")
chandrakona_pts = gen_poly(22.712, 87.635, 0.032, 0.035, "Chandrakona Sector")

with open('src/lib/db/boundaries.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace Kharar boundary
old_kharar_block = """    boundary: [
  [
    22.75,
    87.7
  ],
  [
    22.765,
    87.725
  ],
  [
    22.755,
    87.74
  ],
  [
    22.735,
    87.73
  ],
  [
    22.73,
    87.705
  ],
  [
    22.75,
    87.7
  ]
],"""

new_kharar_block = f"    boundary: {json.dumps(kharar_pts, indent=6)},"

if old_kharar_block in code:
    code = code.replace(old_kharar_block, new_kharar_block)
    print("Replaced Kharar boundary with 33 irregular points")
else:
    print("Kharar block not matched exactly")

old_chandra_block = """    boundary: [
  [
    22.725,
    87.62
  ],
  [
    22.74,
    87.66
  ],
  [
    22.705,
    87.67
  ],
  [
    22.685,
    87.635
  ],
  [
    22.7,
    87.615
  ],
  [
    22.725,
    87.62
  ]
],"""

new_chandra_block = f"    boundary: {json.dumps(chandrakona_pts, indent=6)},"

if old_chandra_block in code:
    code = code.replace(old_chandra_block, new_chandra_block)
    print("Replaced Chandrakona boundary with 33 irregular points")
else:
    print("Chandrakona block not matched exactly")

with open('src/lib/db/boundaries.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated boundaries.ts successfully!")
