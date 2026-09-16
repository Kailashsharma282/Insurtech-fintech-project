# AgriSure Intelligence
### Satellite Remote Sensing &times; Agronomic AI &times; IoT Telemetry &times; Parametric Underwriting

> **Core Operational Workflow:**  
> `OBSERVE &rarr; DIAGNOSE &rarr; PRESCRIBE &rarr; ACTUATE &rarr; VERIFY &rarr; INSURE`
> 
> *“Insurance backs up the yield-preservation system when unavoidable natural shocks exceed mitigation capability. Do not position insurance as the first line of defense.”*

---

## 1. Executive Summary & Philosophy
AgriSure Intelligence is a production-grade full-stack Smart Agriculture and InsurTech platform designed to eliminate the 6-to-9 month delay and moral hazard of conventional crop insurance cutting surveys. By combining **Sentinel-2 optical** and **Sentinel-1 C-SAR radar remote sensing**, **in-situ IoT telemetry**, **38-class deep learning crop pathology**, **GA-PSO bio-inspired nutrient optimization**, and a transparent **Shannon entropy Crop Health Factor (CHF)**, the platform detects stress days before visible wilting occurs, intervenes precisely to preserve yield, and settles catastrophic shocks automatically.

---

## 2. Technology Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS (Design System: `#071511`, `#10B981`, `#F8FAFC`, `#0F172A`), Lucide Icons, Recharts, Leaflet GIS.
- **Backend & APIs**: Full-stack Next.js App Router API routes, REST endpoints, Server-Sent & polling IoT simulation stream.
- **Database & Data Modeling**: Prisma ORM schema with 22 relational entities and PostGIS extensions, comprehensive in-memory / JSON store with 40 farms, 25 farmers, 20 IoT nodes, 30 claims, 15 payouts, and 50 alerts.
- **Infrastructure**: Docker & Docker Compose ready with PostgreSQL 15 + PostGIS container support.

---

## 3. Quickstart & Local Execution

