import requests
import json
import os

BASE_URL = "http://localhost:3000"

print("--- 1. Testing Shapefile Parse API with user's Ghatal_block.zip ---")
zip_path = r"C:\Users\kaila\.gemini\antigravity\brain\07d793e0-0829-4131-bcbb-2c0dd501c682\.user_uploaded\media_1793828828536_eab95c81.zip"

with open(zip_path, "rb") as f:
    files = {"file": ("Ghatal_block.zip", f, "application/zip")}
    r = requests.post(f"{BASE_URL}/api/shapefile/parse", files=files)
    print("Shapefile Parse status:", r.status_code)
    data = r.json()
    print("Success:", data.get("success"))
    print("Centroid:", data.get("centroid"))
    print("Bounds:", data.get("bounds"))
    print("Total vertices:", len(data.get("primaryRing", [])))

print("\n--- 2. Testing Farmer Registration POST /api/farms ---")
farm_payload = {
    "farmerName": "Biplab Barman",
    "name": "Biplab Barman",
    "surveyNo": "782/1",
    "subSurveyNo": "A-4",
    "village": "Ghatal (CT)",
    "district": "Paschim Medinipur",
    "subDistrict": "Ghatal",
    "state": "West Bengal",
    "jlNo": "042",
    "khaitanNo": "1049/2",
    "currentCrop": "Aman Paddy",
    "cropVariety": "Swarna (MTU 7029)",
    "areaAcres": 3.4,
    "assignedAreaAcres": 3.4,
    "soilType": "Clayey Alluvial",
    "sowingDate": "2025-06-15",
    "harvestDate": "2025-11-20",
    "chf": 0.52,
    "sumInsured": 145000,
    "pmfbyCovered": True,
    "bankAccountNumber": "912048921004",
    "bankIfsc": "SBIN0000081",
    "bankName": "State Bank of India (Ghatal Branch)",
    "aadhaarNumber": "•••• •••• 9102",
    "lat": 22.6659,
    "lng": 87.6772
}

r2 = requests.post(f"{BASE_URL}/api/farms", json=farm_payload)
print("Farm Registration status:", r2.status_code)
registered_farm = r2.json()
farm_data = registered_farm.get("data", {})
print("Registered Farm ID:", farm_data.get("id"))
print("Registered Farmer:", farm_data.get("farmerName"))
print("Registered Plot:", farm_data.get("plotNumber"))
print("Registered District:", farm_data.get("district"))

print("\n--- 3. Testing GET /api/farms to verify persistence ---")
r3 = requests.get(f"{BASE_URL}/api/farms")
all_farms = r3.json()
print("Total farms in DB:", len(all_farms))
newly_found = [f for f in all_farms if f.get("id") == farm_data.get("id")]
print("Newly registered farm found in list:", len(newly_found) > 0)
if newly_found:
    print("Found Farm details:", newly_found[0].get("farmerName"), "-", newly_found[0].get("name"))
