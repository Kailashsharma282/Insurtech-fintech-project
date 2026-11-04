import urllib.request
import json

BASE = "http://localhost:3000"

print("--- 1. Testing /api/disease/predict (HEALTHY) ---")
req = urllib.request.Request(
    f"{BASE}/api/disease/predict",
    data=json.dumps({"condition": "healthy", "crop": "Aman Paddy"}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
assert res["success"] == True
data_h = res["data"]
print(f"Disease: {data_h['disease']}")
print(f"Water Required: {data_h['waterRequirement']['required']} -> Badge: {data_h['waterRequirement']['statusBadge']}")
print(f"Soil Moisture: {data_h['waterRequirement']['estimatedSoilMoisturePct']}%")
print(f"NPK Balance: {data_h['npkCondition']['overallBalanceScore']}/100")
assert data_h['waterRequirement']['required'] == False
assert "NO" in data_h['waterRequirement']['statusBadge']
assert data_h['waterRequirement']['estimatedSoilMoisturePct'] == 65

print("\n--- 2. Testing /api/disease/predict (DRY LEAF) ---")
req = urllib.request.Request(
    f"{BASE}/api/disease/predict",
    data=json.dumps({"condition": "dry", "crop": "Aman Paddy"}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
assert res["success"] == True
data_d = res["data"]
print(f"Disease: {data_d['disease']}")
print(f"Water Required: {data_d['waterRequirement']['required']} -> Badge: {data_d['waterRequirement']['statusBadge']}")
print(f"Soil Moisture: {data_d['waterRequirement']['estimatedSoilMoisturePct']}%")
print(f"NPK Potassium: {data_d['npkCondition']['potassium']['status']} ({data_d['npkCondition']['potassium']['currentKgHa']} kg/ha)")
assert data_d['waterRequirement']['required'] == True
assert "YES" in data_d['waterRequirement']['statusBadge']
assert data_d['waterRequirement']['estimatedSoilMoisturePct'] == 22

print("\n--- 3. Testing /api/earth-engine/ghatal ---")
res = json.loads(urllib.request.urlopen(f"{BASE}/api/earth-engine/ghatal").read().decode("utf-8"))
assert res["success"] == True
gee = res["data"]
print(f"Study Area: {gee['studyArea']['name']}, Asset: {gee['studyArea']['geeAsset']}")
print(f"Satellites count: {len(gee['liveSatellites'])}")
for s in gee['liveSatellites']:
    print(f" - {s['title']} [{s['status']}]")
print(f"Silabati River Hydrology: {len(gee['hydrologyModel']['spatialZones'])} zones")

print("\n--- 4. Testing /api/farms (Ghatal River Proximity & CHF) ---")
res = json.loads(urllib.request.urlopen(f"{BASE}/api/farms").read().decode("utf-8"))
assert res["success"] == True
farms = res["data"]
print(f"Total farms returned: {len(farms)}")
near_river = [f for f in farms if (f.get("distanceToRiverMeters") or 0) < 500]
upland = [f for f in farms if (f.get("distanceToRiverMeters") or 0) > 1200]
print(f"Near river plots (< 500m): {len(near_river)}")
print(f"Near river CHF: min={min(f['currentChf'] for f in near_river)}, max={max(f['currentChf'] for f in near_river)} (All < 0.55!)")
assert all(f['currentChf'] < 0.55 for f in near_river), "All near river plots must have CHF < 0.55"

print(f"Upland plots (> 1200m): {len(upland)}")
print(f"Upland CHF: min={min(f['currentChf'] for f in upland)}, max={max(f['currentChf'] for f in upland)} (All >= 0.70!)")
assert all(f['currentChf'] >= 0.70 for f in upland), "All upland plots must have CHF >= 0.70"

print("\n>>> ALL VALIDATION TESTS PASSED 100%! <<<")
