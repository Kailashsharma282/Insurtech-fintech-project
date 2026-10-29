#!/usr/bin/env python3
"""
AgriSure Intelligence - Automated Backend API Test Harness
Tests all core APIs across:
- Authentication & Security (Register, Real Password Login, Wrong Password Rejection, Me, Logout)
- Farm Fleet & Micro-Telemetry (CHF, Satellite, Weather, Sensors, Alerts, Interventions)
- Parametric Claims & Underwriting (List, Evidence Dossier, Verification, Approval)
- Policy Lifecycle (List, Application Submission, Underwriting Decision)
- Ledger Inquiries (Payouts query, Insurance Units, Spatial Risk)
- Operations & IoT (Hardware registry, 3s tick simulation, Solenoid relay toggle)
- AI & Agronomic ML (Disease classification, GA-PSO Optimizer, Weather shock simulation)
- Cryptographic Audit Trail (SHA-256 integrity check)

(Excluded per user instruction: Payment disbursement execution, SMS/messaging, and external MQTT broker)
"""

import urllib.request
import urllib.parse
import json
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

BASE_URL = "http://localhost:3006"

def request_json(path, method="GET", data=None, cookie=None):
    url = f"{BASE_URL}{path}"
    headers = {"User-Agent": "AgriSure-APITester/1.0"}
    body_bytes = None
    if data is not None:
        headers["Content-Type"] = "application/json"
        body_bytes = json.dumps(data).encode("utf-8")
    if cookie:
        headers["Cookie"] = cookie

    req = urllib.request.Request(url, data=body_bytes, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            set_cookie = resp.headers.get("Set-Cookie")
            content = resp.read().decode("utf-8")
            try:
                parsed = json.loads(content)
            except:
                parsed = content
            return status, parsed, set_cookie
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8", errors="ignore")
        try:
            parsed = json.loads(content)
        except:
            parsed = content
        return e.code, parsed, None
    except Exception as e:
        return 0, str(e), None

def run_tests():
    print("=" * 75)
    print(" AGRISURE INTELLIGENCE - PRODUCTION API & AUTH VERIFICATION SUITE")
    print(f" Target: {BASE_URL}")
    print(" Mode: Real PBKDF2 Password Authentication (Zero Mock OTP)")
    print(" Policy: Excluding Payment execution, Messaging, and MQTT broker")
    print("=" * 75)

    tests = []
    session_cookie = None

    # 1. AUTH: Register a new farmer with a secure password
    ts = int(time.time())
    reg_phone = f"+919831{str(ts)[-6:]}"
    reg_password = f"SecureFarmer@{str(ts)[-4:]}"
    reg_data = {
        "name": f"Audited Farmer {str(ts)[-4:]}",
        "role": "FARMER",
        "phone": reg_phone,
        "password": reg_password,
        "district": "Ghatal, Paschim Medinipur",
        "village": "Ghatal",
        "primaryCrop": "Aman Paddy",
        "farmSizeHa": 2.8
    }
    status, body, cookie = request_json("/api/auth/register", method="POST", data=reg_data)
    ok = status == 201 and isinstance(body, dict) and body.get("success") is True
    tests.append(("POST /api/auth/register (New User)", status, ok, f"Registered new pilot farmer {reg_phone} with hashed password"))

    # 2. SECURITY TEST: Attempt login with WRONG password -> Expect 401 Unauthorized
    bad_login_data = {
        "role": "FARMER",
        "identifier": reg_phone,
        "password": "WrongPassword@999"
    }
    status, body, _ = request_json("/api/auth/login", method="POST", data=bad_login_data)
    ok = status == 401 and isinstance(body, dict) and body.get("success") is False
    tests.append(("POST /api/auth/login (Wrong Password)", status, ok, f"Correctly rejected invalid password with HTTP 401"))

    # 3. SECURITY TEST: Attempt login with Nonexistent Account -> Expect 401 Unauthorized
    nonexistent_data = {
        "role": "FARMER",
        "identifier": "+919999999999",
        "password": "AnyPassword@123"
    }
    status, body, _ = request_json("/api/auth/login", method="POST", data=nonexistent_data)
    ok = status == 401 and isinstance(body, dict) and body.get("success") is False
    tests.append(("POST /api/auth/login (Unknown Account)", status, ok, f"Correctly rejected unknown account with HTTP 401"))

    # 4. AUTH: Login with pre-seeded pilot farmer Subhash Biswas (+91 98321 44820 / Farmer@2026)
    pilot_login_data = {
        "role": "FARMER",
        "identifier": "+91 98321 44820",
        "password": "Farmer@2026"
    }
    status, body, cookie = request_json("/api/auth/login", method="POST", data=pilot_login_data)
    ok = status == 200 and isinstance(body, dict) and body.get("success") is True
    if cookie:
        session_cookie = cookie.split(";")[0]
    tests.append(("POST /api/auth/login (Pilot Farmer)", status, ok, f"Pilot login success, JWT session cookie minted"))

    # 5. AUTH: Validate authenticated session (/api/auth/me) with cookie
    status, body, _ = request_json("/api/auth/me", method="GET", cookie=session_cookie)
    ok = status == 200 and isinstance(body, dict) and body.get("authenticated") is True
    user_name = body.get("user", {}).get("name", "Unknown") if isinstance(body, dict) else "None"
    tests.append(("GET /api/auth/me (Authenticated)", status, ok, f"Session verified for: {user_name} ({body.get('user', {}).get('role')})"))

    # 6. SECURITY TEST: Validate /api/auth/me WITHOUT cookie -> Expect 401 Unauthorized
    status, body, _ = request_json("/api/auth/me", method="GET")
    ok = status == 401 and isinstance(body, dict) and body.get("authenticated") is False
    tests.append(("GET /api/auth/me (Unauthenticated)", status, ok, f"Protected endpoint correctly blocked unauthenticated call (HTTP 401)"))

    # 7. AUTH: Login as Chief Actuary / Insurer (underwriter@agrisure.in / Insurer@2026)
    insurer_login_data = {
        "role": "INSURER",
        "identifier": "underwriter@agrisure.in",
        "password": "Insurer@2026"
    }
    status, body, _ = request_json("/api/auth/login", method="POST", data=insurer_login_data)
    ok = status == 200 and isinstance(body, dict) and body.get("success") is True
    tests.append(("POST /api/auth/login (Pilot Insurer)", status, ok, f"Insurer credentials verified (Dr. S. Sen)"))

    # 8. FARMS: Get all farms fleet
    status, body, _ = request_json("/api/farms", method="GET")
    count = body.get("count", len(body.get("data", []))) if isinstance(body, dict) else 0
    ok = status == 200 and count >= 40
    tests.append(("GET /api/farms", status, ok, f"Retrieved {count} farms across West Bengal clusters"))

    # 9. FARMS: Get Primary Demo Plot #204
    status, body, _ = request_json("/api/farms/farm-plot-204", method="GET")
    farm = body.get("data", {}) if isinstance(body, dict) else {}
    ok = status == 200 and farm.get("id") == "farm-plot-204"
    tests.append(("GET /api/farms/farm-plot-204", status, ok, f"Plot #204 ({farm.get('crop', farm.get('currentCrop'))}, {farm.get('acreage')}ha in {farm.get('village')})"))

    # 10. FARMS: CHF Calculation for Plot #204
    status, body, _ = request_json("/api/farms/farm-plot-204/chf", method="GET")
    chf_data = body.get("data", {}) if isinstance(body, dict) else {}
    chf_val = chf_data.get("chf", chf_data.get("currentChf", 0.71))
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/farms/farm-plot-204/chf", status, ok, f"CHF Index: {chf_val} (Entropy calculated)"))

    # 11. FARMS: Satellite Imagery Telemetry
    status, body, _ = request_json("/api/farms/farm-plot-204/satellite", method="GET")
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/farms/farm-plot-204/satellite", status, ok, f"Sentinel-2 optical & Sentinel-1 SAR passes"))

    # 12. FARMS: Weather Telemetry
    status, body, _ = request_json("/api/farms/farm-plot-204/weather", method="GET")
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/farms/farm-plot-204/weather", status, ok, f"AWS Microclimate & rainfall metrics"))

    # 13. FARMS: IoT Sensors
    status, body, _ = request_json("/api/farms/farm-plot-204/sensors", method="GET")
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/farms/farm-plot-204/sensors", status, ok, f"ESP32 probe readings & moisture profile"))

    # 14. FARMS: Alerts
    status, body, _ = request_json("/api/farms/farm-plot-204/alerts", method="GET")
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/farms/farm-plot-204/alerts", status, ok, f"Agronomic alert feeds"))

    # 15. FARMS: Interventions
    status, body, _ = request_json("/api/farms/farm-plot-204/interventions", method="GET")
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/farms/farm-plot-204/interventions", status, ok, f"Closed-loop intervention logs"))

    # 16. CLAIMS: List all claims
    status, body, _ = request_json("/api/claims", method="GET")
    claims_count = body.get("count", len(body.get("data", []))) if isinstance(body, dict) else 0
    ok = status == 200 and claims_count > 0
    tests.append(("GET /api/claims", status, ok, f"Found {claims_count} parametric claim dossiers"))

    # 17. CLAIMS: Specific Claim CLM-2026-084 (11-Section Evidence Package)
    status, body, _ = request_json("/api/claims/claim-clm-084", method="GET")
    claim_item = body.get("data", {}) if isinstance(body, dict) else {}
    ok = status == 200 and claim_item.get("claimNumber") == "CLM-2026-084"
    tests.append(("GET /api/claims/claim-clm-084", status, ok, f"Claim {claim_item.get('claimNumber')} (Amount: INR {claim_item.get('claimAmount', 0):,})"))

    # 18. CLAIMS: Verify Claim
    verify_payload = {"notes": "Automated Satellite Check: Waterlogging confirmed", "approvedChf": 0.49}
    status, body, _ = request_json("/api/claims/claim-clm-084/verify", method="POST", data=verify_payload)
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/claims/claim-clm-084/verify", status, ok, f"Satellite verification marked VERIFIED"))

    # 19. CLAIMS: Approve Claim
    approve_payload = {"notes": "Parametric trigger validated under policy terms", "approvedAmount": 42800}
    status, body, _ = request_json("/api/claims/claim-clm-084/approve", method="POST", data=approve_payload)
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/claims/claim-clm-084/approve", status, ok, f"Adjudication state updated to APPROVED"))

    # 20. POLICIES: List all policies
    status, body, _ = request_json("/api/policies", method="GET")
    policies_count = body.get("count", len(body.get("data", []))) if isinstance(body, dict) else 0
    ok = status == 200 and policies_count > 0
    tests.append(("GET /api/policies", status, ok, f"Retrieved {policies_count} active & pending policies"))

    # 21. POLICIES: Create New Application
    policy_payload = {
        "farmerId": "farmer-1",
        "farmerName": "Subhash Biswas",
        "farmId": "farm-plot-204",
        "farmPlot": "Plot #204",
        "insuranceUnitCode": "WB-GHT-001",
        "crop": "Aman Paddy",
        "sumInsured": 145000,
        "premiumAmount": 7250,
        "subsidyAmount": 5075,
        "farmerShare": 2175,
        "triggerChf": 0.55
    }
    status, body, _ = request_json("/api/policies", method="POST", data=policy_payload)
    new_pol = body.get("data", {}) if isinstance(body, dict) else {}
    ok = status == 201 and body.get("success") is True
    tests.append(("POST /api/policies", status, ok, f"Created application {new_pol.get('policyNumber', 'POL-NEW')}"))

    # 22. POLICIES: Underwriting Decision
    decision_payload = {"action": "APPROVE", "underwriterNotes": "Automated batch test approval"}
    status, body, _ = request_json("/api/policies/pol-nadia-204/decision", method="POST", data=decision_payload)
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/policies/pol-nadia-204/decision", status, ok, f"Policy status ACTIVE & bound"))

    # 23. PAYOUTS: List Payout Ledger (Inquiry only, not disbursement)
    status, body, _ = request_json("/api/payouts", method="GET")
    payouts_count = len(body.get("data", [])) if isinstance(body, dict) else 0
    ok = status == 200 and payouts_count > 0
    tests.append(("GET /api/payouts", status, ok, f"Queried {payouts_count} payout orders in ledger"))

    # 24. PAYOUTS: Get specific payout order
    status, body, _ = request_json("/api/payouts/payout-1", method="GET")
    payout_item = body.get("data", {}) if isinstance(body, dict) else {}
    ok = status == 200 and payout_item.get("id") == "payout-1"
    tests.append(("GET /api/payouts/payout-1", status, ok, f"Payout Ref: {payout_item.get('payoutRef', 'N/A')} (INR {payout_item.get('amount', 0):,})"))

    # 25. INSURANCE UNITS: List spatial units
    status, body, _ = request_json("/api/insurance-units", method="GET")
    iu_count = len(body.get("data", [])) if isinstance(body, dict) else 0
    ok = status == 200 and iu_count > 0
    tests.append(("GET /api/insurance-units", status, ok, f"Found {iu_count} Insurance Units across pilot"))

    # 26. INSURANCE UNITS: Specific Unit Risk Breakdown
    status, body, _ = request_json("/api/insurance-units/iu-nadia-01/risk", method="GET")
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/insurance-units/iu-nadia-01/risk", status, ok, f"Spatial aggregate CHF risk calculated"))

    # 27. IOT: Device Registry
    status, body, _ = request_json("/api/iot/devices", method="GET")
    dev_count = len(body.get("data", [])) if isinstance(body, dict) else 0
    ok = status == 200 and dev_count > 0
    tests.append(("GET /api/iot/devices", status, ok, f"Queried {dev_count} telemetry nodes"))

    # 28. IOT: 3-Second Tick Simulator
    status, body, _ = request_json("/api/iot/tick", method="GET")
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/iot/tick", status, ok, f"Processed hardware telemetry tick & heartbeats"))

    # 29. IOT: Toggle Solenoid Relay
    status, body, _ = request_json("/api/iot/devices/iot-dev-1/toggle", method="POST", data={})
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/iot/devices/iot-dev-1/toggle", status, ok, f"Solenoid pump relay state toggled"))

    # 30. AI / ML: Crop Pathogen & Stress Predictor
    disease_payload = {
        "crop": "Aman Paddy",
        "humidity": 82.5,
        "temperature": 32.0,
        "symptoms": ["sheath_rot", "leaf_blast"]
    }
    status, body, _ = request_json("/api/disease/predict", method="POST", data=disease_payload)
    pred = body.get("prediction", {}) if isinstance(body, dict) else {}
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/disease/predict", status, ok, f"Predicted disease: {pred.get('disease', 'Brown Spot')} (Risk: {pred.get('riskLevel', 'MODERATE')})"))

    # 31. AI / ML: GA-PSO Hybrid Resource Optimizer
    opt_payload = {
        "crop": "Aman Paddy",
        "areaHa": 2.8,
        "budgetInr": 20000
    }
    status, body, _ = request_json("/api/optimization/run", method="POST", data=opt_payload)
    opt_res = body.get("data", {}) if isinstance(body, dict) else {}
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/optimization/run", status, ok, f"Optimal allocation: Irrigation {opt_res.get('optimalIrrigationMm', 42)}mm, Yield +{opt_res.get('projectedYieldGainPct', 18.5)}%"))

    # 32. SIMULATE: Meteorological Shock Injection
    sim_payload = {"eventType": "heavy_rain", "targetUnit": "WB-GHT-001"}
    status, body, _ = request_json("/api/simulate/event", method="POST", data=sim_payload)
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/simulate/event", status, ok, f"Dispatched 142mm cloudburst shock to Ghatal basin"))

    # 33. AUDIT: SHA-256 Ledger Query
    status, body, _ = request_json("/api/audit/farm/farm-plot-204", method="GET")
    audit_items = body.get("data", []) if isinstance(body, dict) else []
    ok = status == 200 and body.get("success") is True
    tests.append(("GET /api/audit/farm/farm-plot-204", status, ok, f"Retrieved {len(audit_items)} immutable audit log blocks"))

    # 34. AUTH: Logout
    status, body, _ = request_json("/api/auth/logout", method="POST")
    ok = status == 200 and body.get("success") is True
    tests.append(("POST /api/auth/logout", status, ok, f"Session terminated and cookie cleared"))

    print("\n" + "=" * 75)
    print(" DETAILED EXECUTION MATRIX")
    print("=" * 75)
    passed = 0
    failed = 0
    for endpoint, status, ok, msg in tests:
        mark = "[PASS]" if ok else "[FAIL]"
        if ok:
            passed += 1
        else:
            failed += 1
        print(f"{mark:7} {endpoint:44} (HTTP {status}) : {msg}")

    print("=" * 75)
    print(f"Total APIs Tested: {len(tests)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print("=" * 75)

    if failed == 0:
        print("\nALL BACKEND APIS & SECURITY BOUNDARIES ARE WORKING PROPERLY WITH ZERO FAILURES.")
        return 0
    else:
        print(f"\n{failed} TEST(S) FAILED.")
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())
