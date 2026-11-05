import math

def hash_str(s):
    h = 0
    for c in s:
        h = ((h << 5) - h) + ord(c)
        h &= 0xFFFFFFFF
    return h

def generate_irregular_boundary(lat, lon, south, north, west, east, name):
    d_lat = max(0.012, abs(north - south) * 0.48)
    d_lon = max(0.014, abs(east - west) * 0.48)
    h = hash_str(name)
    
    phi1 = ((h % 100) / 100.0) * math.pi * 2
    phi2 = (((h // 100) % 100) / 100.0) * math.pi * 2
    phi3 = (((h // 10000) % 100) / 100.0) * math.pi * 2
    phi4 = (((h // 1000000) % 100) / 100.0) * math.pi * 2
    
    a1 = 0.15 + ((h % 10) / 100.0)
    a2 = 0.10 + (((h // 10) % 10) / 100.0)
    a3 = 0.06 + (((h // 100) % 10) / 150.0)
    a4 = 0.04
    
    n_points = 36
    points = []
    for k in range(n_points):
        theta = (2.0 * math.pi * k) / n_points
        r = 1.0 + a1 * math.cos(2*theta + phi1) + a2 * math.sin(3*theta + phi2) + a3 * math.cos(5*theta + phi3) + a4 * math.sin(7*theta + phi4)
        p_lat = round(lat + d_lat * r * math.sin(theta), 6)
        p_lon = round(lon + d_lon * r * math.cos(theta), 6)
        points.append([p_lat, p_lon])
    points.append(points[0]) # close ring
    return points

test_poly = generate_irregular_boundary(22.68, 87.72, 22.65, 22.71, 87.69, 87.75, "Kharar")
print(f"Generated {len(test_poly)} points:")
for p in test_poly[:5]:
    print(f"  {p}")
print("...")
for p in test_poly[-3:]:
    print(f"  {p}")

