import urllib.request
import json

BASE = "http://localhost:3000"

print("--- 1. Testing All 4 Demo Accounts Login ---")
accounts = [
    {
        "role": "FARMER",
        "identifier": "farmer@agrisure.in",
        "password": "Farmer@2026",
        "expectedRedirect": "/farmer/dashboard",
        "expectedName": "Subhash Mondal (Plot #204)"
    },
    {
        "role": "INSURER",
        "identifier": "insurer@agrisure.in",
        "password": "Insurer@2026",
        "expectedRedirect": "/insurer/dashboard",
        "expectedName": "Dr. S. Sen (Chief Underwriting Officer)"
    },
    {
        "role": "ADMIN",
        "identifier": "admin@agrisure.in",
        "password": "Admin@2026",
        "expectedRedirect": "/admin/overview",
        "expectedName": "AgriSure Operations Administrator"
    },
    {
        "role": "FIELD_AGENT",
        "identifier": "inspector@agrisure.in",
        "password": "Inspector@2026",
        "expectedRedirect": "/intelligence/map",
        "expectedName": "Prabir Bhattacharya (Lead Field Inspector & CCE Agronomist)"
    }
]

for acc in accounts:
    req = urllib.request.Request(
        f"{BASE}/api/auth/login",
        data=json.dumps({
            "role": acc["role"],
            "identifier": acc["identifier"],
            "password": acc["password"]
        }).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res_obj = urllib.request.urlopen(req)
    res = json.loads(res_obj.read().decode("utf-8"))
    assert res["success"] == True, f"Login failed for {acc['identifier']}"
    assert res["redirectUrl"] == acc["expectedRedirect"]
    user = res["user"]
    print(f"[OK] {acc['role']} Login Success: {user['name']} -> Redirect: {res['redirectUrl']}")
    # Check session cookie returned
    cookies = res_obj.headers.get("Set-Cookie")
    assert cookies is not None, "Session cookie must be set on login"
    assert "agrisure_session=" in cookies, "agrisure_session cookie missing"

print("\n--- 2. Testing /api/auth/logout ---")
req = urllib.request.Request(
    f"{BASE}/api/auth/logout",
    data=b"{}",
    headers={"Content-Type": "application/json"}
)
res_obj = urllib.request.urlopen(req)
res = json.loads(res_obj.read().decode("utf-8"))
assert res["success"] == True
cookies = res_obj.headers.get("Set-Cookie")
assert "Max-Age=0" in cookies or "max-age=0" in cookies.lower(), "Session cookie must be expired on logout"
print("[OK] Logout cleared session cookie successfully!")

print("\n--- 3. Testing District Name in Earth Engine & Farms API ---")
res_gee = json.loads(urllib.request.urlopen(f"{BASE}/api/earth-engine/ghatal").read().decode("utf-8"))
assert res_gee["data"]["studyArea"]["district"] == "Purba Medinipur"
print(f"[OK] GEE Study Area District: {res_gee['data']['studyArea']['district']}")

res_farms = json.loads(urllib.request.urlopen(f"{BASE}/api/farms").read().decode("utf-8"))
farms = res_farms["data"]
assert all(f.get("district") == "Purba Medinipur" for f in farms)
print(f"[OK] All {len(farms)} farms verified with district: Purba Medinipur")

print("\n>>> ALL DEMO ACCOUNTS, LOGOUT, & PURBA MEDINIPUR TESTS PASSED 100%! <<<")