### Option A: Standard Development Server (Zero external database required)
```bash
# 1. Clone or open the repository
cd Insurtech-Fintech-Project

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Docker Compose (PostgreSQL 15 + PostGIS + Web App)
```bash
docker-compose up --build
```
Access the application on [http://localhost:3000](http://localhost:3000).

---

## 4. User Roles & Role-Aware Navigation

The platform provides an instant role switcher in the top navigation bar:

| Role | Primary Persona | Default Landing Route | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **🧑‍🌾 FARMER** | Subhash Biswas (Plot #204) | `/farmer/dashboard` | Plain-language health scores, live pump toggle, disease scanner, GA-PSO optimizer. |
| **🏛️ INSURER** | Dr. S. Sen (Chief Actuary) | `/insurer/dashboard` | Gram Panchayat risk maps, 11-section claim evidence packages, NEFT payout clearing. |
| **⚙️ ADMIN** | AgriSure Operations Lead | `/admin/overview` | Copernicus pipeline uptime, IoT broker stream, model latencies, exception handling. |
| **🔍 FIELD AGENT** | Prabir Bhattacharya (FA-WB-441) | `/intelligence/map` | Geotagged ground truth logging, GPS parcel validation, damage verification. |

---

## 5. Complete Route Directory

### Public & Scientific Documentation
- `/` &mdash; Public Landing Page with visual resilience story, live KPI cards, and pilot summary.
- `/how-it-works` &mdash; Interactive 6-stage workflow process with expandable engineering panels.
- `/technology` &mdash; Architecture overview of radar, neural models, and actuarial indices.
- `/technology/stress` &mdash; Early Stress Detection (UV-NDVI & Sentinel-1 VH radar backscatter timeline).
- `/technology/chf` &mdash; Transparent Crop Health Factor (CHF) formula sandbox with live Shannon entropy sliders.
- `/technology/baseline` &mdash; 4-Year Localized Baseline engine with Gram Panchayat stratified clustering.
- `/research` &mdash; Peer-reviewed papers, benchmark studies, and yield correlation studies ($r = 0.85$).
- `/team` &mdash; Demo credentials, student project disclosures, and sandbox simulation policies.

### Farmer Experience (Plain Language UX)
- `/farmer/dashboard` &mdash; Primary pilot dashboard featuring **Plot #204 Nadia District Aman Paddy** ($CHF = 0.71$, Soil Moisture = $58\%$).
- `/farmer/farms` &mdash; 40-farm filterable registry with card/table views and interactive Leaflet map preview.
- `/farmer/farms/[id]` &mdash; Farm details with 10 sections, 7 multi-spectral charts (CHF, NDVI, LSWI, VH, FAPAR, Rainfall, GDD), and recovery timeline.
- `/farmer/disease` &mdash; AI Disease Scanner (38 classes, 92.9% accuracy benchmark, drag-and-drop & camera demo).
- `/farmer/optimization` &mdash; GA-PSO Nutrient & Irrigation optimizer with comparative convergence graphs.
- `/farmer/alerts` &mdash; Real-time push advisories and recommended actions.
- `/farmer/insurance` &mdash; Active policy terms and automatic claim trigger status.
- `/farmer/payments` &mdash; Direct benefit transfer receipts with simulated bank UTR references.

### Operations & Geospatial Intelligence
- `/operations/iot` &mdash; IoT Command Center with live 3-second stream across 20 ESP32 probes and pump relays.
- `/intelligence/map` &mdash; Satellite Intelligence GIS Map with multi-layer overlays (CHF, NDVI, LSWI, Radar VH).
- `/intelligence/weather` &mdash; Meteorological intelligence with triggerable **Heavy Rainfall Shock** simulation.

### Insurer & Underwriting Desk
- `/insurer/dashboard` &mdash; Underwriting portfolio metrics, loss ratios, and payout charts.
- `/insurer/risk-map` &mdash; Insurance Unit Risk Map with 5 color states (`NORMAL`, `LOW`, `MODERATE`, `HIGH`, `CLAIM TRIGGERED`).
- `/insurer/claims` &mdash; Searchable claims queue with multi-criteria filtering.
- `/insurer/claims/[id]` &mdash; **11-Section Claim Evidence Package** with verification and approval action controls.
- `/insurer/payouts` &mdash; Settlement engine with simulated RBI NEFT reference dispatch.
- `/insurer/audit` &mdash; Immutable chronological audit stream with SHA-256 cryptographic verification hashes.

### Administration & Exceptions
- `/admin/overview` &mdash; Infrastructure health, database entity counts, and API response latencies.
- `/admin/ai-models` &mdash; Model registry for MobileNetV3 and GA-PSO heuristics.
- `/admin/exceptions` &mdash; Interactive viewer for all 8 required polished empty and error states.

---

## 6. Demonstration Walkthrough Script

1. **Explore the Mission (`/`)**: Review the hero narrative and benchmark KPI cards.
2. **Inspect the 6-Stage Process (`/how-it-works`)**: Click from `01 OBSERVE` through `06 INSURE` to understand the biophysical rationale.
3. **Experience Farmer Simplicity (`/farmer/dashboard`)**:
   - Inspect Plot #204 in Nadia District.
   - Click **"Actuate 45-Min Drip Cycle"** to observe real-time relay switching.
4. **Diagnose Crop Pathology (`/farmer/disease`)**:
   - Select a sample from the validated library (e.g. *Bacterial Leaf Blight* or *Late Blight*).
   - Review the 5-step inference pipeline and agronomic prescription.
5. **Calibrate Nutrients (`/farmer/optimization`)**:
   - Adjust soil N-P-K sliders and click **"Run Optimization Algorithm"**.
   - Observe the comparative convergence curve showing Hybrid GA+PSO outperforming single heuristics.
6. **Trigger a Weather Shock (`/intelligence/weather`)**:
   - Click **"Trigger Heavy Rainfall Simulation"** (142mm recorded, 1,240 ha affected).
   - Observe real-time soil moisture and claim trigger updates.
7. **Adjudicate a Claim (`/insurer/claims/claim-clm-084`)**:
   - Open Claim #CLM-2026-084 for Plot #212 Ranaghat.
   - Inspect all 11 evidence sections (Satellite drop, IoT waterlogging, Ground truth, Entropy CHF).
   - Click **"Verify Claim"** &rarr; **"Approve Claim"** &rarr; **"Execute NEFT Settlement"**.
8. **Verify the Audit Ledger (`/insurer/audit`)**:
   - Confirm that the approval and settlement are permanently hashed with an immutable SHA-256 block signature.

---

## 7. Academic Integrity & Simulation Disclosure
All satellite imagery scenes, IoT hardware transmissions, and banking transaction references are high-fidelity, mathematically calibrated research simulations configured for West Bengal agricultural regions (Nadia, Burdwan, Hooghly, Murshidabad). No actual commercial banking credentials or paid Copernicus API keys are utilized.
