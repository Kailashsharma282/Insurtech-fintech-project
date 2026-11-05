import os
import sys
import zipfile
import struct
import math
import json

def utm_to_latlon(easting, northing, zone, is_northern=True):
    # Standard WGS84 parameters
    a = 6378137.0
    f = 1 / 298.257223563
    b = a * (1 - f)
    e = math.sqrt(1 - (b / a) ** 2)
    e_prime_sq = (e ** 2) / (1 - e ** 2)
    k0 = 0.9996
    lon0 = math.radians((zone - 1) * 6 - 180 + 3)
    
    x = easting - 500000.0
    y = northing if is_northern else northing - 10000000.0
    
    M = y / k0
    mu = M / (a * (1 - e**2/4 - 3*e**4/64 - 5*e**6/256))
    e1 = (1 - math.sqrt(1 - e**2)) / (1 + math.sqrt(1 - e**2))
    
    phi1 = mu + (3*e1/2 - 27*e1**3/32) * math.sin(2*mu) \
              + (21*e1**2/16 - 55*e1**4/32) * math.sin(4*mu) \
              + (151*e1**3/96) * math.sin(6*mu) \
              + (1097*e1**4/512) * math.sin(8*mu)
              
    N1 = a / math.sqrt(1 - e**2 * math.sin(phi1)**2)
    T1 = math.tan(phi1)**2
    C1 = e_prime_sq * math.cos(phi1)**2
    R1 = a * (1 - e**2) / ((1 - e**2 * math.sin(phi1)**2)**1.5)
    D = x / (N1 * k0)
    
    lat = phi1 - (N1 * math.tan(phi1) / R1) * (
        D**2/2 - (5 + 3*T1 + 10*C1 - 4*C1**2 - 9*e_prime_sq) * D**4/24
        + (61 + 90*T1 + 298*C1 + 45*T1**2 - 252*e_prime_sq - 3*C1**2) * D**6/720
    )
    lon = lon0 + (
        D - (1 + 2*T1 + C1) * D**3/6
        + (5 - 2*C1 + 28*T1 - 3*C1**2 + 8*e_prime_sq + 24*T1**2) * D**5/120
    ) / math.cos(phi1)
    
    return math.degrees(lat), math.degrees(lon)

def parse_shapefile_zip(zip_path: str):
    if not os.path.exists(zip_path):
        return {"error": f"File not found: {zip_path}"}
        
    with zipfile.ZipFile(zip_path, 'r') as z:
        names = z.namelist()
        shp_name = next((n for n in names if n.lower().endswith('.shp')), None)
        prj_name = next((n for n in names if n.lower().endswith('.prj')), None)
        dbf_name = next((n for n in names if n.lower().endswith('.dbf')), None)
        
        if not shp_name:
            return {"error": "ZIP does not contain a .shp file"}
            
        shp_data = z.read(shp_name)
        prj_text = z.read(prj_name).decode('utf-8', errors='ignore') if prj_name else ""
        
        # Check projection
        is_utm = "WGS_1984_UTM" in prj_text or "Transverse_Mercator" in prj_text
        zone = 45 # Default for West Bengal (Zone 45N)
        if "Zone_" in prj_text:
            try:
                zone_str = prj_text.split("Zone_")[1][:3].replace('N', '').replace('S', '').replace('"', '').replace(',', '').strip()
                zone = int(zone_str)
            except Exception:
                zone = 45
        
        # Parse shp header
        file_len, = struct.unpack('>i', shp_data[24:28])
        shape_type, = struct.unpack('<i', shp_data[32:36])
        
        features = []
        offset = 100
        total_len = len(shp_data)
        
        while offset < total_len - 8:
            rec_num, rec_len = struct.unpack('>2i', shp_data[offset:offset+8])
            rec_start = offset + 8
            rec_end = rec_start + rec_len * 2
            if rec_end > total_len:
                break
                
            stype, = struct.unpack('<i', shp_data[rec_start:rec_start+4])
            if stype in [5, 15, 25]: # Polygon, PolygonZ, PolygonM
                num_parts, num_points = struct.unpack('<2i', shp_data[rec_start+36:rec_start+44])
                parts = struct.unpack(f'<{num_parts}i', shp_data[rec_start+44:rec_start+44+num_parts*4])
                pts_offset = rec_start + 44 + num_parts * 4
                
                rings = []
                for p_idx in range(num_parts):
                    start_pt = parts[p_idx]
                    end_pt = parts[p_idx+1] if p_idx + 1 < num_parts else num_points
                    ring = []
                    for i in range(start_pt, end_pt):
                        px, py = struct.unpack('<2d', shp_data[pts_offset + i*16:pts_offset + (i+1)*16])
                        if is_utm:
                            plat, plon = utm_to_latlon(px, py, zone=zone)
                        else:
                            plon, plat = px, py # already WGS84
                        ring.append([round(plat, 6), round(plon, 6)])
                    if ring:
                        rings.append(ring)
                
                if rings:
                    features.append({
                        "recordNumber": rec_num,
                        "shapeType": "Polygon",
                        "rings": rings
                    })
            offset = rec_end
            
        if not features:
            return {"error": "No polygon features found in shapefile"}
            
        all_pts = [pt for f in features for r in f["rings"] for pt in r]
        lats = [p[0] for p in all_pts]
        lons = [p[1] for p in all_pts]
        
        base_name = os.path.splitext(os.path.basename(zip_path))[0]
        
        result = {
            "success": True,
            "filename": os.path.basename(zip_path),
            "areaName": base_name.replace('_', ' ').title(),
            "projection": prj_text.strip() if prj_text else "WGS84",
            "featureCount": len(features),
            "totalPoints": len(all_pts),
            "bounds": [
                [round(min(lats), 6), round(min(lons), 6)],
                [round(max(lats), 6), round(max(lons), 6)]
            ],
            "centroid": [
                round(sum(lats) / len(lats), 6),
                round(sum(lons) / len(lons), 6)
            ],
            "primaryRing": features[0]["rings"][0],
            "allRings": [r for f in features for r in f["rings"]]
        }
        return result

if __name__ == '__main__':
    if len(sys.argv) > 1:
        zpath = sys.argv[1]
    else:
        zpath = r'C:/Users/kaila/.gemini/antigravity/brain/07d793e0-0829-4131-bcbb-2c0dd501c682/.user_uploaded/media_1793828828536_eab95c81.zip'
    res = parse_shapefile_zip(zpath)
    print(json.dumps(res, indent=2))

